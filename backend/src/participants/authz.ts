import { IdentityClaims } from '../authn/types'
import { ForbiddenError } from '../authz'

import { Participant } from './types'

export const raise_if_not_authorized = (
  identity: IdentityClaims,
  participant: Participant
): Participant => {
  if (identity.email !== participant.email) {
    throw new ForbiddenError()
  }

  return participant
}
