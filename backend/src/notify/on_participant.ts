import { DynamoDBStreamEvent, StreamRecord } from 'aws-lambda'
import AWS from 'aws-sdk'
import is_equal from 'lodash.isequal'

import { logger } from '../log'
import { Participant } from '../participants/types'
import { ses_send_email } from '../ses'

const SES_TEMPLATE_NAME = process.env.SES_TEMPLATE_NAME || ''

type ChangedAttrs = {
  [key in keyof Participant]: [any, any]
}

const _derive_changed_attrs = (old_item: Participant, new_item: Participant): ChangedAttrs => {
  const ignore_attrs = new Set<keyof Participant>(['PK', 'SK', 'item_version', 'last_written_at'])
  const keys = new Set(
    ([...Object.keys(old_item), ...Object.keys(new_item)] as Array<keyof Participant>).filter(
      (k) => !ignore_attrs.has(k)
    )
  )

  const changed_attrs = [...keys].reduce<ChangedAttrs>((acc, key) => {
    const new_value = new_item[key]
    const old_value = old_item[key]

    if (!is_equal(old_value, new_value)) {
      acc[key] = [old_value, new_value]
    }
    return acc
  }, {} as ChangedAttrs)

  return changed_attrs
}

const _unmarshall_record_image = (
  image: StreamRecord['OldImage'] | StreamRecord['NewImage']
): Participant | null => {
  // because AWS' DynamoDB record type is not generic, we have to typecast
  if (!image) {
    return null
  }
  return AWS.DynamoDB.Converter.unmarshall(image) as Participant
}

type Updates = {
  PKs: Set<Participant['PK']>
  changed_items: Partial<{
    added: Participant[]
    updated: (Omit<ChangedAttrs, 'PK' | 'SK'> & { PK: Participant['PK'] })[]
    removed: Participant[]
  }>
}

const _derive_updates = (event: DynamoDBStreamEvent): Updates => {
  const inserted_records = event.Records.filter((record) => record.eventName === 'INSERT')
  const modified_records = event.Records.filter((record) => record.eventName === 'MODIFY')
  const removed_records = event.Records.filter((record) => record.eventName === 'REMOVE')

  const added = inserted_records
    .map((record) => _unmarshall_record_image(record.dynamodb?.NewImage))
    .filter(Boolean)

  const removed = removed_records
    .map((record) => _unmarshall_record_image(record.dynamodb?.OldImage))
    .filter(Boolean)

  const PKs: Set<Participant['PK']> = new Set()
  const changed_items: Required<Updates['changed_items']> = { added, removed, updated: [] }

  for (const record of modified_records) {
    const old_item = _unmarshall_record_image(record.dynamodb?.OldImage)
    const new_item = _unmarshall_record_image(record.dynamodb?.NewImage)

    PKs.add((old_item || new_item)!.PK)

    if (old_item && new_item) {
      changed_items.updated.push({
        ..._derive_changed_attrs(old_item, new_item),
        PK: new_item.PK,
      })
    } else if (!old_item && new_item) {
      changed_items.added.push(new_item)
    } else if (old_item && !new_item) {
      changed_items.removed.push(old_item)
    } else {
      logger.error('both old and new item are null in "MODIFY"d record', { record })
    }
  }

  // remove noise
  for (const key of ['added', 'updated', 'removed'] as const) {
    if (!changed_items[key].length) {
      delete changed_items[key]
    }
  }

  return { changed_items, PKs }
}

export const notify_on_participant_update = async (event: DynamoDBStreamEvent) => {
  const updates = _derive_updates(event)

  if (Object.keys(updates.changed_items).length === 0) {
    logger.warn('no updates to notify about', { Key: event.Records[0].dynamodb?.Keys })
    return
  }

  await ses_send_email(SES_TEMPLATE_NAME, {
    PKs: JSON.stringify([...updates.PKs]),
    changed_items: JSON.stringify(updates.changed_items, null, 2),
  })
}
