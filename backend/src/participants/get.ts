import { GetParticipantInput, GetParticipantResult } from 'brittanyandcaleb.gay.graphql-api/types'

import { IdentityClaims } from '../authn'
import { config } from '../config'
import { dyn_client } from '../dynamodb/client'

import { raise_if_not_authorized } from './authz'
import { participant_key } from './keys'
import { Participant } from './types'

export const get_participant = async (
  identity: IdentityClaims,
  input: GetParticipantInput
): Promise<GetParticipantResult> => {
  const resp = await dyn_client()
    .get({ TableName: config.dyn_table_name, Key: participant_key(input.email) })
    .promise()

  if (!resp.Item) {
    return { participant: null }
  }

  // Yes, we pay for a GetItem that would be wasted here if the identity is
  // unauthzed.  Hopefully that does not bite us later.
  return { participant: raise_if_not_authorized(identity, resp.Item as Participant) }
}
