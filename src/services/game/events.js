import { domain } from 'services/domain'

export const start = domain.event('start')
export const reset = domain.event('reset')
