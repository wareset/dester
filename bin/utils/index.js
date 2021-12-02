'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');
var path = require('path');
var isString = require('@wareset-utilites/is/isString');
var trycatch = require('@wareset-utilites/trycatch');
var messages = require('../messages');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

const toPosix = (str) => str.split(path__default["default"].sep).join(path__default["default"].posix.sep);
const isAllowedFile = (file, input) => !/\btests?\b|(^|\/|\\)_/.test(input ? path.relative(input, file) : file);
const existsStatSync = (directory) => trycatch.trycatch(() => fs.statSync(directory), false);
const isDirectory = (directory) => trycatch.trycatch(() => fs.statSync(directory).isDirectory(), false);
// export const isFile = (directory: string): boolean => {
//   return trycatch(() => !fsStatSync(directory).isDirectory(), false)
// }
const removeSync = (filepath) => {
    const stat = existsStatSync(filepath);
    if (stat) {
        if (stat.isDirectory()) {
            fs.readdirSync(filepath).forEach((name) => {
                removeSync(path.resolve(filepath, name));
            });
            fs.rmdirSync(filepath);
        }
        else
            fs.unlinkSync(filepath);
    }
    return !!stat;
};
const createDirSync = (filepath, throwler = () => messages.messageError('Unable to create a folder:', filepath)) => trycatch.trycatch(() => (fs.mkdirSync(filepath, { recursive: true }), true), throwler);
const getConfigDir = (config, defs, silent) => {
    let res = '';
    if (config) {
        let Dirent;
        let root = path.resolve();
        const rootOrigin = root;
        // prettier-ignore
        const getRes = () => res = defs.map((v) => path.resolve(root, v))
            .filter((v) => (Dirent = existsStatSync(v)) && !Dirent.isDirectory())[0] || '';
        if (isString.isString(config)) {
            root = path.resolve(root, config);
            if ((Dirent = existsStatSync(root)) && !Dirent.isDirectory())
                res = root;
            else
                getRes();
            if (res) {
                silent || messages.messageSuccess(defs[0] + ' - was selected manually:', res);
            }
            else
                messages.messageError(defs[0] + ' - not found in "' + config + '":', root);
        }
        else {
            while (!getRes() && root !== (root = path.dirname(root)))
                ;
            if (!silent) {
                if (res)
                    messages.messageSuccess(defs[0] + ' - was selected automatically:', res);
                else
                    messages.messageWarn(defs[0] + ' - not found in:', rootOrigin);
            }
        }
    }
    return res;
};
const processExit = (cb) => {
    let isRun;
    process.on('SIGBREAK', (...a) => {
        if (!isRun)
            cb(...a), isRun = true;
        process.exit();
    });
    process.on('SIGINT', (...a) => {
        if (!isRun)
            cb(...a), isRun = true;
        process.exit();
    });
    process.on('exit', (...a) => {
        if (!isRun)
            cb(...a), isRun = true;
    });
};
const isJTSX = (fileOrExt) => /\.[jt]sx?$/.test(fileOrExt);
const getInputFiles = (input) => {
    const include = [];
    const exclude = [];
    const cache = {};
    const each = (filepath) => {
        const stat = existsStatSync(filepath);
        if (stat) {
            if (stat.isDirectory()) {
                fs.readdirSync(filepath).forEach((name) => {
                    each(path.resolve(filepath, name));
                });
            }
            else {
                const origin = path.relative(input, filepath);
                const { dir, name, ext } = path.parse(origin);
                if (isJTSX(ext)) {
                    let final = 'index';
                    if (name !== 'index')
                        final = path.join(dir, name, final);
                    else if (dir)
                        final = path.join(dir, name);
                    // prettier-ignore
                    if (final in cache) {
                        messages.messageError('Duplicate paths for compiling files in "Input":', { File1: cache[final], File2: origin }, 'The final path for "' + final + '"');
                    }
                    (isAllowedFile(origin) && (cache[final] = origin)
                        ? include
                        : exclude).push(
                    // prettier-ignore
                    { dir, name, ext, final, origin });
                }
            }
        }
    };
    each(input);
    return { include, exclude };
};

exports.createDirSync = createDirSync;
exports.existsStatSync = existsStatSync;
exports.getConfigDir = getConfigDir;
exports.getInputFiles = getInputFiles;
exports.isAllowedFile = isAllowedFile;
exports.isDirectory = isDirectory;
exports.isJTSX = isJTSX;
exports.processExit = processExit;
exports.removeSync = removeSync;
exports.toPosix = toPosix;
