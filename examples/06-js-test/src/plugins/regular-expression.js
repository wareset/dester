/* eslint-disable max-len */

/* LITERAL */
import { LITERAL } from '../flags'
/* REGULAR_EXPRESSION */
import { TYPE_REGULAR_EXPRESSION } from '../flags'

const createRegExp = ({ next, char, save, raw, slashed, error }) => {
  let is
  const __test__ = (CHAR) =>
    (is = CHAR === '[' ? 1 : CHAR === ']' ? 0 : is) || CHAR

  let isValid = false
  while (next() && !(isValid = !slashed() && __test__(char()) === '/'));

  save(TYPE_REGULAR_EXPRESSION, raw(), [LITERAL])
  !isValid && error()
}

export const pluginRegularExpression = (self) => () =>
  self.raw() === '/' && !createRegExp(self)
