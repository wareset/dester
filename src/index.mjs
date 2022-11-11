/* eslint-disable consistent-return */
/* eslint-disable no-useless-return */
// setTimeout(function() {}, 1000 * 60 * 60 * 24)

console.clear()

import { LOGO } from './_logo.mjs'
import { getTSC } from './_tsc.mjs'
import { sort_pkg_json } from './_sort_pkg_json.mjs'

import {
  join as path_join,
  parse as path_parse,
  dirname as path_dirname,
  resolve as path_resolve,
  relative as path_relative
} from 'path'

import {
  lstatSync as fs_lstatSync,
  existsSync as fs_existsSync,
  readdirSync as fs_readdirSync,
  readFileSync as fs_readFileSync,
  writeFileSync as fs_writeFileSync
} from 'fs'
import { spawn as child_process_spawn } from 'child_process'

import kleur from 'kleur'

import { watch as rollup_watch, VERSION as ROLLUP_VERSION } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

import { version as BABEL_VERSION } from '@babel/core'

import babel_custom from './_rollup-plugins/babel_custom.mjs'
import terser_custom from './_rollup-plugins/terser_custom.mjs'
import sucrase_custom from './_rollup-plugins/sucrase_custom.mjs'

import minimist from 'minimist'

function toPosix(s) {
  return s.replace(/\\+/, '/')
}

function unique(list) {
  return list.filter((v, k, a) => v && a.indexOf(v) === k).sort()
}

function fixClearScreen(s) {
  // eslint-disable-next-line no-control-regex
  return s.replace(/[\u001bc]/g, '').trim()
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

function ERROR(text) {
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

    minify: false,

    ie: false,
  },
  number : ['ie'],
  string : ['dir', 'src', 'out', 'types'],
  boolean: ['help', 'watch', 'minify'],
  alias  : {
    h: 'help',
    d: 'dir',
    t: 'types',
    w: 'watch',
    m: 'minify'
  }
})

// console.log(argv)
;(function() {
  console.log(LOGO)
  if (argv.help) {
    // TODO help
    console.log('help')
  } else {
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
      return ERROR('dir OUT must be in dir DIR')
    }
    /**
     * /GET_FOLDERS
     */
  
    /**
     * <CHECK_PACKAGE_JSON
     */
    const pkgjson = path_resolve(argv.dir, 'package.json')
    if (!fs_existsSync(pkgjson)) {
      return ERROR('package.json not found in ' + argv.dir)
    }
    console.log(kleur.bgMagenta(kleur.black(kleur.bold('package.json: ') + pkgjson)))
    console.log('')

    let externals
    // eslint-disable-next-line no-inner-declarations
    function getExternals() {
      const json = JSON.parse(fs_readFileSync(pkgjson, 'utf8'))
        
      const dependencies = json.dependencies || {}
      const peerDependencies = json.peerDependencies || {}
  
      externals = unique([...Object.keys(dependencies), ...Object.keys(peerDependencies)])
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
        return ERROR('dir TYPES must be in dir DIR')
      }
  
      if (tsc = getTSC()) {
        // const exclude = JSON.stringify(['**/{.|_}*', '**/*.{test|tests}.*'])
  
        const tscProcess = child_process_spawn(
          tsc,
          [
            ...argv.watch ? ['--watch'] : [],
  
            // ...['--excludeDirectories', exclude],
            // ...['--excludeFiles', exclude],
              
            ...['--target', 'esnext'],
            ...['--moduleResolution', 'node'],
            ...['--module', 'esnext'],
              
            '--allowJs',
            '--declaration',
            '--emitDeclarationOnly',
  
            '--esModuleInterop',
            '--resolveJsonModule',
            '--emitDecoratorMetadata',
            '--experimentalDecorators',
            '--allowSyntheticDefaultImports',
  
            ...['--rootDir', argv.src],
            ...['--baseUrl', argv.src],
            ...['--declarationDir', argv.types],
          ],
          {
            // stdio: ['ignore', 'inherit', 'inherit'],
            shell: true
          }
        )
  
        tscProcess.stdout.on('data', function(data) {
          data = fixClearScreen(data.toString())
          if (data) console.log('\n' + kleur.bgBlue(kleur.black('tsc: ')), data)
        })
        tscProcess.stderr.on('data', function(data) {
          data = fixClearScreen(data.toString())
          if (data) console.log('\n' + kleur.bgRed(kleur.black('tsc: ')), data)
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
          chunkFileNames: '_includes/[name]-[hash]' + extension,
          generatedCode,
        },
        external: function(id, importree) {
          if (importree) {
            // not package
            if (/^\.?[/\\]|\\/.test(id)) return void 0
            else return externals.some((v) => v.test(id))
          }
        },
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
                  this.emitFile({
                    type             : 'chunk',
                    id               : chunks[i].id,
                    fileName         : chunks[i].fileName + extension,
                    preserveSignature: 'strict',
                    generatedCode
                  })
                }
              }
            }
          })(),
          sucrase_custom(),
          argv.ie && babel_custom(argv.ie),
          resolve({ extensions: ['.mjs', '.js', '.jsx', '.mts', '.ts', '.tsx', '.json'] }),
          commonjs(),
          terser_custom(argv.minify),
          {
            renderChunk(code, id) {
              if (!k) {
                const { fileName, facadeModuleId } = id
                // console.log(111, id)
                _files[fileName] = facadeModuleId
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
        if (data.code === 'END') {
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
              if (/^\.?[\\/]/.test(fileName)) ERROR(fileName)
              fileName = fileName.split(/[\\/]/)[0]
              filesOBJ[fileName] = true
            }
          }

          const exports = {}

          let src, type, input, dirname, isMain
          for (const fileName in files) {
            // console.log('\n\n')
            type = null
            src = files[fileName]

            input = path_relative(argv.dir, path_join(argv.out, fileName))
            filesOBJ[input.split(/[\\/]/)[0]] = true

            if (src) {
              dirname = './' + toPosix(path_dirname(input))
              if (isMain = input === 'index.mjs') {
                pkg.main = 'index', pkg.module = 'index.mjs'
                dirname = '.'
              }
              input = toPosix(input)
              console.log(kleur.green('BUILD: ' + path_relative(argv.src, src) + ' => ' + input))

              exports[dirname] = {
                import : './' + input,
                require: './' + input.slice(0, -3) + 'js'
              }

              // console.log(dirname)
              // console.log({ fileName, src })

              if (tsc) {
                type = path_relative(argv.dir, path_join(argv.types, path_relative(argv.src, src)))
                type = toPosix(type.replace(/\.([mc]?)[tj]s$/, '.d.$1ts'))
  
                if (!/\.d\.[mc]?ts$/.test(type)) ERROR('type: ' + type)
                // console.log(type)

                if (isMain) pkg.types = type

                exports[dirname].types = './' + type
              }
            }
          }

          pkg.exports = { './package.json': './package.json' }
          for (let a = Object.keys(exports).sort(), i = 0; i < a.length; i++) {
            pkg.exports[a[i]] = exports[a[i]]
          }

          // console.log(pkg.exports)

          /**
            * <CREATE_PACKAGE_JSON_FILES
            */
          pkg.files = []
          let filePath
          if (tsc) filesOBJ[path_relative(argv.dir, argv.types).split(/[\\/]/)[0]] = true
          for (let fileName in filesOBJ) {
            if (fs_existsSync(filePath = path_join(argv.dir, fileName))) {
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

// function compile({
//   rootDir = '',
//   inputDir = 'src',
//   outputDir = 'dist',
//   typesDir = 'types',
//   packageJson = 'package.json',
//   watch = true
// } = {}) {
//   rootDir = path_resolve(rootDir)
//   inputDir = path_resolve(rootDir, inputDir)
//   outputDir = path_resolve(rootDir, outputDir)
//   typesDir = path_resolve(rootDir, typesDir)
//   packageJson = path_resolve(rootDir, packageJson)

//   let chunks
//   let packageMainTmp
  
//   watcher
//     .on('change', function(id, data) {
//       if (id === packageJson) {
//         externals = getExternals(packageJson)
//       }
//       if (data.event !== 'update') {
//         chunks = null
//         console.log(data.event + ': ' + id)
//       }
//     })
//     .on('event', function(data) {
//       if (data.code === 'END') {
//         if (!watch) watcher.close()
//         chunks || (chunks = getChunks(inputDir, typesDir))
//         // console.log(333, chunks)

//         const packageMain = {}
//         const packageFiles = chunks.map((v) => v.dir)
//         const packageExports = { './package.json': './package.json' }
//         for (const item of chunks) {
//           if (item.fileName === 'index') {
//             packageMain.main = 'index'
//             packageMain.module = 'index.mjs'
//             packageMain.types = 'index.d.ts'
  
//             packageFiles.push('index.d.ts', 'index.mjs', 'index.js')
//           }
//           packageExports[item.exports] = item.exportsData
//         }
//         packageMain.files = unique(packageFiles)
//         packageMain.exports = packageExports

//         if (packageMainTmp !== (packageMainTmp = JSON.stringify(packageMain))) {
//           console.log(packageMain)

//           // const json = JSON.parse(fs_readFileSync(packageJson, 'utf8'))
//         }
//       }
//     })
// }

// compile({
//   inputDir   : '../test/src',
//   outputDir  : '../test/dist',
//   packageJson: '../package.json'
// })
