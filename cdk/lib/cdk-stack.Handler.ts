import { SQSHandler, SQSEvent } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { S3Client, HeadObjectCommand, ListBucketsCommand } from '@aws-sdk/client-s3';

const REGION: string = "us-east-1";
const ENDPOINT_URL: string = "http://localhost.localstack.cloud:4566";
const clientConfig = {
  region: REGION,
  endpoint: ENDPOINT_URL,
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  }
};


export const handler: SQSHandler = async (event: SQSEvent) => {
  const dynamoDBClient = new DynamoDBClient(clientConfig);
  const s3Client = new S3Client({
    ...clientConfig,
    // override s3 specific fields
    forcePathStyle: true,
    endpoint: "http://s3.localhost.localstack.cloud:4566",
  });

  for (const record of event.Records) {
    const { id, bucket, filename } = JSON.parse(record.body);
    const n = await computeFileSize(s3Client, bucket, id);

    // insert into the database
    const command = new PutItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        pk: { S: id },
        bucket: { S: bucket },
        filename: { S: filename },
        size: { N: n.toString() },
      },
    });

    await dynamoDBClient.send(command);
  }
}

const computeFileSize = async (client: S3Client, bucket: string, id: string): Promise<number> => {
  console.log({ bucket, id });
  const command = new HeadObjectCommand({
    Bucket: bucket,
    Key: id,
  });
  const res = await client.send(command);
  return res.ContentLength || 0;
};
