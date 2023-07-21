import React from 'react'

import { ids } from '@app/sections'
import { useUser } from '@app/hooks/useUser'

export const Welcome = () => {
  const user = useUser()
  const { payload } = user.getSignInUserSession()!.getIdToken()
  const user_name = payload.given_name || payload.email

  return (
    <div id={ids.welcome}>
      <p>
        Welcome, {user_name}! Thank you for RSVP'ing to our wedding. We're really looking forward to
        seeing you again in October 😄! We love you very much and are very grateful to have you in
        our lives.
      </p>
    </div>
  )
}
