export type ParticipantGuest = {
  name: string
  added_at: string
}

type ParticipantPK = `PARTICIPANT#${string}`

export type ParticipantKey = {
  PK: ParticipantPK
  SK: 'A'
}

export type Participant = ParticipantKey & {
  email: string

  // these may come in on claims, but they may not
  given_name: string
  family_name: string

  attending: boolean
  guests: ParticipantGuest[]

  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  deleted_at?: string
  deleted_by?: string

  item_version: number
  last_written_at: string
}
