import { createContext, useContext } from 'react'

import type { CognitoUser } from 'amazon-cognito-identity-js'

const UserContext = createContext<CognitoUser | null>(null)

export const UserProvider = UserContext.Provider

export const useUser = (): CognitoUser => {
  const user = useContext(UserContext)

  if (!user) {
    throw new Error('No user is available in the UserContext :(')
  }
  return user
}
