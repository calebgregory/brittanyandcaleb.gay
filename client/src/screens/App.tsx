import React from 'react'
import { CognitoUser } from 'amazon-cognito-identity-js'

type Props = {
  user: CognitoUser
}

function App({ user }: Props) {
  return (
    <div>
      <p>
        Welcome, <b>{user.getSignInUserSession()?.getIdToken()?.payload.email}</b>. You'll probably
        never know how difficult it was to figure out how to authenticate you using Google.
      </p>
      <button onClick={() => user.signOut(() => window.location.reload())}>Sign Out</button>
    </div>
  )
}

export default App
