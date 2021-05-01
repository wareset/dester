'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var lib = require('./lib');
var util1 = require('./util/util-1');
var util2 = require('./util/util-2');
var isFunction = require('@wareset-utilites/is/isFunction');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var util1__default = /*#__PURE__*/_interopDefaultLegacy(util1);

function test() {
  console.log('test', lib.CONSTANT, isFunction.isFunction);
  util1__default['default']();
  util2.util2();
}

exports.default = test;
