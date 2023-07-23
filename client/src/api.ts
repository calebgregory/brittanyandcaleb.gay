import { Client, cacheExchange, fetchExchange } from 'urql'

import { config } from './config'

export const build_gql_client = (getToken: () => string) => {
  return new Client({
    url: config.internal_graphql_api_url,
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: () => ({ headers: { authorization: getToken() } }),
  })
}
