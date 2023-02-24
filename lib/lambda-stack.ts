import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, FunctionUrl, InlineCode, Runtime, Code} from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { HttpMethod, FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda";

export class MyLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, stageName: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const lambda = new Function(this, 'LambdaFunction', {
      runtime: Runtime.NODEJS_14_X, //using node for this, but can easily use python or other (NODEJS_12_X is deprecated)
      handler: 'handler.handler',
      code: Code.fromAsset(path.join(__dirname, 'lambda')), //resolving to ./lambda directory
      environment: { "stageName": stageName } //inputting stagename
    });

    const url = lambda.addFunctionUrl({
        authType: FunctionUrlAuthType.NONE,
        cors: {
          allowedMethods: [HttpMethod.ALL],
          /// allowedOrigins: ["https://dev.classmethod.jp"],
        },
    });

  }   
}