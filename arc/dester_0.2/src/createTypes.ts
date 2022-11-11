import { green } from 'kleur'

import {
  resolve as pathResolve,
  parse as pathRarse,
  join as pathJoin,
  dirname as pathDirname
} from 'path'
import {
  writeFileSync as fsWriteFileSync,
  readFileSync as fsReadFileSync
} from 'fs'
import {
  spawn as childProcessSpawn
  // execSync as childProcessExecSync
} from 'child_process'

import { hash, trycatch, jsonParse, jsonStringify, filterUnique } from './ws-utils'

import sortPackageJson from './sortPackageJson'

import {
  log,
  logError,
  messageInfo,
  // messageWarn,
  // messageSuccess,
  messageError
} from './messages'
import {
  toPosix,
  createDirSync,
  processExit,
  removeSync,
  existsStatSync
} from './utils'

const createCacheDir = (): string => {
  const res = pathResolve(
    require.main!.paths[0] || pathResolve(),
    '.cache',
    'dester'
  )
  createDirSync(res)
  return res
}

const createTypes = (
  types: string,
  input: string,
  output: string,
  pkgbeauty: boolean,
  watch: boolean,
  silent?: boolean
): boolean => {
  let tsc = ''

  if (types) {
    silent ||
      messageInfo('Creating types. Trying to start a "tsc". TypesDir:', types)

    trycatch(
      () => {
        tsc = require.resolve('.bin/tsc')
        // silent ||
        //   messageSuccess('Module "tsc" ("typescript") has been found:', tsc)
      },
      () => {
        messageError(
          'Unable to start creating types. "typescript" not found.',
          'Use argument "--no-types" or install "typescript" (npm i typescript)'
        )
      }
    )

    // createDirSync(types)

    const configfile = pathResolve(
      createCacheDir(),
      hash(input + output) + '.json'
    )

    processExit(() => {
      removeSync(configfile)
    })

    const config = {
      // Change this to match your project
      include: [toPosix(pathJoin(input, '/**/*'))],
      exclude: [
        // toPosix(pathJoin(input, '/**/(_*|tests?|*.tests?.*|tests?.*|*.tests?)'))
        toPosix(pathJoin(input, '/**/_*')),
        toPosix(pathJoin(input, '/**/test')),
        toPosix(pathJoin(input, '/**/tests')),
        toPosix(pathJoin(input, '/**/*.test.*')),
        toPosix(pathJoin(input, '/**/*.tests.*')),
        toPosix(pathJoin(input, '/**/*.test')),
        toPosix(pathJoin(input, '/**/*.tests')),
        toPosix(pathJoin(input, '/**/test.*')),
        toPosix(pathJoin(input, '/**/tests.*'))
      ],

      compilerOptions: {
        // Tells TypeScript to read JS files, as
        // normally they are ignored as source files
        allowJs            : true,
        // Generate d.ts files
        declaration        : true,
        // This compiler run should
        // only output d.ts files
        emitDeclarationOnly: true,
        // Types should go into this directory.
        // Removing this would place the .d.ts files
        // next to the .js files
        outDir             : toPosix(types),
        // declarationDir: DIR_TYPES,

        experimentalDecorators: true,
        emitDecoratorMetadata : true,

        resolveJsonModule           : true,
        allowSyntheticDefaultImports: true,
        esModuleInterop             : true,
        target                      : 'esnext',
        moduleResolution            : 'node',
        module                      : 'esnext'
      }
    }

    trycatch(
      () => fsWriteFileSync(configfile, jsonStringify(config, void 0, 2)),
      (e) => messageError(e)
    )

    trycatch(
      () => {
        let childProcess = childProcessSpawn(
          tsc,
          ['--build', configfile, ...watch ? ['--watch'] : []],
          { shell: true }
          // { stdio: ['ignore', 'inherit', 'inherit'], shell: true })
        )

        const exit = (): void => {
          childProcess && childProcess.kill(0), childProcess = null as any
        }
        processExit(exit)

        childProcess.stdout.on('data', (data) => {
          // eslint-disable-next-line no-control-regex
          data = (data + '').replace(/[\u001bc]/g, '').trim()
          if (data) {
            const isErr = /error([^s]|$)/i.test(data)
            const mes = isErr ? logError : log
            if (!silent || isErr) {
              mes((isErr ? 'ERROR: ' : green('TYPES: ')) + data)
            }
          }
        })
        childProcess.stderr.on('data', (data) => {
          exit(), messageError('' + data)
        })
      },
      () => {
        messageError('"Types" child_process not work')
      }
    )

    const parentDir = pathDirname(types)
    const pkgjsonfile = pathResolve(parentDir, 'package.json')
    if (existsStatSync(pkgjsonfile)) {
      const typesFoldername = pathRarse(types).name
      const pkgJsonStrOld = fsReadFileSync(pkgjsonfile, 'utf8').toString()

      let pkgJson = jsonParse(pkgJsonStrOld)
      if (pkgJson.files) {
        pkgJson.files = filterUnique([...pkgJson.files, typesFoldername]).sort()
      }
      if (pkgbeauty) pkgJson = sortPackageJson(pkgJson)

      const pkgJsonStrNew = jsonStringify(pkgJson, void 0, 2)
      pkgJsonStrOld.trim() === pkgJsonStrNew.trim() ||
        fsWriteFileSync(pkgjsonfile, pkgJsonStrNew)
    }
  }

  return !!tsc
}

export default createTypes
