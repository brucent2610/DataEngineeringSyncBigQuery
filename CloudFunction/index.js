// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// [START functions_helloworld_storage]
/**
 * Generic background Cloud Function to be triggered by Cloud Storage.
 * This sample works for all Cloud Storage CRUD operations.
 *
 * @param {object} file The Cloud Storage file metadata.
 * @param {object} context The event metadata.
 */
// Import the Google Cloud client libraries
const {BigQuery} = require('@google-cloud/bigquery');
const {Storage} = require('@google-cloud/storage');

// Instantiate clients
const bigquery = new BigQuery();
const storage = new Storage();

const schema = require('./schema.json');

exports.index = async (file, context) => {
    console.log(`  Event: ${context.eventId}`);
    console.log(`  Event Type: ${context.eventType}`);
    console.log(`  Bucket: ${file.bucket}`);
    console.log(`  File: ${file.name}`);
    console.log(`  Metageneration: ${file.metageneration}`);
    console.log(`  Created: ${file.timeCreated}`);
	console.log(`  Updated: ${file.updated}`);

	const bucketName = file.bucket;
	const filename = file.name;
	
	const metadata = {
		sourceFormat: 'JSON',
		autodetect: true
	};

	// Load data from a Google Cloud Storage file into the table
	const [job] = await bigquery
		.dataset(process.env.DATASET_ID)
		.table(process.env.TABLE_ID)
		.load(storage.bucket(bucketName).file(filename), metadata);

	// load() waits for the job to finish
	console.log(`Job ${job.id} completed.`);
};
// [END functions_helloworld_storage]
