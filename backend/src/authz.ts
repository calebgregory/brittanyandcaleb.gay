import {
  AppSyncIdentity,
  AppSyncIdentityCognito,
  AppSyncIdentityOIDC,
  AppSyncIdentityLambda,
} from 'aws-lambda'

export class ForbiddenError extends Error {
  constructor(message = '') {
    super('Forbidden' + message ? `: ${message}` : '')
    this.name = 'ForbiddenError'
  }
}

export function raise_if_no_claims(
  identity: AppSyncIdentity | undefined
): identity is AppSyncIdentityCognito | AppSyncIdentityOIDC | AppSyncIdentityLambda {
  if (identity && 'claims' in identity) {
    return true
  }
  throw new ForbiddenError()
}
