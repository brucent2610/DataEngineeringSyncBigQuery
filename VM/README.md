1. Prepare the evironment variables
```
VM_NAME=ecommerce-mongo
```

1. Backup json file by Query
```
mongoexport --uri="mongodb://ecommerce:admin@localhost:27017" -d ecommerce --collection products --query='{"_id": {"$lte":{"$oid": "649942c8e9c823ca18daca14"}}}' --type=json --out output.json
```

2. Transfer JSON to JSONL and remove _id object (because not match characters column in BigQuery)
```
sudo apt-get install jq or sudo yum install jq
jq 'del(._id)' -c output.json > data_no_id.json
```

3. Create Instance
```
gcloud compute instances create $VM_NAME \
  --machine-type=e2-micro \
  --zone asia-southeast1-b \
  --image-project=ubuntu-os-cloud \
  --image-family=ubuntu-2204-lts \
  --metadata-from-file=startup-script=startup.sh
```

4. Create User MongoDB
```
db.createUser(
    {
        user: "ecommerce",
        pwd: "azrArnHDqbY93QGU",
        roles: [
            {
                role: "readWrite",
                db: "ecommerce"
            }
        ]
    }
);
db.createUser(
    {
        user: "ecommerce2",
        pwd: "azrArnHDqbY93QGU",
        roles: [
            {
                role: "readWrite",
                db: "ecommerce"
            }
        ]
    }
);
db.createUser({
    user: "admin",
    pwd: "nZ5b8ZA4vBaV3MeQ",
    roles: [ 
        { 
            role: "userAdminAnyDatabase", 
            db: "admin" 
        } 
    ]
})
```

5. Open Mongo Port to Connect client
```
gcloud compute firewall-rules create rule-allow-tcp-27017 --source-ranges 0.0.0.0/0 --target-tags allow-tcp-27017 --allow tcp:27017
gcloud compute instances add-tags $VM_NAME --tags allow-tcp-27017
gcloud compute firewall-rules list
```

6. Connect URI MongoDB in client
```
mongosh mongodb://ecommerce:azrArnHDqbY93QGU@34.143.184.177:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.3&tls=true&authSource=ecommerce
```

7. Restore Database
```
mongorestore -u=ecommerce2 -p=azrArnHDqbY93QGU --authenticationDatabase=admin --port=27017 --host=34.143.184.177 -d=ecommerce --gzip ./dump

mongorestore -u=admin -p=nZ5b8ZA4vBaV3MeQ --authenticationDatabase=ecommerce --authenticationMechanism SCRAM-SHA-1 --host=34.143.184.177 -d=ecommerce --gzip ./dump
```