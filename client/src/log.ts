import debug from 'debug'

const _make_logger = (namespace: string): Console => {
  const _logger = debug(namespace)

  const levels = ['log', 'info', 'debug', 'trace', 'warn', 'error'] as const

  return {
    ...console,
    ...levels.reduce((acc, level) => {
      acc[level] = _logger.extend(level)
      return acc
    }, {} as any /* sorry */),
  }
}

export function logger(namespace: string) {
  return _make_logger(namespace)
}

/** https://www.npmjs.com/package//debug */
export function enable(log_config: string) {
  debug.enable(log_config)
}
