'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var kleur = require('kleur');
var autoRemove = require('../autoRemove');
var createTypes = require('../createTypes');
var createRollup = require('../createRollup');
var chokidar = require('chokidar');
var messages = require('../messages');
var includes = require('@wareset-utilites/array/includes');
var viewLogo = require('../logo');
var utils = require('../utils');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var autoRemove__default = /*#__PURE__*/_interopDefaultLegacy(autoRemove);
var createTypes__default = /*#__PURE__*/_interopDefaultLegacy(createTypes);
var createRollup__default = /*#__PURE__*/_interopDefaultLegacy(createRollup);
var chokidar__default = /*#__PURE__*/_interopDefaultLegacy(chokidar);
var includes__default = /*#__PURE__*/_interopDefaultLegacy(includes);
var viewLogo__default = /*#__PURE__*/_interopDefaultLegacy(viewLogo);

const init = ({ input, output, remove, types, watch, silent, pkg: _pkg, tsc: _tsc, babel: _babel, force, minify, pkgbeauty }) => {
    if ((force = !!force)) {
        messages.logWarn('Force mode is enabled');
    }
    if (types && remove && utils.isDirectory(types))
        utils.removeSync(types);
    autoRemove__default['default'](remove, input, output, types, silent);
    if (types)
        utils.createDirSync(types);
    let isFirstStart = true;
    const compile = () => {
        const pkg = utils.getConfigDir(_pkg, ['package.json'], silent);
        const tsc = utils.getConfigDir(_tsc, ['tsconfig.json'], silent);
        // prettier-ignore
        const babel = utils.getConfigDir(_babel, ['babel.config.json', 'babel.config.js', '.babelrc.json', '.babelrc.js'], silent);
        // prettier-ignore
        let rollupWatcher = createRollup__default['default'](input, output, pkg, tsc, babel, types, force, minify, pkgbeauty, watch, silent);
        if (isFirstStart)
            createTypes__default['default'](types, input, output, pkgbeauty, watch, silent);
        if (watch) {
            silent || messages.messageInfo('Start of watchers');
            let isReady;
            const watchfiles = [input, /* pkg, */ tsc, babel].filter((v) => v);
            // eslint-disable-next-line security/detect-non-literal-fs-filename
            const watcher = chokidar__default['default'].watch(watchfiles, { persistent: true });
            const resetWatchers = () => {
                isReady = false;
                if (rollupWatcher)
                    rollupWatcher.close(), (rollupWatcher = null);
                watcher.close().then(() => {
                    console.log('\x1bc');
                    silent || viewLogo__default['default']();
                    silent || messages.messageInfo('Restarting watchers');
                    compile();
                });
            };
            const watchFn = (_type, _file) => {
                if (isReady && _file !== watchfiles[0]) {
                    silent || messages.log(kleur.green('WATCH: ') + _type + ': ' + _file);
                    // prettier-ignore
                    if (includes__default['default'](watchfiles, _file) || ((_type === 'add' || _type === 'unlink')
                        && utils.isAllowedFile(_file, input) && utils.isJTSX(_file)))
                        resetWatchers();
                }
            };
            watcher.on('all', watchFn).on('ready', () => {
                isReady = true;
            });
        }
        isFirstStart = false;
    };
    compile();
    // await timeout(30000)
};

exports.default = init;
