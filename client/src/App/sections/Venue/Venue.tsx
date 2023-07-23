import React from 'react'

import { ids } from '@app/sections'

export const Venue = () => {
  return (
    <div className="section_container" id={ids.wedding_venue}>
      <h2>Wedding Venue</h2>
      <p>
        The wedding ceremony will be at{' '}
        <a
          href="https://www.baysmountain.com/park/park-overview/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Bays Mountain Park
        </a>{' '}
        in Kingsport, TN (
        <a href="https://goo.gl/maps/UBRuNCJaL8XmwVGVA" target="_blank" rel="noopener noreferrer">
          map
        </a>
        ) at the Lily Pad Pavilion:
      </p>
      <div style={{ marginBottom: '10px' }}>
        <img
          src="/assets/bays_mountain.jpg"
          alt="Bays Mountain Park"
          style={{ maxWidth: '100%' }}
        />
      </div>
      <p>Caleb grew up coming here all the time. It is a very special place.</p>
      <p>
        Bay's Mountain has limited parking. We may end up directing people to park at the{' '}
        <a href="https://goo.gl/maps/CjHmP2jHXjG16dFQ9" target="_blank" rel="noopener noreferrer">
          Eastman Recreation Center nearby
        </a>{' '}
        to carpool, just to minimize how many cars we have parked at Bay's Mountain. If we do this,
        we'll send out an email letting you know that's the plan.
      </p>
      <h2>Reception</h2>
      <p>
        The reception will be held at{' '}
        <a
          href="https://socialeventsfacility.com/photo-gallery/"
          target="_blank"
          rel="noopener noreferrer"
        >
          The Social
        </a>{' '}
        in Downtown Kingsport. (
        <a href="https://goo.gl/maps/pSd6AvViSGaZq3aY8" target="_blank" rel="noopener noreferrer">
          map
        </a>
        )
      </p>
    </div>
  )
}
