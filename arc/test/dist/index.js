"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

const _createClass = require("@babel/runtime/helpers/createClass");

const index$1 = require("./lib/index.js");

const _hidden = require("./_includes/_hidden-e98459d9.js");

const sssssss = require("./sssssss/index.js");

const path = require("path");

const node_path = require("node:path");

var index = function e() {
    console.log("index", index$1.LIB, _hidden._HIDDEN, path.resolve, node_path.normalize, sssssss.qqq);
    console.log(Object.keys, Object.values);
};

var Reeeee = function() {
    function e(e) {
        this.a = e;
    }
    _createClass(e, [ {
        key: "A",
        get: function e() {
            return Object.assign({}, this.a, {
                q: 12112122
            });
        }
    } ]);
    return e;
}();

exports.LIB = index$1.LIB;

exports.default = Reeeee;

exports.index = index;
