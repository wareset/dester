'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsonStringify = require('@wareset-utilites/lang/jsonStringify');
var includes = require('@wareset-utilites/array/includes');
var isObject = require('@wareset-utilites/is/isObject');
var repeat = require('@wareset-utilites/string/repeat');
var trycatch = require('@wareset-utilites/trycatch');
var nearly = require('@wareset-utilites/nearly');
var kleur = require('kleur');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var jsonStringify__default = /*#__PURE__*/_interopDefaultLegacy(jsonStringify);
var includes__default = /*#__PURE__*/_interopDefaultLegacy(includes);
var isObject__default = /*#__PURE__*/_interopDefaultLegacy(isObject);
var repeat__default = /*#__PURE__*/_interopDefaultLegacy(repeat);
var trycatch__default = /*#__PURE__*/_interopDefaultLegacy(trycatch);
var nearly__default = /*#__PURE__*/_interopDefaultLegacy(nearly);

const x1bLen = (str) => {
    let res = 0;
    // eslint-disable-next-line security/detect-unsafe-regex
    str.replace(/\x1b(?:\[\d+m)?/g, (_full) => {
        res += _full.length;
        return '';
    });
    return res;
};
const __fixBG__ = (str) => {
    let res = str;
    let s;
    trycatch__default['default'](() => {
        const q = +process.stdout.columns;
        // prettier-ignore
        if (q)
            res = res
                .split(/\r?\n|\r/)
                .map((v) => (v + repeat__default['default'](' ', (s = nearly__default['default'](v.length, q, 1)))).slice(0, s + x1bLen(v)))
                .join('\n');
    });
    return res;
};
const __normalize__ = (a) => a
    .map((v) => (isObject__default['default'](v) ? jsonStringify__default['default'](v, undefined, 2) : v))
    .join('\n')
    .split('\n')
    .map((v) => '  ' + v + '  ')
    .join('\n');
const messageFactory = (title, bg = kleur.bgRed, kill = false, color1 = kleur.white, color2 = kleur.black) => (...a) => {
    const msg = bg(__normalize__(a));
    const v = bg('\n  ' + kleur.bold(color1(title)) + '  \n' + color2(msg) + '\n\n');
    console.log('');
    console.log(__fixBG__(v));
    if (kill)
        process.exit();
    // console.log('')
};
const messageError = messageFactory('FATAL ERROR:', kleur.bgRed, true);
const messageCompileError = messageFactory('ERROR:', kleur.bgRed);
const messageWarn = messageFactory('WARNING:', kleur.bgYellow);
const messageSuccess = messageFactory('SUCCESS:', kleur.bgGreen);
const messageInfo = messageFactory('INFO:', kleur.bgBlue);
const log = (...a) => {
    console.log(__normalize__(a));
};
const logColoredFactory = (bgColor = kleur.bgGreen, color = kleur.black) => (...a) => {
    let s = __normalize__(a);
    const is = includes__default['default'](s, '\n');
    if (is)
        s = '\n' + __fixBG__(s);
    console.log(bgColor(color(s)));
    if (is)
        console.log('');
};
const logError = logColoredFactory(kleur.bgRed);
const logInfo = logColoredFactory(kleur.bgBlue);
const logWarn = logColoredFactory(kleur.bgYellow);
const logSuccess = logColoredFactory(kleur.bgGreen);

exports.log = log;
exports.logColoredFactory = logColoredFactory;
exports.logError = logError;
exports.logInfo = logInfo;
exports.logSuccess = logSuccess;
exports.logWarn = logWarn;
exports.messageCompileError = messageCompileError;
exports.messageError = messageError;
exports.messageInfo = messageInfo;
exports.messageSuccess = messageSuccess;
exports.messageWarn = messageWarn;
exports.x1bLen = x1bLen;
