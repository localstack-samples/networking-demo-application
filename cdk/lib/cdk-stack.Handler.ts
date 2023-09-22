import { SQSHandler, SQSEvent } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";


export const handler: SQSHandler = async (event: SQSEvent) => {
  const client = new DynamoDBClient({ region: "us-east-1", endpoint: "http://localhost.localstack.cloud:4566", });

  for (const record of event.Records) {
    const { id, bucket, filename } = JSON.parse(record.body);
    console.log(id, bucket, filename);
    const n = 10;
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

    try {
      await client.send(command);
    } catch (err) {
      console.error(err);
    }
  }
}
