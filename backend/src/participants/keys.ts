import { Participant, ParticipantKey } from './types'

export const participant_key = (participant_or_email: string | Participant): ParticipantKey => {
  if (typeof participant_or_email === 'string') {
    return {
      PK: `PARTICIPANT#${participant_or_email}`,
      SK: 'A',
    }
  }

  return { PK: participant_or_email.PK, SK: 'A' }
}
