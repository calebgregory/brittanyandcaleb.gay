import React from 'react'
import * as B from 'react-bootstrap'
import { Participant } from 'brittanyandcaleb.gay.graphql-api/types'
import { ids } from '@app/sections'

type Props = {
  participant: Participant
  engageEditMode: () => void
}

export const RsvpInfo = ({ participant, engageEditMode }: Props) => {
  return (
    <div>
      <p>It looks like you have already RSVP'd! Does this look right?</p>
      <ul>
        <li>Attending: {participant.attending ? 'Yes' : 'No'}</li>
        {participant.attending && (
          <li>
            Bringing:
            <ul>
              {participant.guests ? (
                participant.guests.map((guest, index) => <li key={index}>{guest.name}</li>)
              ) : (
                <li>None</li>
              )}
            </ul>
          </li>
        )}
      </ul>
      If not, you can easily{' '}
      <b>
        <a href={`#${ids.rsvp_form}`} className="link-primary" onClick={engageEditMode}>
          edit
        </a>
      </b>
      .
    </div>
  )
}
