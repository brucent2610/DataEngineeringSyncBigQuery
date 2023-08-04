1. Prepare evironment variables
```
PROJECT_ID=`gcloud config get-value project`
PROJECT_NUMBER=$(gcloud projects list --filter="project_id:$PROJECT_ID" --format='value(project_number)')
SERVICE_ACCOUNT=$(gsutil kms serviceaccount -p $PROJECT_NUMBER)
BUCKET=${PROJECT_ID}-ecommerce-bucket
REGION=asia-southeast1

DATASET_ID=ecommerce_tiki
TABLE_ID=products

FUNCTION_EVENT_BUCKET_FINALIZED_NAME=$BUCKET-finalized-function
FUNCTION_EVENT_BUCKET_METADATA_UPDATED_NAME=$BUCKET-metadataUpdated-function
```

2. Add iam role to SERVICE ACCOUNT
```
gcloud projects add-iam-policy-binding $PROJECT_ID --member serviceAccount:$SERVICE_ACCOUNT --role roles/cloudfunctions.developer
```

3. Deploy Cloud Function
```
gcloud functions deploy ${FUNCTION_EVENT_BUCKET_FINALIZED_NAME} \
--gen2 \
--runtime=nodejs18 \
--region=${REGION} \
--source=. \
--entry-point=index \
--trigger-event-filters="type=google.cloud.storage.object.v1.finalized" \
--trigger-event-filters="bucket=$BUCKET" \
--max-instances=30 \
--set-env-vars DATASET_ID=$DATASET_ID,TABLE_ID=$TABLE_ID


gcloud functions deploy ${FUNCTION_EVENT_BUCKET_METADATA_UPDATED_NAME} \
--gen2 \
--runtime=nodejs18 \
--region=${REGION} \
--source=. \
--entry-point=index \
--trigger-event-filters="type=google.cloud.storage.object.v1.metadataUpdated" \
--trigger-event-filters="bucket=$BUCKET" \
--max-instances=30 \
--set-env-vars DATASET_ID=$DATASET_ID,TABLE_ID=$TABLE_ID
```

4. View logs
```
gcloud beta functions logs read $FUNCTION_EVENT_BUCKET_FINALIZED_NAME --gen2 --limit=100 --region=$REGION
```

5. Delete Function
```
gcloud functions delete $BUCKET-trigger-function --region=$REGION
```