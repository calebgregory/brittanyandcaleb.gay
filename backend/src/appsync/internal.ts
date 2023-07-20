import { AppSyncResolverHandler } from 'aws-lambda'
import {
  Query,
  QueryGetParticipantArgs,
  Mutation,
  MutationCreateParticipantArgs,
  MutationUpdateParticipantArgs,
} from 'brittanyandcaleb.gay.graphql-api/types'

import { ForbiddenError } from '../authz'
import { logger } from '../log'
import { create_participant } from '../participants/create'
import { get_participant } from '../participants/get'
import { update_participant } from '../participants/update'

export const AS_LAM_createParticipant: AppSyncResolverHandler<
  MutationCreateParticipantArgs,
  Mutation['createParticipant']
> = async (event, _context) => {
  logger.info('got request', { event })

  if (!event.identity || !('claims' in event.identity)) {
    throw new ForbiddenError()
  }

  return create_participant(event.identity.claims, event.arguments.input)
}

export const AS_LAM_getParticipant: AppSyncResolverHandler<
  QueryGetParticipantArgs,
  Query['getParticipant']
> = async (event, _context) => {
  logger.info('got request', { event })

  if (!event.identity || !('claims' in event.identity)) {
    throw new ForbiddenError()
  }

  return get_participant(event.identity.claims, event.arguments.input)
}

export const AS_LAM_updateParticipant: AppSyncResolverHandler<
  MutationUpdateParticipantArgs,
  Mutation['updateParticipant']
> = async (event, context) => {
  logger.info('got request', { event, context })

  if (!event.identity || !('claims' in event.identity)) {
    throw new ForbiddenError()
  }

  return update_participant(event.identity.claims, event.arguments.input)
}
