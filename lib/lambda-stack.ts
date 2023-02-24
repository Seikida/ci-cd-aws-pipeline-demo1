import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, FunctionUrl, InlineCode, Runtime, Code, FunctionUrlAuthType, HttpMethod} from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
// import { RetentionDays } from 'aws-cdk-lib/aws-logs';
// import { Duration } from 'aws-cdk-lib';

export class MyLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, stageName: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambda = new Function(this, 'LambdaFunction', {
      runtime: Runtime.NODEJS_14_X, //using node for this, but can easily use python or other (NODEJS_12_X is deprecated)
      handler: 'handler.handler',
      code: Code.fromAsset(path.join(__dirname, 'lambda')), //resolving to ./lambda directory
      description: 'Jojo lambda function',
      // timeout: Duration.seconds(1),
      // functionName: 'jojo-lambda-function',
      // memorySize: 128,
      // logRetention: RetentionDays.THREE_DAYS,
      environment: { "stageName": stageName } //inputting stagename
    });
    
    lambda.addFunctionUrl({
        authType: FunctionUrlAuthType.NONE,
        cors: {
            allowedMethods: [HttpMethod.GET], // HttpMethod.ALL
            allowedOrigins: ["*"],
            // maxAge: Duration.minutes(1),
        }
    })
  }   
}