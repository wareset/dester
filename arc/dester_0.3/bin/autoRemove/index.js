'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var kleur = require('kleur');
var fs = require('fs');
var path = require('path');
var wsUtils = require('../ws-utils');
var messages = require('../messages');
var utils = require('../utils');

const __removeAndMessage__ = (removeDir, silent, prefix = 'auto', warn = false) => {
    if (utils.removeSync(removeDir)) {
        silent || messages.log(kleur.green(prefix + 'remove: ') + removeDir);
    }
    else if (warn) {
        silent || messages.log(kleur.red(prefix + 'remove: file not found ') + removeDir);
    }
};
const autoremove = (remove, input, output, types, silent) => {
    if (remove) {
        if (wsUtils.isString(remove)) {
            const removeDir = remove.split(',').map((v) => path.resolve(v));
            removeDir.forEach((removeDir) => {
                if (input.startsWith(removeDir)) {
                    silent ||
                        messages.messageWarn('"Input" and "RemoveDir" should be different and separate:', { input, removeDir });
                }
                else
                    __removeAndMessage__(removeDir, silent, '', true);
            });
        }
        else if (output) {
            fs.readdirSync(input, { withFileTypes: true }).forEach((Dirent) => {
                let name = Dirent.name;
                if (utils.isAllowedFile(name)) {
                    let isDir;
                    if (!Dirent.isDirectory())
                        isDir = true, name = utils.isJTSX(name) ? path.parse(name).name : '';
                    if (!isDir && name === 'index') {
                        // __removeAndMessage__(pathResolve(output, name + '.js'), silent)
                        // __removeAndMessage__(pathResolve(output, name + '.mjs'), silent)
                        types ||
                            __removeAndMessage__(path.resolve(output, name + '.d.ts'), silent);
                    }
                    else if (name) {
                        __removeAndMessage__(path.resolve(output, name), silent);
                    }
                }
            });
        }
    }
};

exports["default"] = autoremove;
