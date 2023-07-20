import { Logger } from '@aws-lambda-powertools/logger'

import { config } from './config'

export const logger = new Logger({ serviceName: config.lambda_fn_name })
