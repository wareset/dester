'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function test() {
  return function (target, propertyKey = '') {
    console.log(target, propertyKey);
  };
}

exports.default = test;
