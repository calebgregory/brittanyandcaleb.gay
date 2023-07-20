import AWS from 'aws-sdk'

import { config } from '../config'

AWS.config.update({ region: config.region })

/** https://dynobase.dev/dynamodb-nodejs/ */
export function dyn_client() {
  return new AWS.DynamoDB.DocumentClient()
}
