import { Logger } from '@aws-lambda-powertools/logger'
import {
  CreateParticipantInput,
  CreateParticipantResult,
} from 'brittanyandcaleb.gay.graphql-api/types'

import { IdentityClaims } from '../authn/types'
import { config } from '../config'
import { dyn_client } from '../dynamodb/client'

import { raise_if_not_authorized } from './authz'
import { participant_key } from './keys'
import { Participant } from './types'
import { raise_if_too_many_guests } from './validation'

const logger = new Logger()

const _authz_participant_from_input = (
  identity: IdentityClaims,
  input: CreateParticipantInput,
  now = new Date().toISOString()
): Participant => {
  return raise_if_not_authorized(identity, {
    ...participant_key(input.email),
    email: input.email,
    given_name: identity.given_name,
    family_name: identity.family_name,
    attending: input.attending || false,
    guests: raise_if_too_many_guests(
      (input.guests || []).map(({ name }) => ({ name, added_at: now }))
    ),
    created_at: now,
    created_by: identity.email,
    updated_at: now,
    updated_by: identity.email,
    item_version: 0,
    last_written_at: now,
  })
}

export const create_participant = async (
  identity: IdentityClaims,
  input: CreateParticipantInput
): Promise<CreateParticipantResult> => {
  const participant = _authz_participant_from_input(identity, input)

  await dyn_client().put({ TableName: config.dyn_table_name, Item: participant }).promise()

  logger.info('put participant', { PK: participant.PK })

  return { participant }
}
