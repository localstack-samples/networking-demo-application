# Network Connectivity Demo

This project demonstrates the new seamless network connectivity available in LocalStack.

This is all powered by our DNS server, which is able to resolve `localhost.localstack.cloud` to the LocalStack container regardless of network configuration.

## Architecture

This project is meant to replicate a typical developer setup.
The application code is run from a Docker container separate from LocalStack, but the application integrates with AWS features such as SQS and Lambda.

This fictional scenario is designed around handling file uploads, performing some background processing, and storing the information into a database.
The application container handles the web requests, and enqueues a processing job to SQS.
A Lambda function reads messages from this queue and performs the processing - in this case, counts the size of the object, and adds an entry to a DynamoDB table for later querying.
The web application allows for past uploads to be viewed, and their sizes analysed.

## Setup

To recreate this example application, run the following commands:

```
docker compose up
# visit http://localhost:5000
```

