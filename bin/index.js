'use strict';

var fs = require('fs');
var path = require('path');
var minimist = require('minimist');
var jsonStringify = require('@wareset-utilites/lang/jsonStringify');
var startsWith = require('@wareset-utilites/string/startsWith');
var isBoolean = require('@wareset-utilites/is/isBoolean');
var isObject = require('@wareset-utilites/is/isObject');
var isString = require('@wareset-utilites/is/isString');
var isNumber = require('@wareset-utilites/is/isNumber');
var keys = require('@wareset-utilites/object/keys');
var trycatch = require('@wareset-utilites/trycatch');
var messages = require('./messages');
var utils = require('./utils');
var viewLogo = require('./logo');
var HELP = require('./help');
var init = require('./init');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var minimist__default = /*#__PURE__*/_interopDefaultLegacy(minimist);
var viewLogo__default = /*#__PURE__*/_interopDefaultLegacy(viewLogo);
var HELP__default = /*#__PURE__*/_interopDefaultLegacy(HELP);
var init__default = /*#__PURE__*/_interopDefaultLegacy(init);

let incorrectArg = '';
if (process.argv.some((v) => startsWith.startsWith(v, '-no-') && (incorrectArg = v))) {
    messages.messageError(`Incorrect argument: ${incorrectArg}`);
}
const __argv__ = minimist__default["default"](process.argv.slice(2), {
    default: {
        help: false,
        remove: false,
        types: true,
        watch: false,
        silent: false,
        pkg: true,
        tsc: true,
        babel: false,
        force: false,
        minify: false,
        pkgbeauty: true
    },
    string: ['input', 'output', 'remove', 'types'],
    boolean: ['help', 'watch', 'silent', 'force', 'minify', 'pkgbeauty'],
    alias: {
        h: 'help',
        i: 'input',
        o: 'output',
        r: 'remove',
        t: 'types',
        w: 'watch',
        s: 'silent',
        f: 'force',
        m: 'minify'
    }
});
const isValidSrcAndDist = (Input, Output) => {
    if (startsWith.startsWith(Output, Input)) {
        messages.messageError('"Input" and "Output" should be different and separate:', jsonStringify.jsonStringify({ Input, Output }, void 0, 2));
    }
    if (!utils.isDirectory(Input))
        messages.messageError('"Input" is not directory:', Input);
    trycatch.trycatch(() => fs.mkdirSync(Output, { recursive: true }), (e) => messages.messageError('Unable to create a "Output" folder', e));
};
// const __autotypes__ = (input: string, output: string): string => {
//   let res: string
//   let c = ''
//   const n = 'types'
//   const filenames = fsReaddirSync(input)
//   while (
//     (res = '__' + n + '_' + c + '_') &&
//     filenames.some((v) => startsWith(v, res))
//   )
//     c = (+c || 0) + 1 + ''
//   return pathResolve(output, res)
// }
const run = () => {
    const argv = { ...__argv__ };
    // console.log('\u001bc')
    if (argv.watch)
        console.log('\x1bc');
    if (argv.help || !argv.silent)
        viewLogo__default["default"]();
    // messageError({ q: 1 })
    // if (!argv.qq) return
    if (argv.help) {
        console.log(HELP__default["default"]);
    }
    else {
        argv.input = argv.input || argv._[0] || 'src';
        argv.output =
            argv.output ||
                argv._[1] ||
                argv._[0] !== argv.input && argv._[0] ||
                'dist';
        const res = {
            help: false,
            input: '',
            output: '',
            remove: '',
            types: '',
            watch: false,
            silent: false,
            pkg: true,
            tsc: true,
            babel: true,
            force: false,
            minify: false,
            pkgbeauty: true
        };
        keys.keys(argv).forEach((k) => {
            if (k in res) {
                let v = argv[k];
                if (isObject.isObject(v))
                    messages.messageError(`Not valid arguments: ${k}:`, v);
                if (isString.isString(v) || isNumber.isNumber(v))
                    v = (v + '').trim();
                res[k] = v;
            }
        });
        res.input = path.resolve(res.input);
        res.output = path.resolve(res.output);
        isValidSrcAndDist(res.input, res.output);
        const remove = res.remove;
        if (!isString.isString(remove)) {
            if (!isBoolean.isBoolean(remove)) {
                messages.messageError('"Remove" must be String or Boolean.', 'Current: ' + remove);
            }
        }
        else if (remove === '') {
            res.remove = true;
        }
        let types = res.types;
        if (!isString.isString(types)) {
            if (!isBoolean.isBoolean(types)) {
                messages.messageError('"Types" must be String or Boolean.', 'Current: ' + types);
            }
            types = res.types = types ? path.resolve(res.output, '__types__') : '';
        }
        if (types) {
            types = res.types = /^\.+[/\\]/.test(types)
                ? path.resolve(types)
                : path.resolve(res.output, types);
            if (startsWith.startsWith(types, res.input)) {
                messages.messageError('"Input" and "TypesDir" should be different and separate:', { Input: res.input, TypesDir: types });
            }
        }
        init__default["default"](res);
    }
};
run();
