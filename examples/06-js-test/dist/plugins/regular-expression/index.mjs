import { TYPE_REGULAR_EXPRESSION, LITERAL } from '../../flags';

/* eslint-disable max-len */

const createRegExp = ({ next, char, save, raw, slashed, error }) => {
  let is;
  const __test__ = (CHAR) =>
    (is = CHAR === '[' ? 1 : CHAR === ']' ? 0 : is) || CHAR;

  let isValid = false;
  while (next() && !(isValid = !slashed() && __test__(char()) === '/'));

  save(TYPE_REGULAR_EXPRESSION, raw(), [LITERAL]);
  !isValid && error();
};

const pluginRegularExpression = (self) => () =>
  self.raw() === '/' && !createRegExp(self);

export { pluginRegularExpression };
