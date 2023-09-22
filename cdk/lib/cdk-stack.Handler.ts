import { SQSHandler, SQSEvent } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";


export const handler: SQSHandler = async (event: SQSEvent) => {
  console.log(event);
}
