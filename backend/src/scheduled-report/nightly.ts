import { ScheduledEvent } from 'aws-lambda'

import { logger } from '../log'
import { list_all_participants } from '../participants/list'
import { Participant } from '../participants/types'
import { ses_send_email } from '../ses'

const SES_TEMPLATE_NAME = process.env.SES_TEMPLATE_NAME || ''

type TemplateData = {
  participants_and_guests: [string, string[]][]
  count: number
}

const _build_report = (participants: Participant[]): TemplateData => {
  const participants_and_guests: [string, string[]][] = participants.map((p) => [
    `${p.given_name} ${p.family_name}`,
    p.guests.map(({ name }) => name),
  ])

  const count = participants.reduce<number>((sum, p) => sum + p.guests.length + 1, 0)

  return { participants_and_guests, count }
}

export const LAM_sendReportEmail = async (_event: ScheduledEvent) => {
  let participants: Participant[]

  try {
    participants = await list_all_participants()
  } catch (error) {
    logger.error('Error listing participants', { error })
    return
  }

  try {
    const report = _build_report(participants)
    await ses_send_email(SES_TEMPLATE_NAME, {
      count: report.count,
      participants_and_guests: JSON.stringify(report.participants_and_guests, null, 2),
    })
  } catch (error) {
    logger.error('Error sending report email', { error })
  }
}
