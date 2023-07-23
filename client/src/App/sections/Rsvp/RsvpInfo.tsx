import React from 'react'

import { ids } from '@app/sections'
import { Participant } from 'brittanyandcaleb.gay.graphql-api/types'

type Props = {
  participant: Participant
  engageEditMode: () => void
}

export const RsvpInfo = ({ participant, engageEditMode }: Props) => {
  return (
    <div>
      <p>It looks like you have already RSVP'd! Does this look right?</p>
      <div className="clearfix">
        <button
          className="btn btn-secondary float-end"
          style={{ marginRight: '20px' }}
          onClick={engageEditMode}
        >
          Edit 🪶
        </button>
        <ul className="float-start">
          <li>Attending: {participant.attending ? 'Yes' : 'No'}</li>
          {participant.attending && (
            <li>
              Bringing:
              <ul>
                {participant.guests.length ? (
                  participant.guests.map((guest, index) => <li key={index}>{guest.name}</li>)
                ) : (
                  <li>No one, at the moment</li>
                )}
              </ul>
            </li>
          )}
        </ul>
      </div>
      If not, you can easily{' '}
      <a href={`#${ids.rsvp_form}`} className="link-primary" onClick={engageEditMode}>
        edit ↗
      </a>
      .
    </div>
  )
}
