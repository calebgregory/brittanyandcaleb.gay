import React from 'react'
import { gql, useQuery } from 'urql'

import { ids } from '@app/sections'
import { useUser } from '@app/hooks/useUser'

import { RsvpForm } from './RsvpForm'
import { RsvpInfo } from './RsvpInfo'

import { logger } from '@app/log'

const log = logger('Rsvp')

const GetParticipant = gql`
  query GetParticipant($input: GetParticipantInput!) {
    getParticipant(input: $input) {
      participant {
        email
        given_name
        family_name
        attending
        guests {
          name
        }
      }
    }
  }
`

export const Rsvp = () => {
  const [is_editing, set_is_editing] = React.useState(false)

  const { payload } = useUser().getSignInUserSession()!.getIdToken()
  const [query_result /* , reexecute_query */] = useQuery({
    query: GetParticipant,
    variables: { input: { email: payload.email } },
  })

  if (query_result.fetching) {
    return <p id={ids.rsvp_form}>Loading...</p>
  }

  if (query_result.error) {
    log.error('error fetching participant', {
      error: query_result.error,
      id_token_claims: payload,
    })

    return (
      <p id={ids.rsvp_form}>
        Weird... there was an error fetching you in our system. Call Caleb and tell him this form
        isn't working.
      </p>
    )
  }

  const { participant: p } = query_result.data.getParticipant

  if (is_editing) {
    return (
      <div id={ids.rsvp_form}>
        <RsvpForm
          initialValues={p}
          onSubmit={() => {
            /* no-op in favor of confetti cannon */
          }}
          goBack={() => set_is_editing(false)}
        />
      </div>
    )
  }

  if (p) {
    return (
      <div id={ids.rsvp_form}>
        <RsvpInfo participant={p} engageEditMode={() => set_is_editing(true)} />
      </div>
    )
  }

  return <p id={ids.rsvp_form}>I don't know what happened</p>
}
