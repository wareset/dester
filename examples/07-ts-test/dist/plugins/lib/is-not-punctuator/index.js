'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var flags = require('../../../flags');

/* PUNCTUATOR */

var isNotPunctuator = (self, last = self.tokenLast) =>
  !last || /case|return/.test(last.raw) || last.type === flags.TYPE_PUNCTUATOR;

exports.default = isNotPunctuator;
