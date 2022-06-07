import { green, white } from 'kleur';
import { watch } from 'rollup';
import __rollupPluginJson__ from '@rollup/plugin-json';
import __rollupPluginTypescript2__ from 'rollup-plugin-typescript2';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import { trycatch, jsonParse, jsonStringify, keys, concat, filterUnique } from '../ws-utils';
import sortPackageJson from '../sortPackageJson';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import path, { resolve, dirname, extname, join, relative } from 'path';
import { toPosix, getInputFiles, isAllowedFile, isJTSX, processExit, existsStatSync } from '../utils';
import { messageError, messageWarn, log, messageCompileError } from '../messages';
import { minify } from 'terser';

const rollupPluginJson = __rollupPluginJson__();
// import rollupPluginSucrase from '@rollup/plugin-sucrase'
const __rollupPluginSucrase__ = require('@rollup/plugin-sucrase');
const posixSep = path.posix.sep;
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
    safari10: true,
    format: { beautify: true }
};
// renderChunk transform
const rollupPluginTerser = {
    // eslint-disable-next-line consistent-return
    async renderChunk(code) {
        try {
            const res = await minify(`/* ${Date.now()} */\n${code}`, terserOptions);
            // console.log(code)
            // console.log(res)
            return res;
        }
        catch (e) {
            messageCompileError(e);
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
        file = join('..', file).slice(1);
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
        const stat = existsStatSync(filepath);
        if (stat && stat.isDirectory()) {
            const obj = {};
            // prettier-ignore
            readdirSync(filepath).forEach((name) => {
                obj[name] = 1;
            });
            const filepkgjson = join(filepath, __packagejson__);
            const pkgJsonStrOld = __packagejson__ in obj
                ? readFileSync(filepkgjson, 'utf8').toString()
                : '{}';
            let pkgJson = jsonParse(pkgJsonStrOld);
            if (pkgJson.files || !keys(pkgJson).length) {
                const files = [
                    ...[__indexjs__, __indexmjs__, __indexdts__],
                    ...pkgJson.files || [],
                    ...paths.map((v) => v.split(posixSep)[0])
                ].sort();
                pkgJson.files =
                    files.filter((v, k, a) => v in obj && k === a.indexOf(v)).sort();
            }
            if (__indexdts__ in obj)
                pkgJson.types = __indexdts__;
            if (__indexmjs__ in obj)
                pkgJson.module = __indexmjs__;
            if (__indexjs__ in obj || __indexmjs__ in obj)
                pkgJson.main = 'index';
            if (pkgbeauty)
                pkgJson = sortPackageJson(pkgJson);
            const pkgJsonStrNew = jsonStringify(pkgJson, void 0, 2);
            // prettier-ignore
            pkgJsonStrOld.trim() === pkgJsonStrNew.trim() || trycatch(() => {
                writeFileSync(filepkgjson, pkgJsonStrNew);
            }, () => {
                messageError(`Unable to create a "${__packagejson__}":`, filepkgjson);
            });
            const obj2 = {};
            paths.forEach((v) => {
                const pathsArr = v.split(posixSep);
                const newPath = pathsArr.shift();
                if (newPath && pathsArr[0] && !(newPath in obj2) && newPath in obj) {
                    obj2[newPath] = 1;
                    const newPaths = paths
                        .filter((v) => v.startsWith(newPath + posixSep))
                        .map((v) => v.split(posixSep).slice(1).join(posixSep));
                    each(join(filepath, newPath), newPaths);
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
const createRollup = (input, output, pkg, tsc, babel, types, force, minify, pkgbeauty, watch$1, silent) => {
    const inputPosix = toPosix(input);
    const { include } = getInputFiles(input);
    const includeObj = {};
    // const excludeObj: { [key: string]: TypeInputFile } = {}
    // exclude.forEach((v) => {
    //   excludeObj[v.final] = v
    // })
    // console.log(jsonStringify(excludeObj, undefined, 2))
    // prettier-ignore
    const packageJsonStrOld = pkg
        ? trycatch(() => readFileSync(pkg).toString(), () => messageError('The file cannot be read:', pkg))
        : '{}';
    let packageJson = jsonParse(packageJsonStrOld);
    if (pkg && pkgbeauty) {
        packageJson = sortPackageJson(packageJson);
        const packageJsonStrNew = jsonStringify(packageJson, void 0, 2);
        packageJsonStrOld.trim() === packageJsonStrNew.trim() ||
            writeFileSync(pkg, packageJsonStrNew);
    }
    const externalDefault = keys(process.binding('natives'));
    const external = concat(externalDefault, keys(packageJson.dependencies || {}), keys(packageJson.peerDependencies || {}));
    const devDependencies = keys(packageJson.devDependencies || {});
    const depsInspect = {};
    const dikey = '/\\/\\';
    // prettier-ignore
    tsc && trycatch(() => {
        !!require.resolve('.bin/tsc');
    }, () => {
        messageError('"typescript" not found.', 'Use argument "--no-tsc" or install "typescript" (npm i typescript)');
    });
    // prettier-ignore
    const rollupPluginSucrase = __rollupPluginSucrase__({ transforms: ['typescript'] });
    // prettier-ignore
    const rollupPluginTSC = !tsc
        ? rollupPluginSucrase
        : __rollupPluginTypescript2__({
            check: !force,
            // verbosity: 2,
            tsconfig: tsc,
            tsconfigOverride: {
                // buildOptions: { verbose: true },
                compilerOptions: { declaration: false }, include: [toPosix(input)]
            }
        });
    // prettier-ignore
    babel && trycatch(() => {
        require.resolve('@babel/core');
    }, () => {
        messageError('"@babel/core" not found.', 'Use argument "--no-babel" or install "@babel/core" (npm i @babel/core)');
    });
    const rollupPluginBabel = babel
        ? getBabelOutputPlugin({ configFile: babel })
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
            input: toPosix(resolve(input, inputFile.origin)),
            // prettier-ignore
            output: [
                {
                    file: toPosix(resolve(output, inputFile.final + '.mjs')),
                    format: 'esm',
                    ...outputProps
                },
                {
                    file: toPosix(resolve(output, inputFile.final + '.js')),
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
                        if (file && toPosix(file).startsWith(inputPosix)) {
                            if (!(file in depsInspect) || depsInspect[file][dikey]) {
                                depsInspect[file] = { deps: {} };
                            }
                            if (!/^[./\\]/.test(source)) {
                                let dep = '';
                                let isDevDep = false;
                                // prettier-ignore
                                if (!external.some((path) => source.startsWith(dep = path)) &&
                                    !(isDevDep = devDependencies.some((path) => source.startsWith(path)))) {
                                    (force || watch$1 ? messageWarn : messageError)('Dependency "' + source + '" - not found. File:', file);
                                }
                                if (dep)
                                    depsInspect[file].deps[dep] = 1;
                                if (!isDevDep)
                                    return { id: source, external: true };
                            }
                            else {
                                let ns = resolve(dirname(file), source);
                                const ext = extname(ns);
                                // console.log('\n', 12)
                                // console.log(file)
                                // console.log(source)
                                // console.log(isAllowedFile(ns, input))
                                // console.log(isAllowedFile(file, input))
                                if (ns.startsWith(input) &&
                                    // isAllowedFile(ns, input) &&
                                    isAllowedFile(file, input) &&
                                    (!ext || isJTSX(ext))) {
                                    if (ext)
                                        ns = ns.slice(0, -ext.length);
                                    if (!isIndex(ns))
                                        ns = join(ns, 'index');
                                    const nskey = relative(input, ns);
                                    if (nskey in includeObj) {
                                        ns = relative(file, dirname(ns));
                                        if (isIndex(file))
                                            ns = relative('..', ns);
                                        ns = toPosix(fixSource(ns));
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
                        return `/* filename: ${relative(input, _id)}\n  timestamp: ${new Date().toISOString()} */\n${_code}`;
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
                            keys(data).forEach((k) => {
                                exports.push(...data[k].exports || []);
                            });
                            exports = filterUnique(exports);
                            // prettier-ignore
                            const source = jsonStringify(fixSource(toPosix(join(relative(dirname(join(output, inputFile.final)), join(types, inputFile.dir)), dirname(relative(inputFile.dir, inputFile.final))))));
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
                            const writePath = join(dirname(join(output, inputFile.final)), __indexdts__);
                            writeFileSync(writePath, text);
                        }
                    }
                },
                ...minify ? [rollupPluginTerser] : [],
                {
                    renderChunk(code, data) {
                        return `/* eslint-disable */\n/*\ndester builds:\n${keys(data.modules)
                            .map((v) => relative(input, v) + '\n')
                            .join('')}*/\n${code}`;
                    }
                }
            ]
        });
    });
    const watcher = watch(rolls);
    processExit(() => {
        watcher && watcher.close();
    });
    const includeObjKeys = keys(includeObj);
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
            inp = relative(input, event.input);
        if (event.code === 'START') {
            isError = false;
            // silent || logInfo(event.code)
        }
        // if (event.code === 'BUNDLE_START') {
        //   isError || silent || logInfo(event.code + ': ' + inp)
        // }
        if (event.code === 'BUNDLE_END') {
            const resFile = relative(output, event.output[1].slice(0, -3));
            // prettier-ignore
            isError || silent || log(green('BUILD: ') +
                green(`[${(includeObjKeys.indexOf(resFile) + 1 + '').padStart(iokls, '0')}/${includeObjKeysLen}]`) +
                ' - ' + inp + ' -> ' + resFile);
        }
        if (event.code === 'ERROR') {
            const res = event.result || {};
            isError = true;
            messageCompileError(white((res.watchFiles || []).join('\n')), event.error);
            // console.log(event.result)
        }
        if (event.code === 'END') {
            if (!isError && isNeedCreatePackages) {
                isNeedCreatePackages = false;
                const pathsList = keys(includeObj).map((v) => toPosix(v));
                if (types)
                    pathsList.push(toPosix(relative(output, types)));
                createPackages(output, pathsList, pkgbeauty);
            }
            if (!isError && pkg) {
                const deps = { ...packageJson.dependencies || {} };
                const depsPeer = { ...packageJson.peerDependencies || {} };
                keys(depsInspect).forEach((k) => {
                    depsInspect[k][dikey] = true;
                    keys(depsInspect[k].deps).forEach((dep) => {
                        delete depsPeer[dep];
                        delete deps[dep];
                    });
                });
                const depsArr = keys(deps);
                const depsPArr = keys(depsPeer);
                if (depsPArr[0]) {
                    silent || messageWarn('Unused peerDependencies:\n', ...depsPArr);
                }
                if (depsArr[0])
                    messageWarn('Unused dependencies:\n', ...depsArr);
            }
            isError || silent || log(green('BUILD: WAIT...'));
            if (!watch$1)
                watcher.close();
        }
    });
    return watcher;
};

export { createRollup as default };
