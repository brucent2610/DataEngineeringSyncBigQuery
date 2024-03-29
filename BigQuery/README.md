1. Prepare environment
```
DATASET_ID=ecommerce_tiki
TABLE_ID=products
```

2. Add iam role to SERVICE ACCOUNT 
```
gcloud projects add-iam-policy-binding $PROJECT_ID --member serviceAccount:$SERVICE_ACCOUNT --role roles/bigquery.dataEditor
```

3. Create Dataset
```
bq --location=$REGION mk \
    --dataset \
    --description="Tiki Products" \
    $PROJECT_ID:$DATASET_ID
```

4. Create Table
```
bq mk \
    --table \
    --description "Tiki Products" \
    $PROJECT_ID:$DATASET_ID.$TABLE_ID \
    schema.json
```

5. Delete Table
```
bq rm -f -t $PROJECT_ID:$DATASET_ID.$TABLE_ID
```

6. Show schema fields
```
bq show --format=prettyjson $PROJECT_ID:$DATASET_ID.test | jq '.schema.fields' 
```