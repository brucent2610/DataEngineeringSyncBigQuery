1. Deploy Cloud Function
```
gcloud functions deploy $BUCKET-trigger-function \
--gen2 \
--runtime=nodejs20 \
--region=${REGION} \
--source=. \
--entry-point=index \
--trigger-event-filters="type=google.cloud.storage.object.v1.finalized" \
--trigger-event-filters="bucket=$BUCKET"
```