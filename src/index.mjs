/* eslint-disable consistent-return */
/* eslint-disable no-useless-return */
// setTimeout(function() {}, 1000 * 60 * 60 * 24)

import { LOGO } from './_logo.mjs'
import { sort_pkg_json } from './_sort_pkg_json.mjs'

import {
  join as path_join,
  parse as path_parse,
  dirname as path_dirname,
  resolve as path_resolve,
  relative as path_relative,
} from 'path'

import {
  lstatSync as fs_lstatSync,
  existsSync as fs_existsSync,
  readdirSync as fs_readdirSync,
  readFileSync as fs_readFileSync,
  writeFileSync as fs_writeFileSync,
} from 'fs'
// import os from 'os'
import { createRequire } from 'module'
import {
  spawn as child_process_spawn,
  spawnSync as child_process_spawnSync
} from 'child_process'

import kleur from 'kleur'

const REQUIRE = typeof require !== 'undefined'
  ? require
  : createRequire(import.meta.url)

function getTSC() {
  let tsc
  const title = kleur.bgBlue(kleur.black(kleur.bold('tsc: ')))

  try {
    tsc = REQUIRE.resolve('.bin/tsc')
    console.log(title + kleur.bgBlue(kleur.black(tsc)))
    // console.log(kleur.bgBlue(kleur.black(
    //   tscPATH = path_resolve(REQUIRE.main && REQUIRE.main.path || '', 'tsconfig/tsc.json')
    // )))

    child_process_spawnSync(tsc, ['-v'], {
      stdio: ['ignore', 'inherit', 'inherit'],
      shell: true
    })
  } catch {
    console.warn(title + kleur.bgRed(kleur.black('not found')))
  }
  return tsc
}

// function getTSconfigFileName() {
//   let dir
//   try {
//     dir = REQUIRE.resolve('dester')
//   } catch {
//     dir = os.tmpdir()
//   }
// }

import { watch as rollup_watch, VERSION as ROLLUP_VERSION } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

import { version as BABEL_VERSION } from '@babel/core'

import fake_inject from './_rollup-plugins/fake_inject.mjs'
import babel_custom from './_rollup-plugins/babel_custom.mjs'
import terser_custom from './_rollup-plugins/terser_custom.mjs'
import sucrase_custom from './_rollup-plugins/sucrase_custom.mjs'

import minimist from 'minimist'

function toPosix(s) {
  return s.replace(/[/\\]+/, '/')
}

function unique(list) {
  return list.filter((v, k, a) => v && a.indexOf(v) === k).sort()
}

function getInputValidFiles(dir) {
  const res = []

  const a = fs_readdirSync(dir, { withFileTypes: true })

  for (let dirent, file, i = a.length; i-- > 0;) {
    dirent = a[i]
    if (/^[^._]/.test(dirent.name) && !/\.tests?($|\.)/i.test(dirent.name)) {
      file = path_join(dir, dirent.name)
      if (dirent.isDirectory()) {
        res.push(...getInputValidFiles(file))
      } else if (/\.[mc]?[jt]s$/.test(dirent.name)) {
        res.push(file)
      }
    }
  }

  return res
}

function printError(text) {
  console.log(kleur.bgRed(kleur.black('ERROR: ' + text)))
  process.kill(0)
  throw text
}

const argv = minimist(process.argv.slice(2), {
  default: {
    help: false,

    dir: '',
    src: 'src',
    out: '',

    types: 'types',

    watch: false,

    min: false,

    ie: false,
    
    takeout: false,
  },
  number : ['ie'],
  string : ['dir', 'src', 'out', 'types'],
  boolean: ['help', 'watch', 'min', 'takeout'],
  alias  : {
    h: 'help',
    d: 'dir',
    t: 'types',
    w: 'watch',
    m: 'min'
  }
})

// console.log(argv)
;(function() {
  console.log(LOGO)
  if (argv.help) {
    // TODO help
    console.log('help')
  } else {
    if (argv.watch) console.clear()
    console.log('rollup: v' + ROLLUP_VERSION)
    console.log('babel:  v' + BABEL_VERSION)
    console.log('')
    /**
     * <GET_FOLDERS
     */
    argv.dir = path_resolve(argv.dir)
    argv.src = path_resolve(argv.dir, argv.src)
    argv.out = path_resolve(argv.dir, argv.out)
    
    console.log(kleur.bgGreen(kleur.black(kleur.bold('dir: ') + argv.dir)))
    console.log(kleur.bgGreen(kleur.black(kleur.bold('src: ') + argv.src)))
    console.log(kleur.bgGreen(kleur.black(kleur.bold('out: ') + argv.out)))
    console.log('')
  
    if (!argv.out.startsWith(argv.dir)) {
      return printError('dir OUT must be in dir DIR')
    }
    /**
     * /GET_FOLDERS
     */
  
    /**
     * <CHECK_PACKAGE_JSON
     */
    const pkgjson = path_resolve(argv.dir, 'package.json')
    if (!fs_existsSync(pkgjson)) {
      return printError('package.json not found in ' + argv.dir)
    }
    console.log(kleur.bgMagenta(kleur.black(kleur.bold('package.json: ') + pkgjson)))
    console.log('')

    let externals
    // eslint-disable-next-line no-inner-declarations
    function getExternals() {
      const json = JSON.parse(fs_readFileSync(pkgjson, 'utf8'))
        
      const dependencies = json.dependencies || {}
      const peerDependencies = json.peerDependencies || {}
  
      externals = unique([
        ...Object.keys(process.binding('natives')),
        ...Object.keys(dependencies),
        ...Object.keys(peerDependencies)
      ])
        .map((v) => new RegExp(`^${v}($|/|\\\\)`))
    }
    getExternals()
    /**
     * /CHECK_PACKAGE_JSON
     */
  
    /**
     * <TYPESCRIPT_CREATE_TYPES
     */
    let tsc
    if (argv.types) {
      if (typeof argv.types !== 'string') argv.types = 'types'
      argv.types = path_resolve(argv.dir, argv.types)

      console.log(kleur.bgGreen(kleur.black(kleur.bold('types: ') + argv.types)))
  
      if (!argv.types.startsWith(argv.dir)) {
        console.log(kleur.bgRed(kleur.black('ERROR:')))
        return printError('dir TYPES must be in dir DIR')
      }
  
      if (tsc = getTSC()) {
        const tsconfigPath = path_resolve(argv.dir, '.dester.tsconfig.json')

        let tsconfigCompilerOptions = {}
        if (fs_existsSync(tsconfigPath)) {
          try {
            tsconfigCompilerOptions =
              JSON.parse(fs_readFileSync(tsconfigPath)).compilerOptions || {}
          } catch {}
        }

        const tsconfig = {
          include: [toPosix(path_resolve(argv.src, '**/*'))],
          exclude: [
            toPosix(path_resolve(argv.src, '**/node_modules')),
            toPosix(path_resolve(argv.src, '**/_*')),
            toPosix(path_resolve(argv.src, '**/*.test.*')),
            toPosix(path_resolve(argv.src, '**/*.tests.*'))
          ],
          compilerOptions: {
            ...tsconfigCompilerOptions,
            target                      : 'esnext',
            module                      : 'esnext',
            moduleResolution            : 'node',
            allowJs                     : true,
            declaration                 : true,
            emitDeclarationOnly         : true,
            esModuleInterop             : true,
            resolveJsonModule           : true,
            emitDecoratorMetadata       : true,
            experimentalDecorators      : true,
            allowSyntheticDefaultImports: true,
            // forceConsistentCasingInFileNames: true,
            // rootDir                     : toPosix(argv.src),
            // baseUrl                     : toPosix(argv.src),
            outDir                      : toPosix(argv.types),
            // declarationDir              : toPosix(argv.types),
          }
        }

        fs_writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2))
      
        const tscProcess = child_process_spawn(
          tsc,
          [
            ...['--build', tsconfigPath],

            // '--force',

            ...argv.watch ? ['--watch'] : [],
              
            // ...['--target', 'esnext'],
            // ...['--module', 'esnext'],
            // ...['--moduleResolution', 'node'],
              
            // '--noEmit',
            // '--allowJs',
            // '--declaration',
            // '--emitDeclarationOnly',
  
            // '--esModuleInterop',
            // '--resolveJsonModule',
            // '--emitDecoratorMetadata',
            // '--experimentalDecorators',
            // '--allowSyntheticDefaultImports',
  
            // ...['--rootDir', argv.src],
            // ...['--baseUrl', argv.src],
            // ...['--outDir', argv.types],
            // ...['--declarationDir', argv.types],
          ],
          {
            cwd  : argv.src,
            // stdio: ['ignore', 'inherit', 'inherit'],
            shell: true
          }
        )
  
        tscProcess.stdout.on('data', function(data) {
          data = data.toString().trim()
          console.log('\n' + kleur.bgBlue(kleur.black('tsc: ')))
          console.dir(data)
        })
        tscProcess.stderr.on('data', function(data) {
          data = data.toString().trim()
          console.log('\n' + kleur.bgRed(kleur.black('tsc: ')))
          console.dir(data)
        })
  
        // eslint-disable-next-line func-style
        const tscExit = function() { tscProcess.kill(0) }
        process.on('SIGTERM', tscExit)
        process.on('exit', tscExit)
      }
    }
    console.log('')
    /**
     * /TYPESCRIPT_CREATE_TYPES
     */
  
    /**
     * <ROLLUP_WATCH
     */
    let chunks
    // eslint-disable-next-line no-inner-declarations
    function getChunks() {
      if (!chunks) {
        const res = getInputValidFiles(argv.src)
          .map(function(id) {
            const { dir, name } = path_parse(path_relative(argv.src, id))
            const fileName = path_join(dir, name === 'index' ? name : path_join(name, 'index'))
            return { id, fileName }
          })
      
        chunks = res.sort(function(a, b) {
          return a.fileName.localeCompare(b.fileName)
        })
      }
    }
  
    const generatedCode = {
      preset              : 'es5',
      arrowFunctions      : false,
      constBindings       : true,
      objectShorthand     : false,
      reservedNamesAsProps: true,
      symbols             : false
    }
  
    let _files = {}, _filesTmp
    const watcher = rollup_watch([
      '.mjs',
      '.js'
    ].map(function(extension, k) {
      /** @type {import('rollup').RollupOptions[]} */
      return {
        output: {
          exports       : 'named',
          format        : extension === '.js' ? 'commonjs' : 'esm',
          dir           : argv.out,
          chunkFileNames: '_includes/[name]' + extension, // -[hash]
          generatedCode,
        },
        external: function(id, importree) {
          if (id.startsWith('node:')) return true
          if (importree) {
            // not package
            if (/^\.?[/\\]|\\/.test(id)) return void 0
            else return externals.length ? externals.some((v) => v.test(id)) : false
          }
        },
        
        // preserveEntrySignatures: 'strict',

        // treeshake: {
        //   preset                  : 'smallest',
        //   moduleSideEffects       : false,
        //   propertyReadSideEffects : false,
        //   unknownGlobalSideEffects: false
        // },

        plugins: [
          (function() {
            return {
              name: 'chunks',
              buildStart() {
                chunks || getChunks()
                if (!k) {
                  this.addWatchFile(argv.src)
                  this.addWatchFile(pkgjson)
                }
                for (let i = chunks.length; i-- > 0;) {
                  // if (!k) console.log(chunks[i])
                  this.emitFile({
                    type    : 'chunk',
                    id      : chunks[i].id,
                    fileName: chunks[i].fileName + extension,
                    // preserveSignature: 'strict',
                    generatedCode
                  })
                }
              }
            }
          })(),
          sucrase_custom(),
          babel_custom(argv.ie), // ...argv.ie ? [babel_custom(argv.ie)] : [],
          ...argv.takeout ? fake_inject() : [],
          resolve({ extensions: ['.mjs', '.js', '.jsx', '.mts', '.ts', '.tsx', '.json'] }),
          commonjs(),
          terser_custom(argv.min),
          {
            renderChunk(code, id) {
              if (!k) {
                const { fileName, facadeModuleId, exports } = id
                // console.log(111, exports)
                _files[fileName] = { facadeModuleId, exports }

                try {
                  if (facadeModuleId) {
                    console.log(kleur.green('BUILD: ' + path_relative(argv.src, facadeModuleId) + ' => ' + path_relative(argv.dir, path_join(argv.out, fileName))))
                  }
                } catch (e) {
                  console.error(e)
                }
              }
  
              return '/* eslint-disable */\n' + code
            }
          }
        ],
      }
    }))
      .on('change', function(id, data) {
        if (id === pkgjson) getExternals()
          
        if (data.event !== 'update') {
          chunks = null
          console.log(data.event + ': ' + id)
        }
      })
      .on('event', function(data) {
        if (data.code === 'ERROR') {
          console.error(data)
        } else if (data.code === 'END') {
          if (!argv.watch) watcher.close()
          else console.log('\n...WATCH...\n')
          console.log('')

          const files = _files; _files = {}

          if (_filesTmp === (_filesTmp = JSON.stringify(files))) return

          const pkg = JSON.parse(fs_readFileSync(pkgjson, 'utf8'))
          delete pkg.main; delete pkg.module; delete pkg.types

          const filesOBJ = {}
          if (pkg.files) {
            for (let fileName of pkg.files) {
              fileName = path_relative(argv.dir, path_join(argv.dir, fileName))
              if (/^\.?[\\/]/.test(fileName)) printError(fileName)
              fileName = fileName.split(/[\\/]/)[0]
              filesOBJ[fileName] = true
            }
          }

          const exports = {}

          const _exp = {}
          let src, type, input, dirname, isMain
          for (const fileName in files) {
            // console.log('\n\n')
            type = null
            src = files[fileName].facadeModuleId

            input = path_relative(argv.dir, path_join(argv.out, fileName))
            filesOBJ[input.split(/[\\/]/)[0]] = true

            if (src) {
              dirname = './' + toPosix(path_dirname(input))
              if (isMain = input === 'index.mjs') {
                pkg.main = 'index', pkg.module = 'index.mjs'
                dirname = '.'
                filesOBJ['index.js'] = filesOBJ['index.mjs'] = true
              }
              input = toPosix(input)
              // console.log(kleur.green('BUILD: ' + path_relative(argv.src, src) + ' => ' + input))

              exports[dirname] = {
                import : './' + input,
                require: './' + input.slice(0, -3) + 'js'
              }

              _exp[dirname] = files[fileName].exports

              if (tsc) {
                type = path_relative(argv.dir, path_join(argv.types, path_relative(argv.src, src)))
                type = toPosix(type.replace(/\.([mc]?)[tj]s$/, '.d.$1ts'))
  
                if (!/\.d\.[mc]?ts$/.test(type)) printError('type: ' + type)
                // console.log(type)

                if (isMain) {
                  pkg.types = type // 'index.d.ts' // type
                  filesOBJ['index.d.ts'] = true
                }

                exports[dirname].types = './' + type
              }
            }
          }

          pkg.exports = { './package.json': './package.json' }
          for (let fl, a = Object.keys(exports).sort(), i = 0; i < a.length; i++) {
            fl = a[i]
            pkg.exports[fl] = exports[fl]
            if (tsc) {
              let t = toPosix(path_relative(
                path_resolve(argv.dir, path_dirname(exports[fl].import)),
                path_resolve(argv.dir, exports[fl].types)
              )).replace(/(\/index)?\.d\.\w+$/, '')
              if (t[0] !== '.') t = './' + t
              t = JSON.stringify(t)

              let str = `export * from ${t};\n`
              for (const pname of _exp[fl]) {
                if (pname === 'default') {
                  str +=
                  `import { ${pname} as __default__ } from ${t};\nexport { __default__ as default };\n`
                } else if (pname[0] !== '*') {
                  str += `export { ${pname} } from ${t};\n`
                }
              }

              // console.log(111, fl, exports[fl])
              fs_writeFileSync(path_resolve(argv.dir, fl, 'index.d.ts'), str)
            }
          }

          // console.log(pkg.exports)

          /**
            * <CREATE_PACKAGE_JSON_FILES
            */
          pkg.files = []
          let filePath
          let typesDir
          if (tsc) {
            filesOBJ[typesDir = path_relative(argv.dir, argv.types).split(/[\\/]/)[0]] = true
          }
          for (let fileName in filesOBJ) {
            if (tsc && fileName === 'index.d.ts') pkg.files.push(fileName)
            else if (tsc && typesDir && typesDir === fileName) pkg.files.push(fileName + '/**/*')
            else if (fs_existsSync(filePath = path_join(argv.dir, fileName))) {
              //! FIX FOR NPM
              if (fs_lstatSync(filePath).isDirectory()) fileName += '/**/*'
              pkg.files.push(fileName)
            }
          }
          pkg.files.sort()
          // console.log(pkg.files)
          /**
            * /CREATE_PACKAGE_JSON_FILES
            */

          const pkgSorted = sort_pkg_json(pkg)
          // console.log(pkgSorted)

          fs_writeFileSync(pkgjson, JSON.stringify(pkgSorted, null, 2))
        }
      })
      /**
       * /ROLLUP_WATCH
       */
  }
})()
