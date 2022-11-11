import _createClass from '@babel/runtime/helpers/createClass';
import { L as LIB, _ as _HIDDEN } from './_includes/_hidden-67f094ce.mjs';

function other() {
  console.log('other', LIB, _HIDDEN);
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

export { Qweeee, other };
