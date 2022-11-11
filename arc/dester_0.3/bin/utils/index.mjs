import { statSync, readdirSync, rmdirSync, unlinkSync, mkdirSync } from 'fs';
import path, { relative, resolve, dirname, parse, join } from 'path';
import { trycatch, isString } from '../ws-utils';
import { messageError, messageSuccess, messageWarn } from '../messages';

const toPosix = (str) => str.split(path.sep).join(path.posix.sep);
const isAllowedFile = (file, input) => !/\btests?\b|(^|\/|\\)_/.test(input ? relative(input, file) : file);
const existsStatSync = (directory) => trycatch(() => statSync(directory), false);
const isDirectory = (directory) => trycatch(() => statSync(directory).isDirectory(), false);
// export const isFile = (directory: string): boolean => {
//   return trycatch(() => !fsStatSync(directory).isDirectory(), false)
// }
const removeSync = (filepath) => {
    const stat = existsStatSync(filepath);
    if (stat) {
        if (stat.isDirectory()) {
            readdirSync(filepath).forEach((name) => {
                removeSync(resolve(filepath, name));
            });
            rmdirSync(filepath);
        }
        else
            unlinkSync(filepath);
    }
    return !!stat;
};
const createDirSync = (filepath, throwler = () => messageError('Unable to create a folder:', filepath)) => trycatch(() => (mkdirSync(filepath, { recursive: true }), true), throwler);
const getConfigDir = (config, defs, silent) => {
    let res = '';
    if (config) {
        let Dirent;
        let root = resolve();
        const rootOrigin = root;
        // prettier-ignore
        const getRes = () => res = defs.map((v) => resolve(root, v))
            .filter((v) => (Dirent = existsStatSync(v)) && !Dirent.isDirectory())[0] || '';
        if (isString(config)) {
            root = resolve(root, config);
            if ((Dirent = existsStatSync(root)) && !Dirent.isDirectory())
                res = root;
            else
                getRes();
            if (res) {
                silent || messageSuccess(defs[0] + ' - was selected manually:', res);
            }
            else
                messageError(defs[0] + ' - not found in "' + config + '":', root);
        }
        else {
            while (!getRes() && root !== (root = dirname(root)))
                ;
            if (!silent) {
                if (res)
                    messageSuccess(defs[0] + ' - was selected automatically:', res);
                else
                    messageWarn(defs[0] + ' - not found in:', rootOrigin);
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
                readdirSync(filepath).forEach((name) => {
                    each(resolve(filepath, name));
                });
            }
            else {
                const origin = relative(input, filepath);
                const { dir, name, ext } = parse(origin);
                if (isJTSX(ext)) {
                    let final = 'index';
                    if (name !== 'index')
                        final = join(dir, name, final);
                    else if (dir)
                        final = join(dir, name);
                    // prettier-ignore
                    if (final in cache) {
                        messageError('Duplicate paths for compiling files in "Input":', { File1: cache[final], File2: origin }, 'The final path for "' + final + '"');
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

export { createDirSync, existsStatSync, getConfigDir, getInputFiles, isAllowedFile, isDirectory, isJTSX, processExit, removeSync, toPosix };
