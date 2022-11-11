'use strict';

const _createClass = require('@babel/runtime/helpers/createClass');
const _hidden = require('./_includes/_hidden-3e15f488.js');

function other() {
  console.log('other', _hidden.LIB, _hidden._HIDDEN);
}
var Qweeee = /*#__PURE__*/function () {
  function Qweeee(a) {
    this.a = a;
  }
  _createClass(Qweeee, [{
    key: "A",
    get: function get() {
      return Object.assign({}, this.a, {
        q: 1212
      });
    }
  }]);
  return Qweeee;
}();

exports.Qweeee = Qweeee;
exports.other = other;
