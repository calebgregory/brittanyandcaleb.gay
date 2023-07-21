import { Logger } from '@aws-lambda-powertools/logger'
import {
  ParticipantGuestInput,
  UpdateParticipantInput,
  UpdateParticipantResult,
} from 'brittanyandcaleb.gay.graphql-api/types'
import is_nil from 'lodash.isnil'

import { IdentityClaims } from '../authn'
import { config } from '../config'
import { dyn_transact_versioned_update_item } from '../dynamodb/update'

import { raise_if_not_authorized } from './authz'
import { participant_key } from './keys'
import { Participant } from './types'
import { raise_if_too_many_guests } from './validation'

const logger = new Logger()

const _updated_guests = (
  input_guests: ParticipantGuestInput[],
  curr_guests: Participant['guests'],
  now = new Date().toISOString()
) => {
  const curr_guests_name_onto_added_at = curr_guests.reduce<Record<string, string>>(
    (acc, { name, added_at }) => {
      acc[name] = added_at
      return acc
    },
    {}
  )
  // ^ note there's room for ambiguity here.  oh well.  we'll consider it tolerably unlikely.

  const updated_guests = raise_if_too_many_guests(
    input_guests.map(({ name }) => ({
      name,
      added_at: curr_guests_name_onto_added_at[name] || now,
    }))
  )

  // any "removed" guests will simply be missing from input_guests
  const updated_guest_names = new Set(updated_guests.map(({ name }) => name))
  const removed_guests = curr_guests.filter(({ name }) => !updated_guest_names.has(name))

  if (removed_guests.length) {
    logger.info('guests were removed', { removed_guests, updated_guests })
  }

  return updated_guests
}

const _authz_update_participant = (
  identity: IdentityClaims,
  input: UpdateParticipantInput,
  participant: Participant,
  now = new Date().toISOString()
): Participant => {
  raise_if_not_authorized(identity, participant)

  participant = {
    ...participant,
    family_name: is_nil(input.family_name) ? participant.family_name : input.family_name,
    given_name: is_nil(input.given_name) ? participant.given_name : input.given_name,
    attending: is_nil(input.attending) ? participant.attending : input.attending,
    guests: is_nil(input.guests)
      ? participant.guests
      : _updated_guests(input.guests, participant.guests, now),
    updated_at: now,
    updated_by: identity.email,
  }

  raise_if_not_authorized(identity, participant)
  return participant
}

export const update_participant = async (
  identity: IdentityClaims,
  input: UpdateParticipantInput
): Promise<UpdateParticipantResult> => {
  const updated_participant = await dyn_transact_versioned_update_item<Participant>(
    config.dyn_table_name,
    participant_key(input.email),
    (participant) => _authz_update_participant(identity, input, participant)
  )

  logger.info('updated participant', { PK: updated_participant.PK })

  return { participant: updated_participant }
}
