import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { CodePipeline, CodePipelineSource, ShellStep, Step } from 'aws-cdk-lib/pipelines';
import { ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { MyPipelineAppStage } from './stage';

export class CiCdAwsPipelineDemo1Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CiCdAwsPipelineDemo1Queue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'TestPipeline1',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('Seikida/ci-cd-aws-pipeline-demo1', 'main'), //Remember to change 
        commands: [
          'npm ci', 
          'npm run build', 
          'npx cdk synth'
        ]
      })
    });




    const testingStage = pipeline.addStage(new MyPipelineAppStage(this, "test", {
      env: { account: "723033854254", region: "ap-northeast-1" }
    }));
    
    testingStage.addPre(new ShellStep("Run Unit Tests", { 
      commands: [
        'npm install', 
        'npm test'] 
      })
    );

    testingStage.addPost(new ManualApprovalStep('Manual approval before production'));

    const stagingStage = pipeline.addStage(new MyPipelineAppStage(this, "stg", {
      env: { account: "723033854254", region: "ap-northeast-1" }
    }));

    stagingStage.addPost(new ManualApprovalStep('Manual approval before production'));


    

    const prodStage = pipeline.addStage(new MyPipelineAppStage(this, "prod", {
      env: { account: "723033854254", region: "ap-northeast-1" }
    }));


  }
}
