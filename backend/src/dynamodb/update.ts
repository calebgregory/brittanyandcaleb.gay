import AWS from 'aws-sdk'
import clone_deep from 'lodash.clonedeep'
import is_equal from 'lodash.isequal'
import is_nil from 'lodash.isnil'

import { logger } from '../log'

import { dyn_client } from './client'
import { ItemNotFoundError, VersionedUpdateFailure } from './errors'

const _KNOWN_RETRYABLE_UPDATE_ERRORS = new Set([
  'TransactionConflictException',
  'ConditionalCheckFailedException',
])

const _is_retryable_error = (error: unknown) => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  ) {
    return _KNOWN_RETRYABLE_UPDATE_ERRORS.has(error.code)
  }
  return false
}

type UpdateDiff = {
  set_attrs: Map<string, any>
  remove_attrs: Set<string>
}

export const _derive_item_diff = <T extends Record<string, any>>(
  old_item: T,
  new_item: T
): UpdateDiff | null => {
  const set_attrs = new Map<string, any>()
  const remove_attrs = new Set<string>()

  for (const [key, value] of Object.entries(new_item)) {
    if (is_nil(value) && !is_nil(old_item[key])) {
      remove_attrs.add(key)
    } else if (!is_equal(value, old_item[key])) {
      set_attrs.set(key, value)
    }
  }

  for (const [key, old_value] of Object.entries(old_item)) {
    if (old_value && !new_item[key]) {
      remove_attrs.add(key)
    }
  }

  if (!set_attrs.size && !remove_attrs.size) {
    return null
  }

  return { set_attrs, remove_attrs }
}

/** There's something very gatekeepery about DynamoDB's API

  https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html */
export const _build_update_expression = (
  curr_item_version: number,
  { set_attrs, remove_attrs }: UpdateDiff
): Pick<
  AWS.DynamoDB.DocumentClient.Update,
  'UpdateExpression' | 'ExpressionAttributeNames' | 'ExpressionAttributeValues'
> => {
  const ExpressionAttributeNames: AWS.DynamoDB.DocumentClient.Update['ExpressionAttributeNames'] =
    {}
  const ExpressionAttributeValues: AWS.DynamoDB.DocumentClient.Update['ExpressionAttributeValues'] =
    { ':curr_item_version': curr_item_version } // <- *
  const update_expression_parts: string[] = []

  if (set_attrs.size) {
    const set_expression_parts: string[] = []

    for (const [key, value] of set_attrs.entries()) {
      ExpressionAttributeNames[`#${key}`] = key
      ExpressionAttributeValues[`:${key}`] = value
      set_expression_parts.push(`#${key} = :${key}`)
    }

    update_expression_parts.push(`SET ${set_expression_parts.join(', ')}`)
  }

  if (remove_attrs.size) {
    const remove_expression_parts: string[] = []

    for (const key of remove_attrs) {
      ExpressionAttributeNames[`#${key}`] = key
      remove_expression_parts.push(`#${key}`)
    }

    update_expression_parts.push(`REMOVE ${remove_expression_parts.join(', ')}`)
  }

  return {
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    UpdateExpression: update_expression_parts.join(' '),
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type TransactableItem = { item_version: number; last_written_at: string }

/** this is a simplified port of
  https://github.com/xoeye/xoto3/blob/develop/xoto3/dynamodb/update/versioned.py\#L77,
  primarily written by @petergaultney who deserves most of the credit here. */
export const dyn_transact_versioned_update_item = async <T extends TransactableItem>(
  table_name: string,
  item_key: AWS.DynamoDB.DocumentClient.Key,
  updater_fn: (item: T) => T,
  max_attempts = 5
): Promise<T> => {
  const max_attempts_before_failure = Math.max(1, max_attempts)

  let attempt = 0

  while (attempt++ < max_attempts_before_failure) {
    const resp = await dyn_client().get({ TableName: table_name, Key: item_key }).promise()

    if (!resp.Item) {
      throw new ItemNotFoundError(item_key)
    }
    const curr_item = resp.Item as T
    const curr_item_version = curr_item.item_version || 0

    const updated_item: T = updater_fn(clone_deep(curr_item)) // it's important that this is a deep clone

    const diff = _derive_item_diff(curr_item, updated_item)

    if (!diff) {
      logger.warn('Update was called, but there is no difference in item; exiting', { item_key })
      return curr_item
    }

    const next_item_version = curr_item_version + 1
    const next_last_written_at = new Date().toISOString()

    diff.set_attrs
      .set('item_version', next_item_version)
      .set('last_written_at', next_last_written_at)

    const update_expression = _build_update_expression(curr_item_version, diff)

    try {
      const resp = await dyn_client()
        .update({
          Key: item_key,
          TableName: table_name,
          ConditionExpression:
            '#item_version = :curr_item_version OR attribute_not_exists(#item_version)',
          ...update_expression, // this includes item_version and last_updated_at
        })
        .promise()

      if (resp.$response.error) {
        throw resp.$response.error
      }
    } catch (error) {
      if (_is_retryable_error(error)) {
        const wait_time_seconds = Math.random() // 0 < n < 1
        logger.warn(`Update failed, retrying in ${wait_time_seconds.toFixed(3)} seconds`, { error })
        await wait(wait_time_seconds)
        continue
      } else {
        throw error
      }
    }

    return {
      ...updated_item,
      item_version: next_item_version,
      last_written_at: next_last_written_at,
    }
  }

  throw new VersionedUpdateFailure(item_key, max_attempts_before_failure)
}
