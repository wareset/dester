import { green } from 'kleur';
import { watch } from 'rollup';
import __rollupPluginJson__ from '@rollup/plugin-json';
import __rollupPluginTypescript2__ from 'rollup-plugin-typescript2';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import jsonStringify from '@wareset-utilites/lang/jsonStringify';
import jsonParse from '@wareset-utilites/lang/jsonParse';
import startsWith from '@wareset-utilites/string/startsWith';
import concat from '@wareset-utilites/array/concat';
import keys from '@wareset-utilites/object/keys';
import unique from '@wareset-utilites/unique';
import trycatch from '@wareset-utilites/trycatch';
import sortPackageJson from '../sortPackageJson';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import path, { resolve, dirname, extname, join, relative } from 'path';
import { toPosix, getInputFiles, isJTSX, processExit, existsStatSync } from '../utils';
import { messageError, messageWarn, log, messageCompileError } from '../messages';

const rollupPluginJson = __rollupPluginJson__();
// import rollupPluginSucrase from '@rollup/plugin-sucrase'
const __rollupPluginSucrase__ = require('@rollup/plugin-sucrase');
const posixSep = path.posix.sep;
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
            readdirSync(filepath).forEach((name) => { obj[name] = 1; });
            const filepkgjson = join(filepath, __packagejson__);
            const pkgJsonStrOld = __packagejson__ in obj ? readFileSync(filepkgjson).toString() : '{}';
            let pkgJson = jsonParse(pkgJsonStrOld);
            if (pkgJson.files || !keys(pkgJson).length) {
                const files = [
                    ...[__indexjs__, __indexmjs__, __indexdts__],
                    ...(pkgJson.files || []),
                    ...paths.map((v) => v.split(posixSep)[0])
                ].sort();
                pkgJson.files = unique(files, (v) => v in obj).sort();
            }
            if (__indexdts__ in obj)
                pkgJson.types = __indexdts__;
            if (__indexmjs__ in obj)
                pkgJson.module = __indexmjs__;
            if (__indexjs__ in obj || __indexmjs__ in obj)
                pkgJson.main = 'index';
            if (pkgbeauty)
                pkgJson = sortPackageJson(pkgJson);
            const pkgJsonStrNew = jsonStringify(pkgJson, undefined, 2);
            // prettier-ignore
            pkgJsonStrOld.trim() === pkgJsonStrNew.trim() || trycatch(() => { writeFileSync(filepkgjson, pkgJsonStrNew); }, () => { messageError(`Unable to create a "${__packagejson__}":`, filepkgjson); });
            const obj2 = {};
            paths.forEach((v) => {
                const pathsArr = v.split(posixSep);
                const newPath = pathsArr.shift();
                if (newPath && pathsArr[0] && !(newPath in obj2) && newPath in obj) {
                    obj2[newPath] = 1;
                    const newPaths = paths
                        .filter((v) => startsWith(v, newPath + posixSep))
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
const createRollup = (input, output, pkg, tsc, babel, types, force, pkgbeauty, watch$1, silent) => {
    const inputPosix = toPosix(input);
    const { include } = getInputFiles(input);
    const includeObj = {};
    // prettier-ignore
    const packageJsonStrOld = pkg
        ? trycatch(() => readFileSync(pkg).toString(), () => messageError('The file cannot be read:', pkg))
        : '{}';
    let packageJson = jsonParse(packageJsonStrOld);
    if (pkg && pkgbeauty) {
        packageJson = sortPackageJson(packageJson);
        const packageJsonStrNew = jsonStringify(packageJson, undefined, 2);
        packageJsonStrOld.trim() === packageJsonStrNew.trim() ||
            writeFileSync(pkg, packageJsonStrNew);
    }
    const externalDefault = keys(process.binding('natives'));
    const external = concat(externalDefault, keys(packageJson.dependencies || {}), keys(packageJson.peerDependencies || {}));
    const devDependencies = keys(packageJson.devDependencies || {});
    const depsInspect = {};
    const dikey = '/\\/\\';
    // prettier-ignore
    tsc && trycatch(() => { !!require.resolve('.bin/tsc'); }, () => {
        messageError('"typescript" not found.', 'Use argument "--no-tsc" or install "typescript" (npm i typescript)');
    });
    // prettier-ignore
    const rollupPluginSucrase = __rollupPluginSucrase__({ transforms: [/* 'jsx',*/ 'typescript'] });
    // prettier-ignore
    const rollupPluginTSC = !tsc
        ? rollupPluginSucrase
        : __rollupPluginTypescript2__({
            check: !force,
            // verbosity: 2,
            tsconfig: tsc, tsconfigOverride: {
                // buildOptions: { verbose: true },
                compilerOptions: { declaration: false }, include: [toPosix(input)]
            }
        });
    // prettier-ignore
    babel && trycatch(() => { require.resolve('@babel/core'); }, () => {
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
                { file: toPosix(resolve(output, inputFile.final + '.mjs')),
                    format: 'esm', ...outputProps },
                { file: toPosix(resolve(output, inputFile.final + '.js')),
                    format: 'cjs', ...outputProps }
            ],
            plugins: [
                // ...(inputFile.name !== 'index' ? [rollupPluginAlias] : []),
                rollupPluginJson,
                {
                    resolveId(source, file) {
                        if (file && startsWith(toPosix(file), inputPosix)) {
                            if (!(file in depsInspect) || depsInspect[file][dikey])
                                depsInspect[file] = { deps: {} };
                            if (!/^[./\\]/.test(source)) {
                                let dep = '';
                                let isDevDep = false;
                                // prettier-ignore
                                if (!external.some((path) => startsWith(source, (dep = path)))
                                    && !(isDevDep = devDependencies.some((path) => startsWith(source, path))))
                                    (force || watch$1 ? messageWarn : messageError)('Dependency "' + source + '" - not found. File:', file);
                                if (dep)
                                    depsInspect[file].deps[dep] = 1;
                                if (!isDevDep)
                                    return { id: source, external: true };
                            }
                            else {
                                let ns = resolve(dirname(file), source);
                                const ext = extname(ns);
                                if (startsWith(ns, input) && (!ext || isJTSX(ext))) {
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
                },
                // prettier-ignore
                ...(isNeedTSC ? [rollupPluginTSC] : [ /* rollupPluginSucrase */]),
                ...(babel ? [rollupPluginBabel] : []),
                {
                    writeBundle({ format }, data) {
                        if (format === 'cjs' && types) {
                            let exports = [];
                            // prettier-ignore
                            keys(data).forEach((k) => { exports.push(...(data[k].exports || [])); });
                            exports = unique(exports);
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
                }
            ]
        });
    });
    const watcher = watch(rolls);
    processExit(() => {
        watcher && watcher.close();
    });
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
            // prettier-ignore
            isError || silent || log(green('BUILD: ') + inp + ' -> '
                + relative(output, event.output[1].slice(0, -3)));
            // silent || logInfo(jsonStringify(event.output, undefined, 2))
        }
        if (event.code === 'ERROR') {
            isError = true;
            messageCompileError(event.error);
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
                const deps = { ...(packageJson.dependencies || {}) };
                const depsPeer = { ...(packageJson.peerDependencies || {}) };
                keys(depsInspect).forEach((k) => {
                    depsInspect[k][dikey] = true;
                    keys(depsInspect[k].deps).forEach((dep) => {
                        delete depsPeer[dep];
                        delete deps[dep];
                    });
                });
                const depsArr = keys(deps);
                const depsPArr = keys(depsPeer);
                if (depsPArr[0])
                    silent || messageWarn('Unused peerDependencies:\n', ...depsPArr);
                if (depsArr[0])
                    messageWarn('Unused dependencies:\n', ...depsArr);
            }
            isError || silent || log(green('BUILD: COMPLETE'));
            if (!watch$1)
                watcher.close();
        }
    });
    return watcher;
};

export default createRollup;
