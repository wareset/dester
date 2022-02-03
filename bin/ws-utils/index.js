'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const isArray = Array.isArray;
const isString = (v) => typeof v === 'string';
const isNumber = (v) => typeof v === 'number';
const isBoolean = (v) => typeof v === 'boolean';
const isObject = (v) => v != null && typeof v === 'object';
const jsonStringify = JSON.stringify;
const jsonParse = JSON.parse;
const keys = Object.keys;
const concat = (...lists) => [].concat(...lists);
const trycatch = (tryFn, catchFn, errorMsg) => {
    let res;
    try {
        res = tryFn();
    }
    catch (e) {
        if (errorMsg)
            console.error(e);
        res = typeof catchFn === 'function' ? catchFn(e) : catchFn;
    }
    return res;
};
const filterUnique = (arr) => arr.filter((v, k, a) => k === a.indexOf(v));
const hash = (str, salt) => {
    str = ((salt || '') + str).replace(/\r/g, '');
    let h = 0;
    let i = str.length;
    while (i--)
        h = (256 * h + str.charCodeAt(i)) % 2147483642; // 0x7ffffffa
    return (-h >>> 0).toString(36);
};
const { abs, floor, round, ceil } = Math;
const nearly = (() => {
    const METHODS_FOR_NUM = { '-1': floor, '0': round, '1': ceil };
    const METHODS_FOR_ARR = {
        '-1': (a = 0, b = 0, c = 0) => abs(a - c) <= abs(b - c),
        '0': (a = 0, b = 0, c = 0) => abs(a - c) < abs(b - c),
        '1': null
    };
    return (value, pattern, method = 0) => {
        let res;
        if (isArray(pattern)) {
            if (!pattern.length)
                res = value;
            else {
                const f = METHODS_FOR_ARR[method] || METHODS_FOR_ARR[0];
                res = pattern.reduce((prev, curr) => f(prev, curr, value) ? prev : curr);
            }
        }
        else if (pattern && isNumber(pattern)) {
            pattern = abs(pattern);
            const coef = abs(value % pattern);
            let fin = value - coef;
            fin = +method > 0 || !method && coef > pattern / 2 ? fin + pattern : fin;
            const str = `${pattern}`;
            const index = str.indexOf('.');
            res = index === -1 ? fin : +fin.toFixed(str.length - index - 1);
        }
        else
            res = (METHODS_FOR_NUM[method] || METHODS_FOR_NUM[0])(value);
        return res;
    };
})();

exports.concat = concat;
exports.filterUnique = filterUnique;
exports.hash = hash;
exports.isArray = isArray;
exports.isBoolean = isBoolean;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.isString = isString;
exports.jsonParse = jsonParse;
exports.jsonStringify = jsonStringify;
exports.keys = keys;
exports.nearly = nearly;
exports.trycatch = trycatch;
