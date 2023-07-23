import React from 'react'

import { useUser } from '@app/hooks/useUser'
import { logger } from '@app/log'
import { ids } from '@app/sections'
import { Query, QueryGetParticipantArgs } from 'brittanyandcaleb.gay.graphql-api/types'
import * as B from 'react-bootstrap'
import { gql, useQuery } from 'urql'

import { RsvpForm } from './RsvpForm'
import { RsvpInfo } from './RsvpInfo'
import { shoot_hearts } from './confetti-cannon'

import './Rsvp.css'

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
  const [query_result /* , reexecute_query */] = useQuery<
    Pick<Query, 'getParticipant'>,
    QueryGetParticipantArgs
  >({
    query: GetParticipant,
    variables: { input: { email: payload.email } },
  })

  if (query_result.error) {
    log.error('error fetching participant', {
      error: query_result.error,
      id_token_claims: payload,
    })
  }

  const { participant: p = null } = query_result?.data?.getParticipant ?? {}
  return (
    <div className="section_container" id={ids.rsvp_form}>
      <h2>RSVP</h2>
      {query_result.fetching ? (
        <p>Loading...</p>
      ) : query_result.error ? (
        <p>
          Weird... there was an error fetching you in our system. Call Caleb and tell him this form
          isn't working.
        </p>
      ) : is_editing ? (
        <RsvpForm
          initialValues={p}
          onSubmit={() => {
            /* no-op in favor of confetti cannon */
          }}
          goBack={() => set_is_editing(false)}
        />
      ) : p ? (
        <RsvpInfo participant={p} engageEditMode={() => set_is_editing(true)} />
      ) : (
        <>
          <p>It looks like you haven't RSVP'd yet!</p>
          <div className="d-grid gap-2">
            <B.Button
              variant="primary"
              size="lg"
              onClick={(event) => {
                shoot_hearts(event)
                set_is_editing(true)
              }}
            >
              RSVP 💕
            </B.Button>
          </div>
        </>
      )}
    </div>
  )
}
