import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "Bucket")
    const queue = new sqs.Queue(this, "Queue")
    const table = new dynamodb.Table(this, "Table", {
      partitionKey: {
        name: "pk",
        type: dynamodb.AttributeType.STRING,
      },
    });

    // event handler
    const handler = new nodejs.NodejsFunction(this, "Handler", {
      environment: {
        DYNAMODB_TABLE: table.tableName,
      },
    });
    const eventSource = new lambdaEventSources.SqsEventSource(queue);
    handler.addEventSource(eventSource);


    // ssm parameters
    new ssm.StringParameter(this, "BucketParameter", {
      parameterName: "/network-demo/bucket",
      stringValue: bucket.bucketName,
    });
    new ssm.StringParameter(this, "QueueUrlParameter", {
      parameterName: "/network-demo/queue",
      stringValue: queue.queueUrl,
    });
    new ssm.StringParameter(this, "TableNameParameter", {
      parameterName: "/network-demo/table",
      stringValue: table.tableName,
    });
  }
}
