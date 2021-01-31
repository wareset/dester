import { TYPE_PUNCTUATOR } from '../../../flags';

/* PUNCTUATOR */

var isNotPunctuator = (self, last = self.tokenLast) =>
  !last || /case|return/.test(last.raw) || last.type === TYPE_PUNCTUATOR;

export default isNotPunctuator;
