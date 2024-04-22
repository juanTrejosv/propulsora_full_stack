import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  AmplifyGraphqlApi,
  AmplifyGraphqlDefinition
} from '@aws-amplify/graphql-api-construct';
import path = require('path');
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class MyCdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new AmplifyGraphqlApi(this, 'SqlBoundApi', {
      apiName: 'MySqlBoundApi',
      definition: AmplifyGraphqlDefinition.fromFilesAndStrategy(
        [path.join(__dirname, 'schema.sql.graphql')],
        {
          name: 'MySQLSchemaDefinition',
          dbType: 'MYSQL',
          vpcConfiguration: {
            vpcId: 'vpc-123456',
            securityGroupIds: ['sg-123', 'sg-456'],
            subnetAvailabilityZoneConfig: [
              { subnetId: 'sn-123456', availabilityZone: 'us-east-1a' },
              { subnetId: 'sn-987654', availabilityZone: 'us-east-1b' },
            ],
          },
          dbConnectionConfig: {
            databaseName: 'database',
            port: 3306,
            hostname: 'database-1-instance-1.id.region.rds.amazonaws.com',
            secretArn:
              'arn:aws:secretsmanager:Region1:123456789012:secret:MySecret-a1b2c3',
          },
        }
      ),
      authorizationModes: {
        defaultAuthorizationMode: 'API_KEY',
        apiKeyConfig: {
          expires: cdk.Duration.days(30),
        },
      },
    });
  }
}
