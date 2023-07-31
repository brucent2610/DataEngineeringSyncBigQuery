1. Prepare the evironment variables
```
PROJECT_ID=`gcloud config get-value project`
PROJECT_NUMBER=$(gcloud projects list --filter="project_id:$PROJECT_ID" --format='value(project_number)')
SERVICE_ACCOUNT=$(gsutil kms serviceaccount -p $PROJECT_NUMBER)
BUCKET=${PROJECT_ID}-ecommerce-bucket
```

2. To use Cloud Storage functions, grant the pubsub.publisher role to the Cloud Storage service account:
```
gcloud projects add-iam-policy-binding $PROJECT_ID --member serviceAccount:$SERVICE_ACCOUNT --role roles/pubsub.publisher
```

3. Create Bucket
```
gsutil mb -c standard -l asia-southeast1 gs://${BUCKET}
```
**Note:**
- c: stands for class Standard.
- l: stands for location asia-southeast1 (cheapest price in Asia and cheapest in all location).
- Because we are in Vietnam and nearest with Singapore, asia-southeast1 is the best choice.
**Reference**
- [Google Cloud Storage Pricing](https://cloud.google.com/storage/pricing#asia)

4. Delete Bucket when finish to save money
```
gsutil rm -rf gs://${BUCKET}/*
gsutil rb gs://${BUCKET}
```
