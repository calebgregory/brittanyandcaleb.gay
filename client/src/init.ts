import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import type { CognitoUser } from 'amazon-cognito-identity-js'
import { Auth } from 'aws-amplify'
import { Client } from 'urql'

import { config } from './config'
import { build_gql_client } from './api'

/** thank you https://github.com/aws-amplify/amplify-js/issues/8632 */
const cache_amplify_user_session_using_fetched_tokens = async (
  IdToken: string,
  AccessToken: string,
  RefreshToken: string
): Promise<CognitoUser | any> => {
  const session_data = {
    IdToken: new AmazonCognitoIdentity.CognitoIdToken({ IdToken }),
    AccessToken: new AmazonCognitoIdentity.CognitoAccessToken({ AccessToken }),
    RefreshToken: new AmazonCognitoIdentity.CognitoRefreshToken({ RefreshToken }),
  }
  const session = new AmazonCognitoIdentity.CognitoUserSession(session_data)
  const cognito_user = new AmazonCognitoIdentity.CognitoUser({
    Username: session_data.AccessToken.payload.username,
    Pool: new AmazonCognitoIdentity.CognitoUserPool({
      UserPoolId: config.user_pool_id,
      ClientId: config.user_pool_client_id,
    }),
  })

  // "sign in" with "this" CognitoUserSession
  cognito_user.setSignInUserSession(session)

  return Auth.currentAuthenticatedUser()
}

const fetch_tokens_using_auth_code = async (auth_code: string) => {
  const details = {
    grant_type: 'authorization_code',
    client_id: config.user_pool_client_id,
    code: auth_code,
    redirect_uri: window.location.origin,
  }

  const body = Object.entries(details)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')

  const resp = await fetch(config.token_url, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body,
  })
  const resp_body = await resp.json()
  if (!resp.ok) {
    console.error('fetch_tokens_using_auth_code', { error: resp_body })
    return null
  }
  return resp_body
}

const refresh_user_session = async (user: CognitoUser): Promise<CognitoUser> => {
  const refresh_token = user.getSignInUserSession()?.getRefreshToken()
  if (!refresh_token) {
    throw new Error('got user, but no refresh token')
  }

  return new Promise((resolve, reject) => {
    user.refreshSession(refresh_token, (error, session) => {
      if (error) {
        console.error('refresh_id_token', { error })
        reject(error)
      }

      console.log('successfully refreshed user session', { session })
      user.setSignInUserSession(session)

      resolve(user)
    })
  })
}

type App = { user: CognitoUser; gql_client: Client }

export async function init(): Promise<App | null> {
  Auth.configure({
    region: 'us-east-1',
    userPoolId: config.user_pool_id,
    userPoolWebClientId: config.user_pool_client_id,
  })

  const params = new URLSearchParams(window.location.search)
  const auth_code = params.get('code')

  let user: CognitoUser | null = null
  try {
    user = await Auth.currentAuthenticatedUser()
  } catch (error) {
    console.log('caught error getting current authenticated user', { error })
  }

  if (user) {
    console.log('got cached user', { user })
    try {
      user = await refresh_user_session(user)
      return {
        user,
        gql_client: build_gql_client(() =>
          user!.getSignInUserSession()!.getIdToken().getJwtToken()
        ),
      }
    } catch (error) {
      console.error('error refreshing user session', { error })
      user = null
    }
  }

  if (auth_code) {
    const fetched_tokens = await fetch_tokens_using_auth_code(auth_code)
    if (fetched_tokens) {
      const { id_token, access_token, refresh_token } = fetched_tokens
      user = await cache_amplify_user_session_using_fetched_tokens(
        id_token,
        access_token,
        refresh_token
      )
      console.log('got tokens using auth_code and cached a user', { user })
    }

    // reset search, because the ?code= param is now invalid
    params.delete('code')
    window.location.search = params.toString()
  }

  return (
    user && {
      user,
      gql_client: build_gql_client(() => user!.getSignInUserSession()!.getIdToken().getJwtToken()),
    }
  )
}
