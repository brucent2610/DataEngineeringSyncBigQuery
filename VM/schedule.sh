#! /bin/bash

# Run command
# cd ~/tiki && sh ./schedule.sh > ./logs/$BACKUP_TIME.log

# Prepare variables
PROJECT_ID=`gcloud config get-value project`
BUCKET=${PROJECT_ID}-ecommerce-bucket
MONGO_USERNAME=ecommerce
MONGO_PASS=bW3VULd9BQN6zGxr

BACKUP_TIME=$(date '+%Y-%m-%d')

#Backup all products
# mongoexport -u=$MONGO_USERNAME -p=$MONGO_PASS --authenticationDatabase=admin -d ecommerce -c products --type=json --out products-$BACKUP_TIME.json
mongoexport -u=$MONGO_USERNAME -p=$MONGO_PASS --authenticationDatabase=admin -d ecommerce -c products -q='{ "need_sync": true }' --type=json --out products-$BACKUP_TIME.json

# Remove fields not use
jq 'del(._id,.time,.need_sync)' -c products-$BACKUP_TIME.json > transformed/products-$BACKUP_TIME-converted.json

# Sync current folder
cd ~/tiki/transformed
gsutil -m -o "GSUtil:parallel_thread_count=4" rsync -d -r . gs://${BUCKET}

# Update records synced to gcs
cd ~/tiki
mongosh -u=$MONGO_USERNAME -p=$MONGO_PASS --authenticationDatabase=admin ecommerce --eval 'db.products.updateMany({"need_sync": true}, { $set: { "need_sync": null } })'



