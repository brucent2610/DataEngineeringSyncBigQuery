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