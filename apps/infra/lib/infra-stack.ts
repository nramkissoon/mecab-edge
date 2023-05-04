import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { DockerImageFunction, DockerImageCode, Function, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import {Repository} from "aws-cdk-lib/aws-ecr"
import { LambdaFunction, addLambdaPermission } from 'aws-cdk-lib/aws-events-targets';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'InfraQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const rule = new Rule(
      this, "lambda-warmer-rule", {schedule: Schedule.rate(cdk.Duration.minutes(5))}
    )

    const mecabLambda = new DockerImageFunction(this, "mecab-lambda", {
      functionName: 'mecab-lambda',
      timeout: cdk.Duration.seconds(15),
      memorySize: 256,
      code: DockerImageCode.fromEcr(
        Repository.fromRepositoryName(this, "mecab-ecr-repo", "mecab-edge"),
        {
          tagOrDigest: "latest"
        }
      ),
      environment: {
        "HOME"  : "/tmp",
      }
    })

    const lambdaWarmer = new Function(this, "mecab-lambda-warmer", {
      functionName: 'mecab-lambda-warmer',
      runtime: Runtime.NODEJS_14_X,
      timeout: cdk.Duration.seconds(5),
      code: Code.fromAsset("./lib/"),
      handler: "lambdaWarmer.handler"
    })

    mecabLambda.grantInvoke(lambdaWarmer)

    rule.addTarget(new LambdaFunction(lambdaWarmer))

    addLambdaPermission(rule, lambdaWarmer)
  }
}
