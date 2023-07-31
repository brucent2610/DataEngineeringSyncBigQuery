1. Prepare evironment variables
```
FUNCTION_EVENT_BUCKET_FINALIZED_NAME=$BUCKET-event-finalized-function
```

2. Add iam role to SERVICE ACCOUNT
```
gcloud projects add-iam-policy-binding $PROJECT_ID --member serviceAccount:$SERVICE_ACCOUNT --role roles/cloudfunctions.developer
```

3. Deploy Cloud Function
```
gcloud functions deploy ${FUNCTION_EVENT_BUCKET_FINALIZED_NAME} \
--gen2 \
--runtime=nodejs20 \
--region=${REGION} \
--source=. \
--entry-point=index \
--trigger-event-filters="type=google.cloud.storage.object.v1.finalized" \
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