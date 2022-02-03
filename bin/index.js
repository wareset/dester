'use strict';

var fs = require('fs');
var path = require('path');
var minimist = require('minimist');
var wsUtils = require('./ws-utils');
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
if (process.argv.some((v) => v.startsWith('-no-') && (incorrectArg = v))) {
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
    if (Output.startsWith(Input)) {
        messages.messageError('"Input" and "Output" should be different and separate:', wsUtils.jsonStringify({ Input, Output }, void 0, 2));
    }
    if (!utils.isDirectory(Input))
        messages.messageError('"Input" is not directory:', Input);
    wsUtils.trycatch(() => fs.mkdirSync(Output, { recursive: true }), (e) => messages.messageError('Unable to create a "Output" folder', e));
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
        wsUtils.keys(argv).forEach((k) => {
            if (k in res) {
                let v = argv[k];
                if (wsUtils.isObject(v))
                    messages.messageError(`Not valid arguments: ${k}:`, v);
                if (wsUtils.isString(v) || wsUtils.isNumber(v))
                    v = (v + '').trim();
                res[k] = v;
            }
        });
        res.input = path.resolve(res.input);
        res.output = path.resolve(res.output);
        isValidSrcAndDist(res.input, res.output);
        const remove = res.remove;
        if (!wsUtils.isString(remove)) {
            if (!wsUtils.isBoolean(remove)) {
                messages.messageError('"Remove" must be String or Boolean.', 'Current: ' + remove);
            }
        }
        else if (remove === '') {
            res.remove = true;
        }
        let types = res.types;
        if (!wsUtils.isString(types)) {
            if (!wsUtils.isBoolean(types)) {
                messages.messageError('"Types" must be String or Boolean.', 'Current: ' + types);
            }
            types = res.types = types ? path.resolve(res.output, '__types__') : '';
        }
        if (types) {
            types = res.types = /^\.+[/\\]/.test(types)
                ? path.resolve(types)
                : path.resolve(res.output, types);
            if (types.startsWith(res.input)) {
                messages.messageError('"Input" and "TypesDir" should be different and separate:', { Input: res.input, TypesDir: types });
            }
        }
        init__default["default"](res);
    }
};
run();
