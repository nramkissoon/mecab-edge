#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/infra-stack';

const app = new cdk.App();
new InfraStack(app, 'MecabInfraStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  env: { account: '126258523001', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
new InfraStack(app, 'MecabInfraStackApSouth1', {
  env: { account: '126258523001', region: 'ap-south-1' }
})
new InfraStack(app, 'MecabInfraStackEuWest2', {
  env: { account: '126258523001', region: 'eu-west-2' }
})
new InfraStack(app, 'MecabInfraStackEuCentral1', {
  env: { account: '126258523001', region: 'eu-central-1' }
})
new InfraStack(app, 'MecabInfraStackSaEast1', {
  env: { account: '126258523001', region: 'sa-east-1' }
})
new InfraStack(app, 'MecabInfraStackApNortheast1', {
  env: { account: '126258523001', region: 'ap-northeast-1' }
})
new InfraStack(app, 'MecabInfraStackApNortheast3', {
  env: { account: '126258523001', region: 'ap-northeast-3' }
})
new InfraStack(app, 'MecabInfraStackUsWest1', {
  env: { account: '126258523001', region: 'us-west-1' }
})
new InfraStack(app, 'MecabInfraStackApSoutheast1', {
  env: { account: '126258523001', region: 'ap-southeast-1' }
})
new InfraStack(app, 'MecabInfraStackApSoutheast2', {
  env: { account: '126258523001', region: 'ap-southeast-2' }
})