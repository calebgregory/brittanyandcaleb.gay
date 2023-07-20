export class ItemNotFoundError extends Error {
  constructor(message_or_key: Record<string, any> | string = '') {
    super(
      `ItemNotFound${
        message_or_key
          ? `: ${
              typeof message_or_key === 'object' ? JSON.stringify(message_or_key) : message_or_key
            }`
          : ''
      }`
    )
    this.name = 'ItemNotFoundError'
  }
}

export class VersionedUpdateFailure extends Error {
  constructor(message_or_key: Record<string, any> | string = '', num_retries?: number) {
    super(
      `VersionedUpdateFailure${
        message_or_key
          ? `: ${
              typeof message_or_key === 'object' ? JSON.stringify(message_or_key) : message_or_key
            }`
          : ''
      }: We repeatedly attempted to update item, but it was beaten ${
        num_retries ? num_retries + ' times' : 'every time'
      }.  We're giving up now.`
    )
    this.name = 'VersionedUpdateFailure'
  }
}
