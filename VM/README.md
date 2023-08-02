1. Backup json file by Query
```
mongoexport --uri="mongodb://ecommerce:admin@localhost:27017" -d ecommerce --collection products --query='{"_id": {"$lte":{"$oid": "649942c8e9c823ca18daca14"}}}' --type=json --out output.json
```

2. Transfer JSON to JSONL and remove _id object (because not match characters column in BigQuery)
```
sudo apt-get install jq or sudo yum install jq
jq 'del(._id)' -c output.json > data_no_id.json
```

3. 
```
bq show --format=prettyjson bigquery-public-data:samples.wikipedia | jq '.schema.fields' 
```