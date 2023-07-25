import AWS from 'aws-sdk'

import { config } from '../config'
import { logger } from '../log'

const SES_EMAIL_RECIPIENTS = (process.env.SES_EMAIL_RECIPIENTS || '').split(',')

export const ses_send_email = async <
  TemplateName extends string,
  TemplateData extends Record<string, any>
>(
  template_name: TemplateName,
  template_data: TemplateData
) => {
  const client = new AWS.SES({ region: config.region })

  if (!template_name) {
    logger.error('template_name is not defined; cannot send email')
    return
  } else if (!SES_EMAIL_RECIPIENTS.length) {
    logger.error('SES_EMAIL_RECIPIENTS are blank; cannot send email')
    return
  }

  const params: AWS.SES.SendTemplatedEmailRequest = {
    Source: 'Caleb Gregory <calebgregory@gmail.com>', // must be verified in SES
    Destination: { ToAddresses: SES_EMAIL_RECIPIENTS }, // If your account is still in the sandbox, these addresses must be verified, too
    Template: template_name,
    TemplateData: JSON.stringify(template_data),
  }

  try {
    // Send the email using the SES client.
    const response = await client.sendTemplatedEmail(params).promise()
    logger.info('Email sent! Message ID:', response.MessageId)
  } catch (error) {
    logger.error('Error sending email', { error })
  }
}
