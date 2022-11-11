'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var lib1 = require('./lib-1');
var lib2 = require('./lib-2');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var lib1__default = /*#__PURE__*/_interopDefaultLegacy(lib1);
var lib2__default = /*#__PURE__*/_interopDefaultLegacy(lib2);

function some() {
  console.log('lib1', lib1__default['default']);
  console.log('lib2', lib2__default['default']);
}

exports.default = some;
