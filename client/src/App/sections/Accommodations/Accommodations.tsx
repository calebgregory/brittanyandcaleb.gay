import React from 'react'

import { ids } from '@app/sections'

import info from '@app/App/sections/Accommodations/hotels.yml'

export const Accommodations = () => {
  return (
    <div id={ids.accommodations}>
      <h2>Accommodations</h2>
      <p>{info.introduction}</p>
      <ul>
        {info.hotels.map((hotel) => (
          <li key={hotel.url}>
            <a href={hotel.url}>{hotel.name}</a>
            <ul>
              <li>{hotel.distances.join(', ')}</li>
              <li>Cost: {hotel.cost}</li>
              {hotel.comment && <li style={{ fontSize: '0.75rem' }}>{hotel.comment}</li>}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
