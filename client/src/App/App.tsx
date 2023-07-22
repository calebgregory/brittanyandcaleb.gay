import React from 'react'
import { Welcome } from './sections/Welcome'
import { Rsvp } from './sections/Rsvp'
import { Venue } from './sections/Venue'
import { Accommodations } from './sections/Accommodations'
import { useUser } from '@app/hooks/useUser'

const SignOutButton = () => {
  const user = useUser()
  return <button onClick={() => user.signOut(() => window.location.reload())}>Sign Out</button>
}

export function App() {
  return (
    <div id="app">
      <Welcome />
      <Rsvp />
      <Venue />
      <Accommodations />
      <SignOutButton />
    </div>
  )
}
