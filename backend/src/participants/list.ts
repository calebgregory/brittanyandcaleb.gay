import { config } from '../config'
import { dyn_client } from '../dynamodb/client'

import { Participant } from './types'

export const list_all_participants = async (): Promise<Participant[]> => {
  const resp = await dyn_client()
    .scan({ TableName: config.dyn_table_name, Limit: 1000 }) // there will not be this many
    .promise()

  return resp.Items as Participant[]
}
