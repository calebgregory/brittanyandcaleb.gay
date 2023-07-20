import { ParticipantGuest } from './types'

export const GUEST_COUNT_LIMIT = 10 // probably no one would actually do this, lol, but we should put an upper bound on the size of nested lists on our DynamoDB Items

export class GuestLimitExceededError extends Error {
  constructor(limit: number) {
    super(`GuestLimitExceeded: Sorry, that is too many guests (the limit is ${limit}).`)
    this.name = 'GuestLimitExceededError'
  }
}

export const raise_if_too_many_guests = (
  guests: ParticipantGuest[],
  limit = GUEST_COUNT_LIMIT
): ParticipantGuest[] => {
  if (guests.length > limit) {
    throw new GuestLimitExceededError(limit)
  }
  return guests
}
