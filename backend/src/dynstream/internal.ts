import { DynamoDBStreamHandler } from 'aws-lambda'

import { logger } from '../log'
import { notify_on_participant_update } from '../notify/on_participant'

export const DYN_sendEmail: DynamoDBStreamHandler = async (event) => {
  try {
    // it is _critical_ that DynamoDB Stream Handlers do not raise exceptions;
    // if they do, the Stream will get backed up retrying the failed stream
    // handler execution over and over again
    await notify_on_participant_update(event)
  } catch (error) {
    logger.error('error caught notifying of updates', { error })
  }
}
