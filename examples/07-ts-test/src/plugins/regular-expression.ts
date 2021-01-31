/* eslint-disable max-len */

/* LITERAL */
import { LITERAL } from '../flags'
/* REGULAR_EXPRESSION */
import { TYPE_REGULAR_EXPRESSION } from '../flags'

import isNotPunctuator from './lib/is-not-punctuator'

const createRegExp = ({ next, char, save, raw, slashed, error }: any): any => {
  let is
  const __test__ = (CHAR: any): any =>
    (is = CHAR === '[' ? 1 : CHAR === ']' ? 0 : is) || CHAR

  let isValid = false
  while (next() && !(isValid = !slashed() && __test__(char()) === '/'));

  save(TYPE_REGULAR_EXPRESSION, raw(), [LITERAL])
  !isValid && error()
}

export const pluginRegularExpression = (self: any) => (): any =>
  self.raw() === '/' && isNotPunctuator(self) && !createRegExp(self)
