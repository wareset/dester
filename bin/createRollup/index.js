'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var kleur = require('kleur');
var rollup = require('rollup');
var __rollupPluginJson__ = require('@rollup/plugin-json');
var __rollupPluginTypescript2__ = require('rollup-plugin-typescript2');
var pluginBabel = require('@rollup/plugin-babel');
var jsonStringify = require('@wareset-utilites/lang/jsonStringify');
var jsonParse = require('@wareset-utilites/lang/jsonParse');
var startsWith = require('@wareset-utilites/string/startsWith');
var padStart = require('@wareset-utilites/string/padStart');
var concat = require('@wareset-utilites/array/concat');
var keys = require('@wareset-utilites/object/keys');
var unique = require('@wareset-utilites/unique');
var trycatch = require('@wareset-utilites/trycatch');
var sortPackageJson = require('../sortPackageJson');
var fs = require('fs');
var path = require('path');
var utils = require('../utils');
var messages = require('../messages');
var terser = require('terser');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var __rollupPluginJson____default = /*#__PURE__*/_interopDefaultLegacy(__rollupPluginJson__);
var __rollupPluginTypescript2____default = /*#__PURE__*/_interopDefaultLegacy(__rollupPluginTypescript2__);
var jsonStringify__default = /*#__PURE__*/_interopDefaultLegacy(jsonStringify);
var jsonParse__default = /*#__PURE__*/_interopDefaultLegacy(jsonParse);
var startsWith__default = /*#__PURE__*/_interopDefaultLegacy(startsWith);
var padStart__default = /*#__PURE__*/_interopDefaultLegacy(padStart);
var concat__default = /*#__PURE__*/_interopDefaultLegacy(concat);
var keys__default = /*#__PURE__*/_interopDefaultLegacy(keys);
var unique__default = /*#__PURE__*/_interopDefaultLegacy(unique);
var trycatch__default = /*#__PURE__*/_interopDefaultLegacy(trycatch);
var sortPackageJson__default = /*#__PURE__*/_interopDefaultLegacy(sortPackageJson);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

const rollupPluginJson = __rollupPluginJson____default["default"]();
// import rollupPluginSucrase from '@rollup/plugin-sucrase'
const __rollupPluginSucrase__ = require('@rollup/plugin-sucrase');
const posixSep = path__default["default"].posix.sep;
const terserOptions = {
    module: true,
    toplevel: true,
    // compress: {
    //   // expression: true,
    //   // drop_console: true,
    //   evaluate: false
    // },
    // format: {
    //   quote_style: 1
    // },
    sourceMap: true,
    keep_classnames: true,
    // mangle: {
    //   safari10: true
    //   // properties: true
    // }
    safari10: true
    // format: {
    //   beautify: true
    // }
};
// renderChunk transform
const rollupPluginTerser = {
    // eslint-disable-next-line consistent-return
    async transform(code) {
        try {
            const res = await terser.minify(`/* ${Date.now()} */\n${code}`, terserOptions);
            // console.log(code)
            // console.log(res)
            return res;
        }
        catch (e) {
            messages.messageCompileError(e);
        }
    }
};
// const resolveExternals = (key: string, v?: string): string => {
//   let res = v !== undefined ? pathRelative(key, v) : key
//   if (!startsWith(res, pathSep) && !startsWith(res, '..'))
//     res = '.' + pathSep + res
//   if (last(res) === pathSep) res = res.slice(0, -1)
//   return res
// }
const fixSource = (file) => {
    if (!/^\.+([/\\]|$)/.test(file))
        file = path.join('..', file).slice(1);
    // if (file === '.' || file === '..') file += pathSep + 'index'
    return file;
};
const isIndex = (file) => /(?:[\\/]|^)index(?:\.[^.]+$|$)/.test(file);
const __packagejson__ = 'package.json';
const __indexdts__ = 'index.d.ts';
const __indexmjs__ = 'index.mjs';
const __indexjs__ = 'index.js';
const createPackages = (output, paths, pkgbeauty) => {
    const each = (filepath, paths) => {
        const stat = utils.existsStatSync(filepath);
        if (stat && stat.isDirectory()) {
            const obj = {};
            // prettier-ignore
            fs.readdirSync(filepath).forEach((name) => {
                obj[name] = 1;
            });
            const filepkgjson = path.join(filepath, __packagejson__);
            const pkgJsonStrOld = __packagejson__ in obj
                ? fs.readFileSync(filepkgjson, 'utf8').toString()
                : '{}';
            let pkgJson = jsonParse__default["default"](pkgJsonStrOld);
            if (pkgJson.files || !keys__default["default"](pkgJson).length) {
                const files = [
                    ...[__indexjs__, __indexmjs__, __indexdts__],
                    ...pkgJson.files || [],
                    ...paths.map((v) => v.split(posixSep)[0])
                ].sort();
                pkgJson.files = unique__default["default"](files, (v) => v in obj).sort();
            }
            if (__indexdts__ in obj)
                pkgJson.types = __indexdts__;
            if (__indexmjs__ in obj)
                pkgJson.module = __indexmjs__;
            if (__indexjs__ in obj || __indexmjs__ in obj)
                pkgJson.main = 'index';
            if (pkgbeauty)
                pkgJson = sortPackageJson__default["default"](pkgJson);
            const pkgJsonStrNew = jsonStringify__default["default"](pkgJson, void 0, 2);
            // prettier-ignore
            pkgJsonStrOld.trim() === pkgJsonStrNew.trim() || trycatch__default["default"](() => {
                fs.writeFileSync(filepkgjson, pkgJsonStrNew);
            }, () => {
                messages.messageError(`Unable to create a "${__packagejson__}":`, filepkgjson);
            });
            const obj2 = {};
            paths.forEach((v) => {
                const pathsArr = v.split(posixSep);
                const newPath = pathsArr.shift();
                if (newPath && pathsArr[0] && !(newPath in obj2) && newPath in obj) {
                    obj2[newPath] = 1;
                    const newPaths = paths
                        .filter((v) => startsWith__default["default"](v, newPath + posixSep))
                        .map((v) => v.split(posixSep).slice(1).join(posixSep));
                    each(path.join(filepath, newPath), newPaths);
                }
            });
        }
    };
    each(output, paths);
};
const outputProps = {
    exports: 'named',
    sourcemap: false
    // compact: true
};
const createRollup = (input, output, pkg, tsc, babel, types, force, minify, pkgbeauty, watch, silent) => {
    const inputPosix = utils.toPosix(input);
    const { include } = utils.getInputFiles(input);
    const includeObj = {};
    // const excludeObj: { [key: string]: TypeInputFile } = {}
    // exclude.forEach((v) => {
    //   excludeObj[v.final] = v
    // })
    // console.log(jsonStringify(excludeObj, undefined, 2))
    // prettier-ignore
    const packageJsonStrOld = pkg
        ? trycatch__default["default"](() => fs.readFileSync(pkg).toString(), () => messages.messageError('The file cannot be read:', pkg))
        : '{}';
    let packageJson = jsonParse__default["default"](packageJsonStrOld);
    if (pkg && pkgbeauty) {
        packageJson = sortPackageJson__default["default"](packageJson);
        const packageJsonStrNew = jsonStringify__default["default"](packageJson, void 0, 2);
        packageJsonStrOld.trim() === packageJsonStrNew.trim() ||
            fs.writeFileSync(pkg, packageJsonStrNew);
    }
    const externalDefault = keys__default["default"](process.binding('natives'));
    const external = concat__default["default"](externalDefault, keys__default["default"](packageJson.dependencies || {}), keys__default["default"](packageJson.peerDependencies || {}));
    const devDependencies = keys__default["default"](packageJson.devDependencies || {});
    const depsInspect = {};
    const dikey = '/\\/\\';
    // prettier-ignore
    tsc && trycatch__default["default"](() => {
        !!require.resolve('.bin/tsc');
    }, () => {
        messages.messageError('"typescript" not found.', 'Use argument "--no-tsc" or install "typescript" (npm i typescript)');
    });
    // prettier-ignore
    const rollupPluginSucrase = __rollupPluginSucrase__({ transforms: ['typescript'] });
    // prettier-ignore
    const rollupPluginTSC = !tsc
        ? rollupPluginSucrase
        : __rollupPluginTypescript2____default["default"]({
            check: !force,
            // verbosity: 2,
            tsconfig: tsc,
            tsconfigOverride: {
                // buildOptions: { verbose: true },
                compilerOptions: { declaration: false }, include: [utils.toPosix(input)]
            }
        });
    // prettier-ignore
    babel && trycatch__default["default"](() => {
        require.resolve('@babel/core');
    }, () => {
        messages.messageError('"@babel/core" not found.', 'Use argument "--no-babel" or install "@babel/core" (npm i @babel/core)');
    });
    const rollupPluginBabel = babel
        ? pluginBabel.getBabelOutputPlugin({ configFile: babel })
        : null;
    const rolls = [];
    include.forEach((inputFile) => {
        includeObj[inputFile.final] = inputFile;
        const isNeedTSC = /^\.tsx?$/.test(inputFile.ext);
        // console.log(inputFile)
        // const externalCustom = [...externalDefault]
        // include.forEach((v) => {
        //   if (v.final !== inputFile.final) {
        //     externalCustom.push(
        //       toPosix(
        //         fixSource(
        //           pathDirname(pathRelative(pathDirname(inputFile.final), v.final))
        //         )
        //       )
        //     )
        //   }
        // })
        rolls.push({
            external: externalDefault,
            input: utils.toPosix(path.resolve(input, inputFile.origin)),
            // prettier-ignore
            output: [
                {
                    file: utils.toPosix(path.resolve(output, inputFile.final + '.mjs')),
                    format: 'esm',
                    ...outputProps
                },
                {
                    file: utils.toPosix(path.resolve(output, inputFile.final + '.js')),
                    format: 'cjs',
                    ...outputProps
                }
            ],
            plugins: [
                // ...(inputFile.name !== 'index' ? [rollupPluginAlias] : []),
                rollupPluginJson,
                {
                    // eslint-disable-next-line consistent-return
                    resolveId(source, file) {
                        if (file && startsWith__default["default"](utils.toPosix(file), inputPosix)) {
                            if (!(file in depsInspect) || depsInspect[file][dikey]) {
                                depsInspect[file] = { deps: {} };
                            }
                            if (!/^[./\\]/.test(source)) {
                                let dep = '';
                                let isDevDep = false;
                                // prettier-ignore
                                if (!external.some((path) => startsWith__default["default"](source, dep = path)) &&
                                    !(isDevDep = devDependencies.some((path) => startsWith__default["default"](source, path)))) {
                                    (force || watch ? messages.messageWarn : messages.messageError)('Dependency "' + source + '" - not found. File:', file);
                                }
                                if (dep)
                                    depsInspect[file].deps[dep] = 1;
                                if (!isDevDep)
                                    return { id: source, external: true };
                            }
                            else {
                                let ns = path.resolve(path.dirname(file), source);
                                const ext = path.extname(ns);
                                // console.log('\n', 12)
                                // console.log(file)
                                // console.log(source)
                                // console.log(isAllowedFile(ns, input))
                                // console.log(isAllowedFile(file, input))
                                if (startsWith__default["default"](ns, input) &&
                                    // isAllowedFile(ns, input) &&
                                    utils.isAllowedFile(file, input) &&
                                    (!ext || utils.isJTSX(ext))) {
                                    if (ext)
                                        ns = ns.slice(0, -ext.length);
                                    if (!isIndex(ns))
                                        ns = path.join(ns, 'index');
                                    const nskey = path.relative(input, ns);
                                    if (nskey in includeObj) {
                                        ns = path.relative(file, path.dirname(ns));
                                        if (isIndex(file))
                                            ns = path.relative('..', ns);
                                        ns = utils.toPosix(fixSource(ns));
                                        return { id: ns, external: true };
                                    }
                                }
                                // return { id: source, external: true }
                            }
                        }
                    }
                    // load(id: any): any {
                    //   console.log('load', id)
                    //   if (id in resolveCache)
                    //     return `export * from ${jsonStringify(
                    //       '/' + pathRelative(input, resolveCache[id].origin)
                    //     )};`
                    // }
                },
                {
                    transform(_code, _id) {
                        // console.log(3434, _id)
                        return `/* filename: ${path.relative(input, _id)}\n  timestamp: ${new Date().toISOString()} */\n${_code}`;
                        // return `/*! file: ${pathRelative(input, id)} */\n${code}`
                    }
                },
                // prettier-ignore
                ...isNeedTSC ? [rollupPluginTSC] : [ /* rollupPluginSucrase */],
                ...babel ? [rollupPluginBabel] : [],
                {
                    writeBundle({ format }, data) {
                        if (format === 'cjs' && types) {
                            let exports = [];
                            // prettier-ignore
                            keys__default["default"](data).forEach((k) => {
                                exports.push(...data[k].exports || []);
                            });
                            exports = unique__default["default"](exports);
                            // prettier-ignore
                            const source = jsonStringify__default["default"](fixSource(utils.toPosix(path.join(path.relative(path.dirname(path.join(output, inputFile.final)), path.join(types, inputFile.dir)), path.dirname(path.relative(inputFile.dir, inputFile.final))))));
                            let text = `export * from ${source};\n`;
                            exports.forEach((v) => {
                                if (v === 'default') {
                                    text += `import __default__ from ${source};\n`;
                                    text += 'export { __default__ as default };\n';
                                }
                                else if (v[0] !== '*') {
                                    text += `export { ${v} } from ${source};\n`;
                                }
                            });
                            const writePath = path.join(path.dirname(path.join(output, inputFile.final)), __indexdts__);
                            fs.writeFileSync(writePath, text);
                        }
                    }
                },
                ...minify ? [rollupPluginTerser] : [],
                {
                    renderChunk(code, data) {
                        return `/* eslint-disable */\n/*\ndester builds:\n${keys__default["default"](data.modules)
                            .map((v) => path.relative(input, v) + '\n')
                            .join('')}*/\n${code}`;
                    }
                }
            ]
        });
    });
    const watcher = rollup.watch(rolls);
    utils.processExit(() => {
        watcher && watcher.close();
    });
    const includeObjKeys = keys__default["default"](includeObj);
    const includeObjKeysLen = includeObjKeys.length;
    const iokls = (includeObjKeysLen + '').length;
    let isError = false;
    let isNeedCreatePackages = true;
    watcher.on('event', (event) => {
        // verbose(event)
        // event.code can be one of:
        //   START        — the watcher is (re)starting
        //   BUNDLE_START — building an individual bundle
        //   BUNDLE_END   — finished building a bundle
        //   END          — finished building all bundles
        //   ERROR        — encountered an error while bundling
        let inp = '';
        if (event.input)
            inp = path.relative(input, event.input);
        if (event.code === 'START') {
            isError = false;
            // silent || logInfo(event.code)
        }
        // if (event.code === 'BUNDLE_START') {
        //   isError || silent || logInfo(event.code + ': ' + inp)
        // }
        if (event.code === 'BUNDLE_END') {
            const resFile = path.relative(output, event.output[1].slice(0, -3));
            // prettier-ignore
            isError || silent || messages.log(kleur.green('BUILD: ') +
                kleur.green(`[${padStart__default["default"](includeObjKeys.indexOf(resFile) + 1 + '', iokls, '0')}/${includeObjKeysLen}]`) +
                ' - ' + inp + ' -> ' + resFile);
        }
        if (event.code === 'ERROR') {
            const res = event.result || {};
            isError = true;
            messages.messageCompileError(kleur.white((res.watchFiles || []).join('\n')), event.error);
            // console.log(event.result)
        }
        if (event.code === 'END') {
            if (!isError && isNeedCreatePackages) {
                isNeedCreatePackages = false;
                const pathsList = keys__default["default"](includeObj).map((v) => utils.toPosix(v));
                if (types)
                    pathsList.push(utils.toPosix(path.relative(output, types)));
                createPackages(output, pathsList, pkgbeauty);
            }
            if (!isError && pkg) {
                const deps = { ...packageJson.dependencies || {} };
                const depsPeer = { ...packageJson.peerDependencies || {} };
                keys__default["default"](depsInspect).forEach((k) => {
                    depsInspect[k][dikey] = true;
                    keys__default["default"](depsInspect[k].deps).forEach((dep) => {
                        delete depsPeer[dep];
                        delete deps[dep];
                    });
                });
                const depsArr = keys__default["default"](deps);
                const depsPArr = keys__default["default"](depsPeer);
                if (depsPArr[0]) {
                    silent || messages.messageWarn('Unused peerDependencies:\n', ...depsPArr);
                }
                if (depsArr[0])
                    messages.messageWarn('Unused dependencies:\n', ...depsArr);
            }
            isError || silent || messages.log(kleur.green('BUILD: WAIT...'));
            if (!watch)
                watcher.close();
        }
    });
    return watcher;
};

exports["default"] = createRollup;
