"use strict";

const _createClass = require("@babel/runtime/helpers/createClass");

const index = require("../lib/index.js");

const _hidden = require("../_includes/_hidden-e98459d9.js");

function other() {
    console.log("other", index.LIB, _hidden._HIDDEN);
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

exports.Qweeee = Qweeee;

exports.other = other;
