import React from 'react'

import { config } from '../config'

export function SignIn() {
  return (
    <div>
      <h1>Thanks for RSVP'ing!</h1>
      <p>
        Before you can proceed,{' '}
        <b>
          <a href={config.sign_in_url}>Please sign in</a>
        </b>
        !
      </p>
    </div>
  )
}
