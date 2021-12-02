'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var kleur = require('kleur');
var path = require('path');
var fs = require('fs');
var child_process = require('child_process');
var jsonStringify = require('@wareset-utilites/lang/jsonStringify');
var jsonParse = require('@wareset-utilites/lang/jsonParse');
var trycatch = require('@wareset-utilites/trycatch');
var hash = require('@wareset-utilites/hash');
var unique = require('@wareset-utilites/unique');
var sortPackageJson = require('../sortPackageJson');
var messages = require('../messages');
var utils = require('../utils');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var sortPackageJson__default = /*#__PURE__*/_interopDefaultLegacy(sortPackageJson);

const createCacheDir = () => {
    const res = path.resolve(require.main.paths[0] || path.resolve(), '.cache', 'dester');
    utils.createDirSync(res);
    return res;
};
const createTypes = (types, input, output, pkgbeauty, watch, silent) => {
    let tsc = '';
    if (types) {
        silent ||
            messages.messageInfo('Creating types. Trying to start a "tsc". TypesDir:', types);
        trycatch.trycatch(() => {
            tsc = require.resolve('.bin/tsc');
            // silent ||
            //   messageSuccess('Module "tsc" ("typescript") has been found:', tsc)
        }, () => {
            messages.messageError('Unable to start creating types. "typescript" not found.', 'Use argument "--no-types" or install "typescript" (npm i typescript)');
        });
        // createDirSync(types)
        const configfile = path.resolve(createCacheDir(), hash.hash(input + output) + '.json');
        utils.processExit(() => {
            utils.removeSync(configfile);
        });
        const config = {
            // Change this to match your project
            include: [utils.toPosix(path.join(input, '/**/*'))],
            exclude: [
                // toPosix(pathJoin(input, '/**/(_*|tests?|*.tests?.*|tests?.*|*.tests?)'))
                utils.toPosix(path.join(input, '/**/_*')),
                utils.toPosix(path.join(input, '/**/test')),
                utils.toPosix(path.join(input, '/**/tests')),
                utils.toPosix(path.join(input, '/**/*.test.*')),
                utils.toPosix(path.join(input, '/**/*.tests.*')),
                utils.toPosix(path.join(input, '/**/*.test')),
                utils.toPosix(path.join(input, '/**/*.tests')),
                utils.toPosix(path.join(input, '/**/test.*')),
                utils.toPosix(path.join(input, '/**/tests.*'))
            ],
            compilerOptions: {
                // Tells TypeScript to read JS files, as
                // normally they are ignored as source files
                allowJs: true,
                // Generate d.ts files
                declaration: true,
                // This compiler run should
                // only output d.ts files
                emitDeclarationOnly: true,
                // Types should go into this directory.
                // Removing this would place the .d.ts files
                // next to the .js files
                outDir: utils.toPosix(types),
                // declarationDir: DIR_TYPES,
                experimentalDecorators: true,
                emitDecoratorMetadata: true,
                resolveJsonModule: true,
                allowSyntheticDefaultImports: true,
                esModuleInterop: true,
                target: 'esnext',
                moduleResolution: 'node',
                module: 'esnext'
            }
        };
        trycatch.trycatch(() => fs.writeFileSync(configfile, jsonStringify.jsonStringify(config, void 0, 2)), (e) => messages.messageError(e));
        trycatch.trycatch(() => {
            let childProcess = child_process.spawn(tsc, ['--build', configfile, ...watch ? ['--watch'] : []], { shell: true }
            // { stdio: ['ignore', 'inherit', 'inherit'], shell: true })
            );
            const exit = () => {
                childProcess && childProcess.kill(0), childProcess = null;
            };
            utils.processExit(exit);
            childProcess.stdout.on('data', (data) => {
                // eslint-disable-next-line no-control-regex
                data = (data + '').replace(/[\u001bc]/g, '').trim();
                if (data) {
                    const isErr = /error([^s]|$)/i.test(data);
                    const mes = isErr ? messages.logError : messages.log;
                    if (!silent || isErr) {
                        mes((isErr ? 'ERROR: ' : kleur.green('TYPES: ')) + data);
                    }
                }
            });
            childProcess.stderr.on('data', (data) => {
                exit(), messages.messageError('' + data);
            });
        }, () => {
            messages.messageError('"Types" child_process not work');
        });
        const parentDir = path.dirname(types);
        const pkgjsonfile = path.resolve(parentDir, 'package.json');
        if (utils.existsStatSync(pkgjsonfile)) {
            const typesFoldername = path.parse(types).name;
            const pkgJsonStrOld = fs.readFileSync(pkgjsonfile, 'utf8').toString();
            let pkgJson = jsonParse.jsonParse(pkgJsonStrOld);
            if (pkgJson.files) {
                pkgJson.files = unique.unique([...pkgJson.files, typesFoldername]).sort();
            }
            if (pkgbeauty)
                pkgJson = sortPackageJson__default["default"](pkgJson);
            const pkgJsonStrNew = jsonStringify.jsonStringify(pkgJson, void 0, 2);
            pkgJsonStrOld.trim() === pkgJsonStrNew.trim() ||
                fs.writeFileSync(pkgjsonfile, pkgJsonStrNew);
        }
    }
    return !!tsc;
};

exports["default"] = createTypes;
