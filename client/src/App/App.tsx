import React from 'react'
import * as B from 'react-bootstrap'
import { Welcome } from './sections/Welcome'
import { Rsvp } from './sections/Rsvp'
import { Venue } from './sections/Venue'
import { Accommodations } from './sections/Accommodations'
import { useUser } from '@app/hooks/useUser'

import { config } from '@app/config'

const SignOutButton = () => {
  const user = useUser()
  return (
    <div className="clearfix mb-3">
      <B.Button
        variant="link"
        className="float-end"
        onClick={() => user.signOut(() => window.location.reload())}
      >
        Sign Out
      </B.Button>
    </div>
  )
}

const AppMetadata = () => {
  return (
    <div className="text-center" style={{ fontSize: '.5rem' }}>
      (this is troubleshooting information just for Caleb: stage="{config.stage}")
    </div>
  )
}

export function App() {
  return (
    <div id="app">
      <Welcome />
      <Rsvp />
      <Venue />
      <Accommodations />
      <SignOutButton />
      <AppMetadata />
    </div>
  )
}
