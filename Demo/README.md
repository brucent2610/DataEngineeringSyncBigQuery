1. Prepare variables
```
PROJECT_ID=`gcloud config get-value project`
SERVICE_ACCOUNT=$(gsutil kms serviceaccount)
BUCKET=${PROJECT_ID}-ecommerce-bucket
REGION=asia-southeast1

DATASET_ID=ecommerce
TABLE_ID=products
VIEW_ID=products_view
```

2. Can not access another column from original table in view
```
SELECT name, orderedQuantity FROM `data-engineer-393307.ecommerce.products_view` LIMIT 1000
```

3. Show permission
```
bq show --format=prettyjson ecommerce > dataset_ecommerce.json
```

4. Update permission
```
bq update --source dataset_ecommerce.json ecommerce
```

5. Show table permission
```
bq get-iam-policy $PROJECT_ID:$DATASET_ID.$TABLE_ID > table_products_ecommerce.json
```

6. Grant access Table
```
{
    "bindings": [
        {
        "members": [
            "user:${EMAIL}"
        ],
        "role": "roles/bigquery.dataViewer"
        }
    ],
    "etag": "BwYCANYqrXg=",
    "version": 1
}
bq set-iam-policy $PROJECT_ID:$DATASET_ID.$TABLE_ID table_products_ecommerce.json
```

5. Show view permission
```
bq get-iam-policy $PROJECT_ID:$DATASET_ID.$VIEW_ID > table_products_view_ecommerce.json
```

6. Grant access View
```
{
    "bindings": [
        {
            "members": [
                "user:${EMAIL}"
            ],
            "role": "roles/bigquery.dataViewer"
        }
    ],
    "etag": "BwYCANYqrXg=",
    "version": 1
}
bq set-iam-policy $PROJECT_ID:$DATASET_ID.$VIEW_ID table_products_view_ecommerce.json
```