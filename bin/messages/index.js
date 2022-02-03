'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var wsUtils = require('../ws-utils');
var kleur = require('kleur');

const x1bLen = (str) => {
    let res = 0;
    // eslint-disable-next-line no-control-regex
    str.replace(/\x1b(?:\[\d+m)?/g, (_full) => {
        res += _full.length;
        return '';
    });
    return res;
};
const __fixBG__ = (str) => {
    let res = str;
    let s;
    wsUtils.trycatch(() => {
        const q = +process.stdout.columns;
        if (q) {
            res = res
                .split(/\r?\n|\r/)
                .map((v) => (v + ' '.repeat(s = wsUtils.nearly(v.length, q, 1))).slice(0, s + x1bLen(v)))
                .join('\n');
        }
    });
    return res;
};
const __normalize__ = (a) => a
    .map((v) => wsUtils.isObject(v) ? wsUtils.jsonStringify(v, void 0, 2) : v)
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
    const is = s.includes('\n');
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
