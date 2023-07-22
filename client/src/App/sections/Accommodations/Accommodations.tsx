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
            <a href={hotel.url} target="_blank" rel="noopener noreferrer">
              {hotel.name}
            </a>
            <ul>
              <li>{hotel.distances.join(', ')}</li>
              <li>Cost: {hotel.cost}</li>
              {hotel.comment && <li style={{ fontSize: '0.75rem' }}>{hotel.comment}</li>}
            </ul>
          </li>
        ))}
      </ul>
      <h3>Traveling</h3>
      <p>
        The nearest airport is{' '}
        <a href="https://goo.gl/maps/AFpqVA6N8vEGkEuHA" target="_blank" rel="noopener noreferrer">
          Tri-Cities Regional Airport
        </a>
        . The only airlines that fly into this airport are Allegiant, American Airlines, and Delta.
        If you fly United, you could fly into{' '}
        <a href="https://goo.gl/maps/ZzzPdf52ZjbPUqDB9" target="_blank" rel="noopener noreferrer">
          the Knoxville airport
        </a>{' '}
        or{' '}
        <a href="https://goo.gl/maps/T3L194YnbedYEN8RA" target="_blank" rel="noopener noreferrer">
          the Asheville airport
        </a>
        , both of which are about an hour and a half away. Sorry, Southwest flyers. Southwest does
        fly into the{' '}
        <a href="https://goo.gl/maps/QXTdtWw8pkzM7Phd6" target="_blank" rel="noopener noreferrer">
          Charlotte international airport
        </a>
        , though, which is about three hours from here.
      </p>
    </div>
  )
}
