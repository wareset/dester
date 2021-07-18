'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var flags = require('../../flags');
var isNotPunctuator = require('../lib/is-not-punctuator');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var isNotPunctuator__default = /*#__PURE__*/_interopDefaultLegacy(isNotPunctuator);

/* eslint-disable max-len */
const createRegExp = ({ next, char, save, raw, slashed, error }) => {
    let is;
    const __test__ = (CHAR) => (is = CHAR === '[' ? 1 : CHAR === ']' ? 0 : is) || CHAR;
    let isValid = false;
    while (next() && !(isValid = !slashed() && __test__(char()) === '/'))
        ;
    save(flags.TYPE_REGULAR_EXPRESSION, raw(), [flags.LITERAL]);
    !isValid && error();
};
const pluginRegularExpression = (self) => () => self.raw() === '/' && isNotPunctuator__default['default'](self) && !createRegExp(self);

exports.pluginRegularExpression = pluginRegularExpression;
