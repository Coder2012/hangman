import { createDomain } from 'effector'
import { attachLogger } from 'effector-logger/attach'

export const domain = createDomain('$$')
process.env.ENV !== 'production' && attachLogger(domain)
