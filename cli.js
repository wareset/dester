const fs = require('fs')
const path = require('path')

const SEP = path.sep
const toPosix = (str) => str.split(SEP).join(path.posix.sep)

// prettier-ignore
const hash = (s) => (s.replace(/\r/g, '').split('').reduce((a, b) =>
  (a = (a << 5) - a + b.charCodeAt(0)), 0) >>> 0).toString(36)

const startsWith = (str = '', v = '', pos = 0) =>
  v.length && str.length >= v.length && str.indexOf(v, pos) === pos

const resolveExternals = (key, v) => {
  let res = v !== undefined ? path.relative(key, v) : key
  if (!startsWith(res, SEP) && !startsWith(res, '..')) res = '.' + SEP + res
  if (res[res.length - 1] === SEP) res = res.slice(0, -1)
  return res
}

const mkdirDeep = (...dirpaths) => {
  const mkDirArr = path.resolve(...dirpaths).split(SEP)
  let dir = [mkDirArr.shift(), mkDirArr.shift()].join(SEP)
  do {
    dir = path.resolve(dir, mkDirArr.shift())
    if (!fs.existsSync(dir)) fs.mkdirSync(dir)
  } while (mkDirArr.length)

  return dir
}

const createCacheDir = () => {
  return mkdirDeep(require.main.paths[0] || path.resolve(), '.cache')
}

const kleur = require('kleur')
const argv = require('minimist')(process.argv.slice(2), {
  default: {
    remove: true,
    types: true,
    silent: false,
    sourcemap: false,
    pkg: true,
    tsc: true,
    babel: false,
    cfg: true
  },
  string: ['input', 'output', 'remove', 'types', 'pkg', 'tsc', 'babel', 'cfg'],
  boolean: ['help', 'version', 'watch', 'silent', 'sourcemap'],
  alias: {
    h: 'help',
    v: 'version',
    i: 'input',
    o: 'output',
    r: 'remove',
    t: 'types',
    w: 'watch',
    s: 'silent'
  }
})

// console.log(argv);

const EXTENSIONS = ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json', '.node']

let argvInput = argv.input || argv._[0] || 'src'
let argvOutput =
  argv.output ||
  argv._[1] ||
  (argv._[0] && argvInput !== argv._[0] ? argv._[0] : 'dist')

const argvSourcemap = !!argv.sourcemap
const argvWatch = !!argv.watch
const argvSilent = !!argv.silent

let argvTypes = argv.types
if (argvTypes === true || argvTypes === '') {
  ;(argvTypes = '__types__'), (argv.types = true)
} else if (startsWith(argvTypes, '.')) argvTypes = path.resolve(argvTypes)
// else if (argvTypes) argvTypes = path.basename(argvTypes);

const verbose = (...a) => {
  if (!argvSilent) console.log(...a)
}

const findExternalsFn = (input, output) => {
  const BUILD_KEYS = {}

  const createOutputFn = (output, name = '') => [
    {
      file: path.resolve(output, name, 'index.mjs'),
      format: 'esm',
      exports: 'named',
      sourcemap: argvSourcemap
    },
    {
      file: path.resolve(output, name, 'index.js'),
      format: 'cjs',
      exports: 'named',
      sourcemap: argvSourcemap
    }
  ]

  const findBuilders = (input, output) => {
    let files = fs.readdirSync(input, { withFileTypes: true })

    let name, ext, key
    // const isIndex = [...files].some((dirent) => {
    //   ;({ name, ext } = path.parse(dirent.name))
    //   if (dirent.isFile() && name === 'index' && ~EXTENSIONS.indexOf(ext)) {
    //     BUILD_KEYS[output] = {
    //       name: dirent.name,
    //       input: path.resolve(input, dirent.name),
    //       output: createOutputFn(output)
    //     }
    //     return true
    //   }
    // })

    files = [...files].filter((dirent) => {
      ;({ name, ext } = path.parse(dirent.name))
      if (dirent.isFile() && name === 'index' && ~EXTENSIONS.indexOf(ext)) {
        BUILD_KEYS[output] = {
          name: dirent.name,
          input: path.resolve(input, dirent.name),
          output: createOutputFn(output)
        }
        return false
      }
      return true
    })

    for (const dirent of files) {
      name = dirent.name
      if (name[0] === '_') continue
      if (/(^|\.)tests(\.|$)/.test(name)) continue
      if (dirent.isDirectory()) {
        findBuilders(path.resolve(input, name), path.resolve(output, name))
      } else if (/* !isIndex && */ dirent.isFile()) {
        ;({ name, ext } = path.parse(name)), (key = path.resolve(output, name))
        if (!(key in BUILD_KEYS) && ~EXTENSIONS.indexOf(ext)) {
          BUILD_KEYS[key] = {
            name: dirent.name,
            input: path.resolve(input, dirent.name),
            output: createOutputFn(output, name)
          }
        }
      }
    }
  }

  findBuilders(input, output)
  return BUILD_KEYS
}

;(() => {
  const { name, version, description } = require('./package.json')

  if (argv.version || argv.help) {
    const red = (v) => kleur.red(v)
    console.log(
      kleur.cyan().bold(`
   ___       ${red('__')} _ ${red('_ _ _ /_,_')}  ${red('_______   ____')}
  / _ \\_${red('(/(/(_(')}/ ${red('(-_)(-/_ _)')} ${red('/ ___/ /  /  _/')}
 / _/ / -_/_ —/ __/ -_/ __/ ${red('/ /__/ /___/ /')}
/____/\\__/___/\\__/\\__/_/    ${red('\\___/____/___/')}
    `)
    )

    console.log(description)
    console.log(`[${name}]: version: ${version}; path: ${require.main.path};`)

    if (argv.help) {
      console.log('\n--------------------------------------------------------')

      console.log(kleur.red().bold().inverse('\nArguments:'))
      console.log('  dester [input] [output]')
      console.log(
        '  -i, --input ' + kleur.blue(' -  Input folder. Default: "src"')
      )
      console.log(
        '  -o, --output' + kleur.blue(' -  Output folder. Default: "dist"')
      )
      console.log(
        '  -r, --remove ' +
          kleur.blue('-  Remove or autoremove folders. Default: "auto"')
      )
      console.log(
        '  -t, --types ' +
          kleur.blue(' -  Folder for declarations. Default: "__types__"')
      )
      console.log(
        '  -w, --watch ' +
          kleur.blue(' -  Watch changes in files and configs. Default: false')
      )
      console.log(
        '  -s, --silent' +
          kleur.blue(' -  Show only error messages. Default: false')
      )
      console.log(
        '  --sourcemap ' + kleur.blue(' -  Create SourceMap. Default: false')
      )
      console.log(
        '  --pkg       ' +
          kleur.blue(' -  Path to package.json. Default: "auto"')
      )
      console.log(
        '  --tsc       ' +
          kleur.blue(' -  Path to tsconfig.json. Default: "auto"')
      )
      console.log(
        '  --babel     ' +
          kleur.blue(' -  Path to babel.config.json. Default: false')
      )
      // console.log(
      //   '  --cfg       ' +
      //     kleur.blue(' -  Path to dester.config.js. Default: "auto"')
      // );

      console.log('\n--------------------------------------------------------')

      console.log(kleur.red().bold().inverse('\nExamples:'))
      console.log('  dester ./src')
      console.log('  dester ./src ./dist')

      console.log(kleur.bold().red('\nRemove folders:'))
      console.log(kleur.blue('- Not remove:'))
      console.log('  dester ./src ./dist --no-r')
      console.log('  dester ./src ./dist --no-remove')
      console.log(kleur.blue('- Remove only created subfolders (DEFAULT):'))
      console.log('  dester ./src ./dist -r')
      console.log('  dester ./src ./dist --remove')
      console.log(kleur.blue('- Remove folder "FOLDERNAME" before build:'))
      console.log('  dester ./src ./dist --remove FOLDERNAME')
      console.log('  dester ./src ./dist -r ./some/FOLDERNAME')

      console.log(kleur.bold().red('\nTypes:'))
      console.log(kleur.blue('- Not create types:'))
      console.log('  dester ./src ./dist --no-t')
      console.log('  dester ./src ./dist --no-types')
      console.log(kleur.blue('- Create types (DEFAULT):'))
      console.log('  dester ./src ./dist --types __types__')
      console.log(kleur.blue('- Create types in "TYPES_FOLDER_NAME":'))
      console.log('  dester ./src ./dist --types TYPES_FOLDER_NAME')
      console.log('  dester ./src ./dist -t ./dist/TYPES_FOLDER_NAME')

      console.log(kleur.bold().red('\nWatch:'))
      console.log('  dester ./src ./dist -w')
      console.log('  dester ./src ./dist --watch')

      console.log(kleur.bold().red('\nSilent mode:'))
      console.log('  dester ./src ./dist -s')
      console.log('  dester ./src ./dist --silent')

      console.log(kleur.bold().red('\nCreate source maps:'))
      console.log('  dester ./src ./dist --sourcemap')

      console.log(kleur.bold().red('\nSet package.json:'))
      console.log(kleur.blue('- Not find package.json:'))
      console.log('  dester ./src ./dist --no-pkg')
      console.log(kleur.blue('- Auto-find package.json (DEFAULT):'))
      console.log('  dester ./src ./dist --pkg')
      console.log('  dester ./src ./dist --pkg auto')
      console.log(kleur.blue('- Find or auto-find package.json in dir:'))
      console.log('  dester ./src ./dist --pkg ./some-dir')
      console.log('  dester ./src ./dist --pkg ./some-dir/package.json')
      console.log('  dester ./src ./dist --pkg ./some-dir/custom-package.json')

      console.log(kleur.bold().red('\nSet tsconfig.json:'))
      console.log(kleur.inverse().red('(need installed "typescript")'))
      console.log(kleur.blue('- Not find tsconfig.json:'))
      console.log('  dester ./src ./dist --no-tsc')
      console.log(kleur.blue('- Auto-find tsconfig.json (DEFAULT):'))
      console.log('  dester ./src ./dist --tsc')
      console.log('  dester ./src ./dist --tsc auto')
      console.log(kleur.blue('- Find or auto-find tsconfig.json in dir:'))
      console.log('  dester ./src ./dist --tsc ./some-dir')
      console.log('  dester ./src ./dist --tsc ./some-dir/tsconfig.json')

      console.log(kleur.bold().red('\nSet babel.config.json (.babelrc.json):'))
      console.log(kleur.inverse().red('(need installed "@babel/core")'))
      console.log(kleur.blue('- Not find babel.config.json (DEFAULT):'))
      console.log('  dester ./src ./dist --no-babel')
      console.log(kleur.blue('- Auto-find babel.config.json:'))
      console.log('  dester ./src ./dist --babel')
      console.log('  dester ./src ./dist --babel auto')
      console.log(kleur.blue('- Find or auto-find babel.config.json in dir:'))
      console.log('  dester ./src ./dist --babel ./some-dir')
      console.log('  dester ./src ./dist --babel ./some-dir/.babelrc.json')
      console.log('  dester ./src ./dist --babel ./some-dir/babel.config.js')

      // console.log(kleur.bold().red('\nSet dester.config.js:'));
      // console.log(kleur.blue('- Not find dester.config.js:'));
      // console.log('  dester ./src ./dist --no-cfg');
      // console.log(kleur.blue('- Find dester.config.js:'));
      // console.log('  dester ./src ./dist --cfg ./some-dir');
      // console.log('  dester ./src ./dist --cfg ./some-dir/dester.config.js');
      // console.log('  dester ./src ./dist --cfg ./some-dir/custom-config.js');

      console.log('\n--------------------------------------------------------')
    }

    return
  }

  const rollup = require('rollup')
  const rimraf = require('rimraf').sync
  // const rollupPluginResolve = require('@rollup/plugin-node-resolve').default({
  //   extensions: EXTENSIONS
  // });
  // const rollupPluginCommonjs = require('@rollup/plugin-commonjs')({
  //   // transformMixedEsModules: 'ignore',
  //   extensions: EXTENSIONS
  // });
  const rollupPluginJson = require('@rollup/plugin-json')()
  const rollupPluginSucrase = require('@rollup/plugin-sucrase')({
    transforms: ['typescript']
  })
  const rollupPluginAlias = require('@rollup/plugin-alias')

  let typescriptCore = 'tsc'
  let babelCore, rollupPluginBabel
  try {
    ;(() => {
      babelCore = require.resolve('@babel/core')
      if (fs.existsSync(babelCore)) {
        rollupPluginBabel = require('@rollup/plugin-babel').getBabelOutputPlugin
      }
    })()
  } catch (err) {
    /* */
  }

  const DIR_INPUT = path.resolve(argvInput)
  const DIR_OUTPUT = path.resolve(argvOutput)
  const DIR_TYPES = argvTypes ? path.resolve(DIR_OUTPUT, argvTypes) : null

  const createTypesFn = () => {
    // console.log(process);
    const DIR_CACHE = createCacheDir()
    const DIR_CACHE_DESTER = path.resolve(DIR_CACHE, 'dester')
    if (!fs.existsSync(DIR_CACHE_DESTER)) fs.mkdirSync(DIR_CACHE_DESTER)
    const FILE_TSCONFIG = path.resolve(
      DIR_CACHE_DESTER,
      hash(DIR_INPUT + DIR_OUTPUT) + '.json'
    )

    const OBJ_TSCONFIG = {
      // Change this to match your project
      include: [toPosix(path.join(DIR_INPUT, '/**/*'))],
      exclude: [
        toPosix(path.join(DIR_INPUT, '/**/_*')),
        toPosix(path.join(DIR_INPUT, '/**/*.test.*')),
        toPosix(path.join(DIR_INPUT, '/**/*.tests.*')),
        toPosix(path.join(DIR_INPUT, '/**/*.test')),
        toPosix(path.join(DIR_INPUT, '/**/*.tests')),
        toPosix(path.join(DIR_INPUT, '/**/test.*')),
        toPosix(path.join(DIR_INPUT, '/**/tests.*'))
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
        outDir: toPosix(DIR_TYPES),
        // declarationDir: DIR_TYPES,

        experimentalDecorators: true,
        emitDecoratorMetadata: true,

        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        target: 'esnext',
        moduleResolution: 'node',
        module: 'esnext'
      }
    }

    fs.writeFileSync(FILE_TSCONFIG, JSON.stringify(OBJ_TSCONFIG))
    process.on('exit', () => fs.unlinkSync(FILE_TSCONFIG))

    let cliTS = 'tsc'

    // prettier-ignore
    // eslint-disable-next-line block-spacing, brace-style
    try {
      (() => {
        typescriptCore = require.resolve('.bin/tsc')
        if (fs.existsSync(typescriptCore)) cliTS = typescriptCore
      })()
    } catch (err) { /* */ }

    // prettier-ignore
    try {
      const tsFork = require('child_process').spawn(cliTS,
        ['--build', FILE_TSCONFIG, ...(argvWatch ? ['--watch'] : [])],
        { shell: true  }
        // { stdio: ['ignore', 'inherit', 'inherit'], shell: true }
      )
      const exit = () => tsFork && tsFork.kill(0)
      process.on('SIGTERM', exit), process.on('exit', exit)
      tsFork.stdout.on('data', (data) => {
        data = [data].join('\n')
        if (/error([^s]|$)/i.test(data)) {
          console.error('\nTypescript Error:')
          console.error(kleur.red(data))
        } else verbose(data)
      })
      tsFork.on('error', (data) => {
        argv.types = false
        verbose(kleur.red('"tsc" not found. Use "--no-types" parameter!'))
      })
    } catch (err) {/* */}
  }
  if (argv.types) createTypesFn()

  argvInput = path.resolve(argvInput)
  argvOutput = path.resolve(argvOutput)

  const findFileFn = (fileFromArgv, base) => {
    if (Array.isArray(base)) {
      let res
      base.some((v) => (res = findFileFn(fileFromArgv, v)))
      return res || false
    }

    let file = fileFromArgv

    // prettier-ignore
    // eslint-disable-next-line block-spacing, brace-style
    try { file = JSON.parse(file) } catch (err) { /* */ }

    if (file === true || file === '' || /^\s*auto\s*$/i.test('' + file)) {
      ;(() => {
        file = ''
        let dir = DIR_INPUT
        let lastDir
        do {
          lastDir = dir
          // prettier-ignore
          // eslint-disable-next-line block-spacing, brace-style
          try { file = require.resolve(path.resolve(dir, base)) }
          catch (err) {/* */}
          dir = path.dirname(dir)
        } while (lastDir !== dir && !file)
      })()
    } else if (typeof file === 'string' && file.trim().length) {
      try {
        file = path.resolve(fileFromArgv)
        if (base) {
          if (!path.extname(file)) file = path.resolve(file, base)
          file = require.resolve(file)
        }
      } catch (err) {
        file = false
        throw new Error(kleur.bgRed(' (' + base + ') - ' + fileFromArgv + ' '))
      }
    } else file = false
    return file
  }

  let watcher
  let removeFile
  let pkgFile, tscFile, babelFile // , cfgFile;
  let pkgFileWatch, tscFileWatch, babelFileWatch
  const buildRollupFn = () => {
    // if (watcher) watcher.close(), watcher = null;
    if (watcher) return watcher

    removeFile = findFileFn(argv.remove, false)
    if (removeFile === '') removeFile = true
    pkgFile = findFileFn(argv.pkg, 'package.json')
    tscFile = findFileFn(argv.tsc, 'tsconfig.json')
    babelFile = findFileFn(argv.babel, [
      '.babelrc.json',
      '.babelrc.js',
      'babel.config.json',
      'babel.config.js'
    ])
    // cfgFile = findFileFn(argv.cfg, 'dester.config.js');

    pkgFileWatch = !!pkgFile
    tscFileWatch = !!tscFile
    babelFileWatch = !!babelFile

    verbose(`[${name}]: version: ${version}; path: ${require.main.path};`)

    verbose('\nInput/Output:')
    verbose(kleur.cyan().inverse(' DIR_INPUT: \n    ' + DIR_INPUT + ' '))
    verbose(kleur.cyan().inverse(' DIR_OUTPUT: \n    ' + DIR_OUTPUT + ' '))

    verbose('\nTypescript')
    verbose(kleur.cyan().inverse(' typescript: ' + typescriptCore + ' '))
    verbose(kleur.cyan().inverse(' FILE_TSC: \n    ' + tscFile + ' '))
    verbose(kleur.cyan().inverse(' DIR_TYPES: \n    ' + DIR_TYPES + ' '))

    verbose('\nBabel:')
    verbose(kleur.cyan().inverse(' @babel/core: ' + babelCore + ' '))
    verbose(kleur.cyan().inverse(' FILE_BABEL: \n    ' + babelFile + ' '))

    verbose('\nSettings:')
    verbose(kleur.cyan().inverse(' FILE_PKG: \n    ' + pkgFile + ' '))
    // verbose(kleur.cyan().inverse(' FILE_CFG: \n    ' + cfgFile + ' '));

    verbose('')

    const BUILD_KEYS = findExternalsFn(DIR_INPUT, DIR_OUTPUT)
    // console.log('DIR_OUTPUT', DIR_OUTPUT)
    // console.log('BUILD_KEYS', BUILD_KEYS)

    if (typeof removeFile === 'string') {
      if (
        DIR_INPUT.indexOf(removeFile) > -1 ||
        removeFile.indexOf(DIR_OUTPUT) !== 0
      ) {
        console.log(
          kleur.bgRed('Directory: ' + removeFile + " - can't delete it")
        )
      } else rimraf(removeFile)
    } else if (removeFile) {
      Object.keys(BUILD_KEYS).forEach((key) => {
        if (key !== DIR_OUTPUT) rimraf(key)
      })
    }

    const buildDefaultPackage = (key, props = {}) => {
      const filePackage = path.resolve(key, 'package.json')

      let __package__ = {}
      if (fs.existsSync(filePackage)) {
        __package__ = JSON.parse(fs.readFileSync(filePackage).toString())
      }

      const files = (__package__.files || []).filter((v) => {
        return fs.existsSync(path.resolve(key, v))
      })

      if (argv.types) {
        if (path.resolve(DIR_OUTPUT) === path.dirname(DIR_TYPES)) {
          files.push(toPosix(path.join(resolveExternals(key, DIR_TYPES))))
        }
      }

      const datafiles = Object.keys(BUILD_KEYS)
        .map((v) => {
          v = v.indexOf(key) === 0 ? v.slice(key.length + 1) : ''
          return !v ? '' : v.split(SEP)[0]
        })
        .filter((v, k, a) => v && a.indexOf(v) === k)

      __package__.files = [...files, ...datafiles].filter(
        (v, k, a) => v && a.indexOf(v) === k
      )
      __package__.files.sort()

      mkdirDeep(path.dirname(filePackage))
      fs.writeFileSync(
        filePackage,
        JSON.stringify(__package__, null, '  ') + '\n'
      )
    }

    if (!(DIR_OUTPUT in BUILD_KEYS)) buildDefaultPackage(DIR_OUTPUT)

    let pkg
    if (pkgFile) pkg = JSON.parse(fs.readFileSync(pkgFile).toString())

    let rollupPluginTypescript
    if (
      tscFile &&
      Object.keys(BUILD_KEYS).some((v) =>
        startsWith(path.parse(BUILD_KEYS[v].input).ext, '.ts')
      )
    ) {
      rollupPluginTypescript = require('rollup-plugin-typescript2')({
        tsconfig: tscFile,
        tsconfigOverride: {
          compilerOptions: { declaration: false },
          include: [DIR_INPUT]
        }
      })
    }

    const external = [].concat(
      Object.keys(process.binding('natives')),
      pkg ? Object.keys(pkg.dependencies || {}) : [],
      pkg ? Object.keys(pkg.peerDependencies || {}) : []
    )

    const ROLLS = []
    let writeKeys = {}
    for (const key of Object.keys(BUILD_KEYS)) {
      const { input, output, name } = BUILD_KEYS[key]
      const plugins = [
        rollupPluginJson
        // rollupPluginResolve,
        // rollupPluginCommonjs
      ]

      const isTs = startsWith(path.parse(input).ext, '.ts')
      if (isTs) plugins.unshift(rollupPluginTypescript || rollupPluginSucrase)

      const indexAlias = !startsWith(name, 'index.')
      if (indexAlias) {
        plugins.unshift(
          rollupPluginAlias({
            entries: [
              { find: /^\.\//, replacement: '../' },
              { find: /^\.\.\//, replacement: '../../' }
            ]
          })
        )
      }

      if (rollupPluginBabel && babelFile) {
        plugins.push(rollupPluginBabel({ configFile: babelFile }))
      }

      const filePackage = path.resolve(key, 'package.json')
      if (pkgFile && filePackage === path.resolve(pkgFile)) {
        pkgFileWatch = false
      }

      plugins.push({
        resolveId(source, file) {
          // console.log('resolveId', [source, file])
          // console.log(JSON.stringify(external, null, 2))
          if (file) {
            if (!external.some((path) => source.indexOf(path) === 0)) {
              throw new Error(
                file + '\ndependency: ' + source + ' - not found in external'
              )
            }
            return { id: source, external: true }
          }
        },
        writeBundle({ format }, data) {
          // console.log('format: ' + format, Object.keys(data))
          if (key in writeKeys) return
          writeKeys[key] = true

          const MAIN = 'index'
          const INDEX = 'index.js'
          const MODULE = 'index.mjs'
          const TYPES = 'index.d.ts'

          let __package__ = {}
          if (fs.existsSync(filePackage)) {
            __package__ = JSON.parse(fs.readFileSync(filePackage).toString())
          }
          ;(__package__.main = MAIN), (__package__.module = MODULE)

          const files = (__package__.files || []).filter((v) => {
            if ([INDEX, MODULE, TYPES].indexOf(v) >= 0) return false
            return fs.existsSync(path.resolve(key, v))
          })
          files.push(INDEX, MODULE)

          if (argv.types) {
            __package__.types = TYPES
            const importPath = toPosix(
              resolveExternals(
                path.join(
                  resolveExternals(key, DIR_TYPES),
                  resolveExternals(DIR_OUTPUT, key)
                )
              )
            )

            const exports = data[Object.keys(data)[0]].exports
            verbose('exports: ', exports)

            let isAllExport
            let text = ''
            exports.forEach((v, k, a) => {
              if (v === 'default') {
                if (text) text += '\n'
                text += `import __default__ from '${importPath}';\n`
                text += 'export { __default__ as default };\n'
                if (k < a.length - 1) text += '\n'
              } else if (v[0] === '*') {
                isAllExport = true
                text += `export * from '${importPath}';\n`
              } else {
                text += `export { ${v} } from '${importPath}';\n`
              }
            })

            // TODO: Fix types
            // text = `export * from '${importPath}';\n\n/*\n${text}*/\n`
            // FIX: export types and interfaces
            if (!isAllExport) text = `export * from '${importPath}';\n\n${text}`

            files.push(TYPES)
            if (path.resolve(DIR_OUTPUT) === path.dirname(DIR_TYPES)) {
              files.push(toPosix(path.join(resolveExternals(key, DIR_TYPES))))
            }

            fs.writeFileSync(path.resolve(key, 'index.d.ts'), text)
          } else delete __package__.types

          const datafiles = Object.keys(BUILD_KEYS)
            .map((v) => {
              v = v.indexOf(key) === 0 ? v.slice(key.length + 1) : ''
              return !v ? '' : v.split(SEP)[0]
            })
            .filter((v, k, a) => v && a.indexOf(v) === k)

          __package__.files = [...files, ...datafiles].filter(
            (v, k, a) => v && a.indexOf(v) === k
          )
          __package__.files.sort()

          fs.writeFileSync(
            filePackage,
            JSON.stringify(__package__, null, '  ') + '\n'
          )
        }
      })

      const buildKeysExternals = Object.keys(BUILD_KEYS)
        .filter((v) => v !== key)
        .map((v) => toPosix(resolveExternals(key, v)))

      const watchOptions = {
        external: [...external, ...buildKeysExternals],
        input,
        plugins,
        output
      }

      ROLLS.push(watchOptions)
    }

    watcher = rollup.watch(ROLLS)
    process.on('SIGTERM', watcher.close), process.on('exit', watcher.close)

    watcher.on('event', (event) => {
      // verbose(event)
      // event.code can be one of:
      //   START        — the watcher is (re)starting
      //   BUNDLE_START — building an individual bundle
      //   BUNDLE_END   — finished building a bundle
      //   END          — finished building all bundles
      //   ERROR        — encountered an error while bundling

      if (event.code === 'BUNDLE_START') {
        verbose('\n')
        verbose(kleur.inverse(' ' + event.input + ' '))
        verbose(event)
      }

      if (event.code === 'BUNDLE_END') {
        verbose('--------------------------------------------------------')
      }

      if (event.code === 'END') {
        writeKeys = {}
        if (!argvWatch) watcher.close()
      }

      if (event.code === 'ERROR') {
        writeKeys = {}
        const text = ' Dester ERROR: ' + event.error + ' '
        const bg = kleur.bgRed([...Array(text.length)].map((v) => ' ').join(''))
        console.error('\n' + bg + '\n' + kleur.bgRed(text) + '\n' + bg)
        // event.error = kleur.red(event.error);
        console.error(event)
        console.error(bg + '\n' + bg + '\n')
        if (!argvWatch) watcher.close(), process.kill(0), process.exit(0)
      }
    })

    return watcher
  }

  watcher = buildRollupFn()
  let last
  const rebuildFn = (force) => (type, file) => {
    if (file && /^[._]/.test(file[0])) return

    const l = type + file

    if (last !== l) {
      last = l
      verbose('\n')
      verbose(kleur.green().inverse(' ' + type + ': ' + file + ' '))
    }

    if (type !== 'change' || force) {
      if (watcher) watcher.close(), (watcher = null)
      setTimeout(() => (watcher = buildRollupFn()), 1000)
    }
  }
  if (argvWatch) {
    const chokidar = require('chokidar')
    chokidar.watch(argvInput).on('raw', rebuildFn())
    if (pkgFileWatch) chokidar.watch(pkgFile).on('change', rebuildFn(true))
    if (tscFileWatch) chokidar.watch(tscFile).on('change', rebuildFn(true))
    if (babelFileWatch) chokidar.watch(babelFile).on('change', rebuildFn(true))
    // if (cfgFile) chokidar.watch(cfgFile).on('change', rebuildFn(true));
  }
})()
