/* PUNCTUATOR */
import { TYPE_PUNCTUATOR } from '../../flags'

export default (self: any, last = self.tokenLast): boolean =>
  !last || /case|return/.test(last.raw) || last.type === TYPE_PUNCTUATOR
