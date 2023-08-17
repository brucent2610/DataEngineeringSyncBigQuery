# Overview
- Developer: Phong Nguyen.
- Target release: 6 August, 2023.
- Epic: Sync Up all data from ecommerce to BigQuery
- Coach: Huy Do.

# Objective
Data is uploaded and used in MongoDB in VM, transfer current data to BigQuery, Automation sync up latest data to BigQuery

# Goals
- Collecting products to BigQuery
- Statistic the data 
- Analysis data
- Suggestion to Techlead to best cost

# Overall requirement 
Data is uploaded and used in MongoDB in VM
- Transfer current data to BigQuery
- Automation sync up latest data to GCS (Google Cloud Storage)
- New data file in GCS, sync to BigQuery
- Create data mart about sellers and products from that sellers to Data Analysis
- Connect with Data Studio
+ Number of products in main categories
+ Các nhãn hàng xuất xứ từ Trung Quốc phân bố ở các danh mục lớn ra sao
+ Brand from China in main categories
+ Relation between products rating and price
+ Top 10 sellers which most products

# Architecture
- [Architecture Version 01](https://i.imgur.com/dfpjDDR.png)

# Reference
- https://cloud.google.com/functions/docs/reference/iam/roles
- https://cloud.google.com/functions/docs/tutorials/storage
- https://cloud.google.com/bigquery/docs/loading-data-cloud-storage-csv#bigquery_load_table_partitioned-nodejs

# How to use
- [Prepare the GCS](https://github.com/brucent2610/DataEngineeringSyncBigQuery/tree/main/GCS/README.md)
- [Prepare the BigQuery](https://github.com/brucent2610/DataEngineeringSyncBigQuery/blob/main/BigQuery/README.md)
- [Prepare the Cloud Function](https://github.com/brucent2610/DataEngineeringSyncBigQuery/blob/main/CloudFunction/README.md)
- [Prepare the VM](https://github.com/brucent2610/DataEngineeringSyncBigQuery/blob/main/VM/README.md)

# Result data in DataStudio
[Reports](https://i.imgur.com/6fb23fJ.png)

# Note 
- Hướng tới file Avro và Parquet

