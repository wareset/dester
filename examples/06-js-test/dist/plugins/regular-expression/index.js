'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var flags = require('../../flags');

/* eslint-disable max-len */



const createRegExp = ({ next, char, save, raw, slashed, error }) => {
  let is;
  const __test__ = (CHAR) =>
    (is = CHAR === '[' ? 1 : CHAR === ']' ? 0 : is) || CHAR;

  let isValid = false;
  while (next() && !(isValid = !slashed() && __test__(char()) === '/'));

  save(flags.TYPE_REGULAR_EXPRESSION, raw(), [flags.LITERAL]);
  !isValid && error();
};

const pluginRegularExpression = (self) => () =>
  self.raw() === '/' && !createRegExp(self);

exports.pluginRegularExpression = pluginRegularExpression;
