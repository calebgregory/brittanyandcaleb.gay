import { Logger } from '@aws-lambda-powertools/logger'
import {
  CreateParticipantInput,
  CreateParticipantResult,
} from 'brittanyandcaleb.gay.graphql-api/types'

import { Identity } from '../authn/types'
import { config } from '../config'
import { dyn_client } from '../dynamodb/client'

import { Participant } from './types'

const logger = new Logger()

const _participant_from_input = (
  identity: Identity,
  input: CreateParticipantInput,
  now = new Date().toISOString()
): Participant => {
  return {
    PK: `PARTICIPANT#${input.email}`,
    SK: 'A',
    email: input.email,
    attending: input.attending || false,
    guests: (input.guests || []).map(({ name }) => ({ name, added_at: now })),
    created_at: now,
    created_by: identity.email,
    updated_at: now,
    updated_by: identity.email,
  }
}

export const create_participant = async (
  identity: Identity,
  input: CreateParticipantInput
): Promise<CreateParticipantResult> => {
  const participant = _participant_from_input(identity, input)
  const result = await dyn_client()
    .put({ TableName: config.dyn_table_name, Item: participant })
    .promise()
  logger.info('put participant', { result })
  return { participant }
}
