import _createClass from "@babel/runtime/helpers/createClass";

import { LIB } from "../lib/index.mjs";

import { _ as _HIDDEN } from "../_includes/_hidden-0e1befe5.mjs";

function other() {
    console.log("other", LIB, _HIDDEN);
}

var Qweeee = function() {
    function e(e) {
        this.a = e;
    }
    _createClass(e, [ {
        key: "A",
        get: function e() {
            return Object.assign({}, this.a, {
                q: 1212
            });
        }
    } ]);
    return e;
}();

export { Qweeee, other };
