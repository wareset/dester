'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var util1$1 = require('./util/util-1');
var util2 = require('./util/util-2');
var util1 = require('../util-1');
var isFunction = require('@wareset-utilites/is/isFunction');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var util1__default$1 = /*#__PURE__*/_interopDefaultLegacy(util1$1);
var util1__default = /*#__PURE__*/_interopDefaultLegacy(util1);

var util3 = () => console.log('util-3' + util1__default['default']);

var qwe = 12;
var json = {
	qwe: qwe
};

// import { CONSTANT } from './lib.js'
const { CONSTANT } = require('./lib');
console.log(json);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function test() {
  console.log('test', CONSTANT, isFunction.isFunction);
  util1__default$1['default']();
  util2.util2();
  util3();
}

// ;(async (): Promise<void> => {
//   const q = import('@wareset-utilites/array')
//   console.log(q)
// })()

exports.default = test;
