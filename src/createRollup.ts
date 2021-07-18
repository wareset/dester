import { green } from 'kleur'

import { watch as rollupWatch } from 'rollup'

// import __rollupPluginAlias__ from '@rollup/plugin-alias'
// const rollupPluginAlias = __rollupPluginAlias__({
//   entries: [
//     // { find: /^\.$/, replacement: '../' },
//     { find: /^\.\//, replacement: '../' },
//     { find: /^\.\.\//, replacement: '../../' }
//   ]
// })

// import __rollupPluginNodeResolve__ from '@rollup/plugin-node-resolve'
// const rollupPluginNodeResolve = __rollupPluginNodeResolve__({
//   extensions: ['.ts', '.js', '.tsx', 'jsx'],
//   modulesOnly: true
// })
// import __rollupPluginCommonjs__ from '@rollup/plugin-commonjs'
// const rollupPluginCommonjs = __rollupPluginCommonjs__({
//   extensions: ['.ts', '.js', '.tsx', 'jsx'],
//   // transformMixedEsModules: true,
//   esmExternals: (...a: any) => {
//     console.log(a)
//     return false
//   }
//   // requireReturnsDefault: 'namespace'
// })

import __rollupPluginJson__ from '@rollup/plugin-json'
const rollupPluginJson = __rollupPluginJson__()

// import rollupPluginSucrase from '@rollup/plugin-sucrase'
const __rollupPluginSucrase__ = require('@rollup/plugin-sucrase')
import __rollupPluginTypescript2__ from 'rollup-plugin-typescript2'

// import __rollupPluginBabel__ from '@rollup/plugin-babel'
import { getBabelOutputPlugin as __rollupPluginBabel__ } from '@rollup/plugin-babel'

import jsonStringify from '@wareset-utilites/lang/jsonStringify'
import jsonParse from '@wareset-utilites/lang/jsonParse'
import startsWith from '@wareset-utilites/string/startsWith'
// import endsWith from '@wareset-utilites/string/endsWith'
import concat from '@wareset-utilites/array/concat'
// import last from '@wareset-utilites/array/last'
import keys from '@wareset-utilites/object/keys'
import unique from '@wareset-utilites/unique'

import trycatch from '@wareset-utilites/trycatch'

import sortPackageJson from './sortPackageJson'

import {
  readFileSync as fsReadFileSync,
  writeFileSync as fsWriteFileSync,
  readdirSync as fsReaddirSync
} from 'fs'

import path, {
  // sep as pathSep,
  resolve as pathResolve,
  relative as pathRelative,
  extname as pathExtname,
  // parse as pathParse,
  join as pathJoin,
  dirname as pathDirname
} from 'path'
const posixSep = path.posix.sep

import {
  toPosix,
  existsStatSync,
  isJTSX,
  getInputFiles,
  TypeInputFile,
  processExit
} from './utils'
import {
  log,
  // logError,
  messageError,
  messageCompileError,
  messageWarn
} from './messages'

// const resolveExternals = (key: string, v?: string): string => {
//   let res = v !== undefined ? pathRelative(key, v) : key
//   if (!startsWith(res, pathSep) && !startsWith(res, '..'))
//     res = '.' + pathSep + res
//   if (last(res) === pathSep) res = res.slice(0, -1)
//   return res
// }

const fixSource = (file: string): string => {
  if (!/^\.+([/\\]|$)/.test(file)) file = pathJoin('..', file).slice(1)
  // if (file === '.' || file === '..') file += pathSep + 'index'
  return file
}

const isIndex = (file: string): boolean =>
  /(?:[\\/]|^)index(?:\.[^.]+$|$)/.test(file)

const __packagejson__ = 'package.json'
const __indexdts__ = 'index.d.ts'
const __indexmjs__ = 'index.mjs'
const __indexjs__ = 'index.js'
const createPackages = (
  output: string,
  paths: string[],
  pkgbeauty?: boolean
): void => {
  const each = (filepath: string, paths: string[]): void => {
    const stat = existsStatSync(filepath)
    if (stat && stat.isDirectory()) {
      const obj: any = {}
      // prettier-ignore
      fsReaddirSync(filepath).forEach((name) => { obj[name] = 1 })

      const filepkgjson = pathJoin(filepath, __packagejson__)

      const pkgJsonStrOld =
        __packagejson__ in obj ? fsReadFileSync(filepkgjson).toString() : '{}'
      let pkgJson = jsonParse(pkgJsonStrOld)

      if (pkgJson.files || !keys(pkgJson).length) {
        const files = [
          ...[__indexjs__, __indexmjs__, __indexdts__],
          ...(pkgJson.files || []),
          ...paths.map((v) => v.split(posixSep)[0])
        ].sort()
        pkgJson.files = unique(files, (v) => v in obj).sort()
      }

      if (__indexdts__ in obj) pkgJson.types = __indexdts__
      if (__indexmjs__ in obj) pkgJson.module = __indexmjs__
      if (__indexjs__ in obj || __indexmjs__ in obj) pkgJson.main = 'index'

      if (pkgbeauty) pkgJson = sortPackageJson(pkgJson)

      const pkgJsonStrNew = jsonStringify(pkgJson, undefined, 2)
      // prettier-ignore
      pkgJsonStrOld.trim() === pkgJsonStrNew.trim() || trycatch(
        () => { fsWriteFileSync(filepkgjson, pkgJsonStrNew) },
        () => { messageError(`Unable to create a "${__packagejson__}":`, filepkgjson) }
      )

      const obj2: any = {}
      paths.forEach((v) => {
        const pathsArr = v.split(posixSep)
        const newPath = pathsArr.shift()
        if (newPath && pathsArr[0] && !(newPath in obj2) && newPath in obj) {
          obj2[newPath] = 1
          const newPaths = paths
            .filter((v) => startsWith(v, newPath + posixSep))
            .map((v) => v.split(posixSep).slice(1).join(posixSep))
          each(pathJoin(filepath, newPath), newPaths)
        }
      })
    }
  }
  each(output, paths)
}

const outputProps = {
  exports: 'named',
  sourcemap: false
  // compact: true
}

const createRollup = (
  input: string,
  output: string,
  pkg: string,
  tsc: string,
  babel: string,
  types: string,
  force: boolean,
  pkgbeauty: boolean,
  watch: boolean,
  silent: boolean
): any => {
  const inputPosix = toPosix(input)
  const { include } = getInputFiles(input)
  const includeObj: { [key: string]: TypeInputFile } = {}

  // prettier-ignore
  const packageJsonStrOld: any = pkg
    ? trycatch(
      () => fsReadFileSync(pkg).toString(),
      () => messageError('The file cannot be read:', pkg))
    : '{}'
  let packageJson = jsonParse(packageJsonStrOld)
  if (pkg && pkgbeauty) {
    packageJson = sortPackageJson(packageJson)
    const packageJsonStrNew = jsonStringify(packageJson, undefined, 2)
    packageJsonStrOld.trim() === packageJsonStrNew.trim() ||
      fsWriteFileSync(pkg, packageJsonStrNew)
  }

  const externalDefault = keys((process as any).binding('natives'))
  const external = concat(
    externalDefault,
    keys(packageJson.dependencies || {}),
    keys(packageJson.peerDependencies || {})
  )
  const devDependencies = keys(packageJson.devDependencies || {})

  const depsInspect: any = {}
  const dikey = '/\\/\\'

  // prettier-ignore
  tsc && trycatch(
    () => { !!require.resolve('.bin/tsc') },
    () => { messageError('"typescript" not found.',
      'Use argument "--no-tsc" or install "typescript" (npm i typescript)')})
  // prettier-ignore
  const rollupPluginSucrase =
    __rollupPluginSucrase__({ transforms: [/* 'jsx',*/ 'typescript'] })
  // prettier-ignore
  const rollupPluginTSC = !tsc
    ? rollupPluginSucrase
    : __rollupPluginTypescript2__({
      check: !force,
      // verbosity: 2,
      tsconfig: tsc, tsconfigOverride: {
        // buildOptions: { verbose: true },
        compilerOptions: { declaration: false }, include: [toPosix(input)] } })

  // prettier-ignore
  babel && trycatch(
    () => { require.resolve('@babel/core') },
    () => { messageError('"@babel/core" not found.',
      'Use argument "--no-babel" or install "@babel/core" (npm i @babel/core)') }
  )
  const rollupPluginBabel: any = babel
    ? (__rollupPluginBabel__ as any)({ configFile: babel })
    : null

  const rolls: any[] = []
  include.forEach((inputFile) => {
    includeObj[inputFile.final] = inputFile
    const isNeedTSC = /^\.tsx?$/.test(inputFile.ext)

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
      input: toPosix(pathResolve(input, inputFile.origin)),
      // prettier-ignore
      output: [
        { file: toPosix(pathResolve(output, inputFile.final + '.mjs')),
          format: 'esm', ...outputProps },
        { file: toPosix(pathResolve(output, inputFile.final + '.js')),
          format: 'cjs', ...outputProps }
      ],
      plugins: [
        // ...(inputFile.name !== 'index' ? [rollupPluginAlias] : []),
        rollupPluginJson,
        {
          resolveId(source: any, file: any): any {
            if (file && startsWith(toPosix(file), inputPosix)) {
              if (!(file in depsInspect) || depsInspect[file][dikey])
                depsInspect[file] = { deps: {} }

              if (!/^[./\\]/.test(source)) {
                let dep = ''
                let isDevDep = false
                // prettier-ignore
                if (!external.some((path) => startsWith(source, (dep = path)))
                  && !(isDevDep = devDependencies.some((path) => startsWith(source, path))))
                  (force || watch ? messageWarn : messageError)(
                    'Dependency "' + source + '" - not found. File:', file)

                if (dep) depsInspect[file].deps[dep] = 1
                if (!isDevDep) return { id: source, external: true }
              } else {
                let ns = pathResolve(pathDirname(file), source)
                const ext = pathExtname(ns)
                if (startsWith(ns, input) && (!ext || isJTSX(ext))) {
                  if (ext) ns = ns.slice(0, -ext.length)
                  if (!isIndex(ns)) ns = pathJoin(ns, 'index')
                  const nskey = pathRelative(input, ns)
                  if (nskey in includeObj) {
                    ns = pathRelative(file, pathDirname(ns))
                    if (isIndex(file)) ns = pathRelative('..', ns)
                    ns = toPosix(fixSource(ns))
                    return { id: ns, external: true }
                  }
                }
                // return { id: source, external: true }
              }
            }
          }
        },
        // prettier-ignore
        ...(isNeedTSC ? [rollupPluginTSC] : [/* rollupPluginSucrase */]),
        ...(babel ? [rollupPluginBabel] : []),
        {
          writeBundle({ format }: any, data: any): any {
            if (format === 'cjs' && types) {
              let exports: string[] = []
              // prettier-ignore
              keys(data).forEach((k) => { exports.push(...(data[k].exports || [])) })
              exports = unique(exports)

              // prettier-ignore
              const source = jsonStringify(fixSource(toPosix(pathJoin(
                pathRelative(
                  pathDirname(pathJoin(output, inputFile.final)),
                  pathJoin(types, inputFile.dir)),
                pathDirname(pathRelative(inputFile.dir, inputFile.final))))))

              let text = `export * from ${source};\n`
              exports.forEach((v) => {
                if (v === 'default') {
                  text += `import __default__ from ${source};\n`
                  text += 'export { __default__ as default };\n'
                } else if (v[0] !== '*') {
                  text += `export { ${v} } from ${source};\n`
                }
              })

              const writePath = pathJoin(
                pathDirname(pathJoin(output, inputFile.final)),
                __indexdts__
              )

              fsWriteFileSync(writePath, text)
            }
          }
        }
      ]
    })
  })

  const watcher = rollupWatch(rolls)
  processExit(() => {
    watcher && watcher.close()
  })

  let isError = false
  let isNeedCreatePackages = true
  watcher.on('event', (event) => {
    // verbose(event)
    // event.code can be one of:
    //   START        — the watcher is (re)starting
    //   BUNDLE_START — building an individual bundle
    //   BUNDLE_END   — finished building a bundle
    //   END          — finished building all bundles
    //   ERROR        — encountered an error while bundling

    let inp = ''
    if ((event as any).input) inp = pathRelative(input, (event as any).input)

    if (event.code === 'START') {
      isError = false
      // silent || logInfo(event.code)
    }

    // if (event.code === 'BUNDLE_START') {
    //   isError || silent || logInfo(event.code + ': ' + inp)
    // }

    if (event.code === 'BUNDLE_END') {
      // prettier-ignore
      isError || silent || log(green('BUILD: ') + inp + ' -> '
          + pathRelative(output, event.output[1].slice(0, -3)))
      // silent || logInfo(jsonStringify(event.output, undefined, 2))
    }

    if (event.code === 'ERROR') {
      isError = true
      messageCompileError(event.error)
    }

    if (event.code === 'END') {
      if (!isError && isNeedCreatePackages) {
        isNeedCreatePackages = false
        const pathsList = keys(includeObj).map((v) => toPosix(v))
        if (types) pathsList.push(toPosix(pathRelative(output, types)))
        createPackages(output, pathsList, pkgbeauty)
      }

      if (!isError && pkg) {
        const deps = { ...(packageJson.dependencies || {}) }
        const depsPeer = { ...(packageJson.peerDependencies || {}) }
        keys(depsInspect).forEach((k) => {
          depsInspect[k][dikey] = true
          keys(depsInspect[k].deps).forEach((dep) => {
            delete depsPeer[dep]
            delete deps[dep]
          })
        })

        const depsArr = keys(deps)
        const depsPArr = keys(depsPeer)
        if (depsPArr[0])
          silent || messageWarn('Unused peerDependencies:\n', ...depsPArr)
        if (depsArr[0]) messageWarn('Unused dependencies:\n', ...depsArr)
      }

      isError || silent || log(green('BUILD: COMPLETE'))
      if (!watch) watcher.close()
    }
  })

  return watcher
}

export default createRollup
