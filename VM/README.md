1. Prepare the evironment variables
```
PROJECT_ID=`gcloud config get-value project`
SERVICE_ACCOUNT=$(gsutil kms serviceaccount)
BUCKET=${PROJECT_ID}-ecommerce-bucket
REGION=asia-southeast1
ZONE=asia-southeast1-b

VM_NAME=ecommerce-mongo

BACKUP_TIME=$(date '+%Y-%m-%d')
```

1. Backup json file by Query for testing
```
mongoexport --uri="mongodb://${ECOMMERCE_USER}:${ECOMMERCE_PASS}@${HOST}:27017" -d ${ECOMMERCE_DB} --collection ${ECOMMERCE_TABLE} --query='{"_id": {"$lte":{"$oid": "649942c8e9c823ca18daca14"}}}' --type=json --out products-${BACKUP_TIME}.json
```

2. Transfer JSON to JSONL and remove _id object (because not match characters column in BigQuery)
```
sudo apt-get install jq or sudo yum install jq
jq 'del(._id,.time,.progress_mysql_status)' -c products-${BACKUP_TIME}.json > transformed/products-${BACKUP_TIME}-converted.json
```

3. Create Instance
```
gcloud compute instances create $VM_NAME \
  --machine-type=e2-micro \
  --zone ${ZONE} \
  --image-project=ubuntu-os-cloud \
  --image-family=ubuntu-2204-lts \
  --boot-disk-size=20G
  --scopes=storage-rw
  --metadata-from-file=startup-script=startup.sh
```

4. Create User MongoDB
```
db.createUser(
    {
        user: "${ECOMMERCE_USER}",
        pwd: "${ECOMMERCE_PASS}",
        roles: [
            {
                role: "readWrite",
                db: "${ECOMMERCE_DB}"
            }
        ]
    }
);
db.createUser({
    user: "admin",
    pwd: "${ADMIN_PASS}",
    roles: [ 
        { 
            role: "userAdminAnyDatabase", 
            db: "admin" 
        } 
    ]
});
db.products.updateMany({}, {
    $set : {
        "time" : new ISODate("2023-08-02")
    }
});
```

5. Open Mongo Port to Connect client
```
gcloud compute firewall-rules create rule-allow-tcp-27017 --source-ranges 0.0.0.0/0 --target-tags allow-tcp-27017 --allow tcp:27017
gcloud compute instances add-tags $VM_NAME --tags allow-tcp-27017
gcloud compute firewall-rules list
```

6. Connect URI MongoDB in client
```
mongosh -u ${USERNAME} -p ${ECOMMERCE_PASS} --host ${HOST}
```

7. Restore Database
```
mongorestore -u=${USERNAME} -p=${ECOMMERCE_PASS} --authenticationDatabase=admin --port=27017 --host=${HOST} -d=${ECOMMERCE_DB} --gzip ./folder/
```

8. Backup
```
mongoexport -u=${USERNAME} -p=${ECOMMERCE_PASS} --authenticationDatabase=admin -d ${ECOMMERCE_DB} -c ${ECOMMERCE_TABLE} --type=json --out products-${BACKUP_TIME}.json
```

9. Stop Instance
```
gcloud compute instances stop $VM_NAME --zone=${ZONE}
```

10. Start Instance
```
gcloud compute instances start $VM_NAME --zone=${ZONE}
```

11. Set service account Instance
```
gcloud compute instances set-service-account $VM_NAME --scopes=storage-rw --zone=${ZONE}
```

12. Prepare crontab
```
crontab -e
# add new line in file
0 20 * * * cd ~/tiki && sh ./schedule.sh > ./logs/$BACKUP_TIME.log
```
