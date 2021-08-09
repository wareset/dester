import { mkdirSync } from 'fs';
import { resolve } from 'path';
import minimist from 'minimist';
import jsonStringify from '@wareset-utilites/lang/jsonStringify';
import startsWith from '@wareset-utilites/string/startsWith';
import isBoolean from '@wareset-utilites/is/isBoolean';
import isObject from '@wareset-utilites/is/isObject';
import isString from '@wareset-utilites/is/isString';
import isNumber from '@wareset-utilites/is/isNumber';
import keys from '@wareset-utilites/object/keys';
import trycatch from '@wareset-utilites/trycatch';
import { messageError } from './messages';
import { isDirectory } from './utils';
import viewLogo from './logo';
import HELP from './help';
import INIT from './init';

let incorrectArg = '';
if (process.argv.some((v) => startsWith(v, '-no-') && (incorrectArg = v))) {
    messageError(`Incorrect argument: ${incorrectArg}`);
}
const __argv__ = minimist(process.argv.slice(2), {
    default: {
        help: false,
        remove: true,
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
    if (startsWith(Output, Input))
        messageError('"Input" and "Output" should be different and separate:', jsonStringify({ Input, Output }, undefined, 2));
    if (!isDirectory(Input))
        messageError('"Input" is not directory:', Input);
    trycatch(() => mkdirSync(Output, { recursive: true }), (e) => messageError('Unable to create a "Output" folder', e));
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
        viewLogo();
    // messageError({ q: 1 })
    // if (!argv.qq) return
    if (argv.help) {
        console.log(HELP);
    }
    else {
        argv.input = argv.input || argv._[0] || 'src';
        argv.output =
            argv.output ||
                argv._[1] ||
                (argv._[0] !== argv.input && argv._[0]) ||
                'dist';
        const res = {
            help: false,
            input: '',
            output: '',
            remove: false,
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
        keys(argv).forEach((k) => {
            if (k in res) {
                let v = argv[k];
                if (isObject(v))
                    messageError(`Not valid arguments: ${k}:`, v);
                if (isString(v) || isNumber(v))
                    v = (v + '').trim();
                res[k] = v;
            }
        });
        res.input = resolve(res.input);
        res.output = resolve(res.output);
        isValidSrcAndDist(res.input, res.output);
        const remove = res.remove;
        if (!isString(remove)) {
            if (!isBoolean(remove))
                messageError('"Remove" must be String or Boolean.', 'Current: ' + remove);
        }
        let types = res.types;
        if (!isString(types)) {
            if (!isBoolean(types))
                messageError('"Types" must be String or Boolean.', 'Current: ' + types);
            types = res.types = types ? resolve(res.output, '__types__') : '';
        }
        if (types) {
            types = res.types = /^\.+[/\\]/.test(types)
                ? resolve(types)
                : resolve(res.output, types);
            if (startsWith(types, res.input))
                messageError('"Input" and "TypesDir" should be different and separate:', { Input: res.input, TypesDir: types });
        }
        INIT(res);
    }
};
run();
