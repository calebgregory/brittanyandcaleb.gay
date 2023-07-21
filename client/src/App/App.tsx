import React from 'react'
import { CognitoUser } from 'amazon-cognito-identity-js'
import { Welcome } from './sections/Welcome'
import { Rsvp } from './sections/Rsvp'

const SignOutButton = ({ user }: { user: CognitoUser }) => {
  return <button onClick={() => user.signOut(() => window.location.reload())}>Sign Out</button>
}

export function App() {
  return (
    <div id="app">
      <Welcome />
      <Rsvp />
    </div>
  )
}
