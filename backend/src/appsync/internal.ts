import { AppSyncResolverHandler } from 'aws-lambda'
import {
  MutationCreateParticipantArgs,
  MutationUpdateParticipantArgs,
  Mutation,
} from 'brittanyandcaleb.gay.graphql-api/types'

import { ForbiddenError } from '../authz'
import { logger } from '../log'
import { create_participant } from '../participants/create'

export const AS_LAM_createParticipant: AppSyncResolverHandler<
  MutationCreateParticipantArgs,
  Mutation['createParticipant']
> = async (event, context) => {
  logger.info('got request', { event, context })
  const { identity, arguments: args } = event

  if (!identity || !('claims' in identity)) {
    throw new ForbiddenError()
  }

  return create_participant(identity.claims, args.input)
}

/*
export const AS_LAM_updateParticipant: AppSyncResolverHandler<
  MutationUpdateParticipantArgs,
  Mutation['createParticipant']
> = async (event, context) => {
  logger.info('got request', { event, context })
}
*/
