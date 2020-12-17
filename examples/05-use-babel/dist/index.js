'use strict';

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _privateValue = new WeakMap();

class index {
  constructor() {
    _privateValue.set(this, {
      writable: true,
      value: 12
    });
  }

  set value(v) {
    _classPrivateFieldSet(this, _privateValue, v);
  }

  get value() {
    return _classPrivateFieldGet(this, _privateValue);
  }

}

exports.default = index;
