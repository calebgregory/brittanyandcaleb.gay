import { DynamoDBStreamEvent, StreamRecord } from 'aws-lambda'
import AWS from 'aws-sdk'
import is_equal from 'lodash.isequal'

import { config } from '../config'
import { logger } from '../log'
import { Participant } from '../participants/types'

const SES_TEMPLATE_NAME = process.env.SES_TEMPLATE_NAME
const SES_EMAIL_RECIPIENTS = (process.env.SES_EMAIL_RECIPIENTS || '').split(',')

type ChangedAttrs = {
  [key in keyof Participant]: [any, any]
}

const _derive_changed_attrs = (old_item: Participant, new_item: Participant): ChangedAttrs => {
  const keys = new Set([...Object.keys(old_item), ...Object.keys(new_item)]) as Set<
    keyof Participant
  >

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

type Updates = {
  added: Participant[]
  updated: (Omit<ChangedAttrs, 'PK' | 'SK'> & { PK: Participant['PK']; SK: Participant['SK'] })[]
  removed: Participant[]
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

  const updated: Updates['updated'] = []

  for (const record of modified_records) {
    const old_item = _unmarshall_record_image(record.dynamodb?.OldImage)
    const new_item = _unmarshall_record_image(record.dynamodb?.NewImage)

    if (old_item && new_item) {
      updated.push({
        ..._derive_changed_attrs(old_item, new_item),
        PK: new_item.PK,
        SK: new_item.SK,
      })
    } else if (!old_item && new_item) {
      added.push(new_item)
    } else if (old_item && !new_item) {
      removed.push(old_item)
    } else {
      logger.error('both old and new item are null in "MODIFY"d record', { record })
    }
  }

  return { added, updated, removed }
}

const _ses_send_email = async (updates: Updates) => {
  const client = new AWS.SES({ region: config.region })

  if (!SES_TEMPLATE_NAME) {
    logger.error('SES_TEMPLATE_NAME is not defined; cannot send email')
    return
  } else if (!SES_EMAIL_RECIPIENTS.length) {
    logger.error('SES_EMAIL_RECIPIENTS are blank; cannot send email')
    return
  }

  const params: AWS.SES.SendTemplatedEmailRequest = {
    Source: 'Caleb Gregory <calebgregory@gmail.com>', // must be verified in SES
    Destination: { ToAddresses: SES_EMAIL_RECIPIENTS }, // If your account is still in the sandbox, these addresses must be verified, too:
    Template: SES_TEMPLATE_NAME,
    TemplateData: JSON.stringify({ all_updates: JSON.stringify(updates, null, 2) }),
  }

  try {
    // Send the email using the SES client.
    const response = await client.sendTemplatedEmail(params).promise()
    logger.info('Email sent! Message ID:', response.MessageId)
  } catch (error) {
    logger.error('Error sending email', { error })
  }
}

export const notify_on_participant_update = async (event: DynamoDBStreamEvent) => {
  const updates = _derive_updates(event)

  await _ses_send_email(updates)
}
