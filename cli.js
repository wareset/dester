const fs = require('fs');
const path = require('path');

const SEP = path.sep;
const toPosix = (str) => str.split(SEP).join(path.posix.sep);

// prettier-ignore
const hash = (s) => (s.replace(/\r/g, '').split('').reduce((a, b) =>
  (a = (a << 5) - a + b.charCodeAt(0)), 0) >>> 0).toString(36);

const startsWith = (str = '', v = '', pos = 0) =>
  v.length && str.length >= v.length && str.indexOf(v, pos) === pos;

const resolveExternals = (key, v) => {
  let res = v !== undefined ? path.relative(key, v) : key;
  if (!startsWith(res, SEP) && !startsWith(res, '..')) res = '.' + SEP + res;
  if (res[res.length - 1] === SEP) res = res.slice(0, -1);
  return res;
};

const createCacheDir = () => {
  const cacheDirArr = path
    .resolve(require.main.paths[0] || path.resolve(), '.cache')
    .split(SEP);

  let dirCache = [cacheDirArr.shift(), cacheDirArr.shift()].join(SEP);
  do {
    dirCache = path.resolve(dirCache, cacheDirArr.shift());
    if (!fs.existsSync(dirCache)) fs.mkdirSync(dirCache);
  } while (cacheDirArr.length);

  return dirCache;
};

const kleur = require('kleur');
const argv = require('minimist')(process.argv.slice(2), {
  default: {
    tsc: true,
    pkg: true,
    types: true,
    sourcemap: false,
    silent: false
  },
  string: ['input', 'output', 'pkg', 'tsc', 'types'],
  boolean: ['help', 'version', 'watch', 'sourcemap', 'silent'],
  alias: {
    h: 'help',
    v: 'version',
    i: 'input',
    o: 'output',
    t: 'types',
    w: 'watch',
    s: 'silent'
  }
});

// console.log(argv);

const EXTENSIONS = ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json', '.node'];

let argvInput = argv.input || argv._[0] || 'src';
let argvOutput =
  argv.output ||
  argv._[1] ||
  (argv._[0] && argvInput !== argv._[0] ? argv._[0] : 'dist');

const argvSourcemap = !!argv.sourcemap;
const argvWatch = !!argv.watch;
const argvSilent = !!argv.silent;

let argvTypes = argv.types;
if (argvTypes === true || argvTypes === '') {
  (argvTypes = '__types__'), (argv.types = true);
} else if (startsWith(argvTypes, '.')) argvTypes = path.resolve(argvTypes);
// else if (argvTypes) argvTypes = path.basename(argvTypes);

const verbose = (...a) => {
  if (!argvSilent) console.log(...a);
};

const findExternalsFn = (input, output) => {
  const BUILD_KEYS = {};

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
  ];

  const findBuilders = (input, output) => {
    const files = fs.readdirSync(input, { withFileTypes: true });

    let name, ext, key;
    const isIndex = [...files].some((dirent) => {
      ({ name, ext } = path.parse(dirent.name));
      if (dirent.isFile() && name === 'index' && ~EXTENSIONS.indexOf(ext)) {
        BUILD_KEYS[output] = {
          name: dirent.name,
          input: path.resolve(input, dirent.name),
          output: createOutputFn(output)
        };
        return true;
      }
    });

    for (const dirent of files) {
      name = dirent.name;
      if (name[0] === '_') continue;
      if (dirent.isDirectory()) {
        findBuilders(path.resolve(input, name), path.resolve(output, name));
      } else if (!isIndex && dirent.isFile()) {
        ({ name, ext } = path.parse(name)), (key = path.resolve(output, name));
        if (!(key in BUILD_KEYS) && ~EXTENSIONS.indexOf(ext)) {
          BUILD_KEYS[key] = {
            name: dirent.name,
            input: path.resolve(input, dirent.name),
            output: createOutputFn(output, name)
          };
        }
      }
    }
  };

  findBuilders(input, output);
  return BUILD_KEYS;
};

(() => {
  if (argv.version || argv.help) {
    const red = (v) => kleur.red(v);
    console.log(
      kleur.cyan().bold(`
   ___       ${red('__')} _ ${red('_ _ _ /_,_')}  ${red('_______   ____')}
  / _ \\_${red('(/(/(_(')}/ ${red('(-_)(-/_ _)')} ${red('/ ___/ /  /  _/')}
 / _/ / -_/_ —/ __/ -_/ __/ ${red('/ /__/ /___/ /')}
/____/\\__/___/\\__/\\__/_/    ${red('\\___/____/___/')}
    `)
    );

    const { name, version, description } = require('./package.json');
    console.log(name);
    console.log(version);
    console.log(description);

    if (argv.help) {
      console.log('\n--------------------------------------------------------');

      console.log(kleur.red().bold().inverse('\nArguments:'));
      console.log('  dester [input] [output]');
      console.log(
        '  -i, --input ' + kleur.blue(' -  Input folder. Default: "src"')
      );
      console.log(
        '  -o, --output' + kleur.blue(' -  Output folder. Default: "dist"')
      );
      console.log(
        '  -t, --types ' +
          kleur.blue(' -  Folder for declarations. Default: "__types__"')
      );
      console.log(
        '  -w, --watch ' +
          kleur.blue(' -  Watch changes in files and configs. Default: false')
      );
      console.log(
        '  -s, --silent' +
          kleur.blue(' -  Do not display messages. Default: false')
      );
      console.log(
        '  --sourcemap ' + kleur.blue(' -  Create SourceMap. Default: false')
      );
      console.log(
        '  --pkg       ' +
          kleur.blue(' -  Path to package.json. Default: "auto"')
      );
      console.log(
        '  --tsc       ' +
          kleur.blue(' -  Path to tsconfig.json. Default: "auto"')
      );

      console.log('\n--------------------------------------------------------');

      console.log(kleur.red().bold().inverse('\nExamples:'));
      console.log('  dester ./src');
      console.log('  dester ./src ./dist');

      console.log(kleur.bold().red('\nTypes:'));
      console.log(kleur.blue('- Not create types:'));
      console.log('  dester ./src ./dist --no-t');
      console.log('  dester ./src ./dist --no-types');
      console.log(kleur.blue('- Create types in "TYPES_FOLDER_NAME":'));
      console.log('  dester ./src ./dist --types TYPES_FOLDER_NAME');
      console.log('  dester ./src ./dist -t ./dist/TYPES_FOLDER_NAME');

      console.log(kleur.bold().red('\nWatch:'));
      console.log('  dester ./src ./dist -w');
      console.log('  dester ./src ./dist --watch');

      console.log(kleur.bold().red('\nSilent mode:'));
      console.log('  dester ./src ./dist -s');
      console.log('  dester ./src ./dist --silent');

      console.log(kleur.bold().red('\nCreate source maps:'));
      console.log('  dester ./src ./dist --sourcemap');

      console.log(kleur.bold().red('\nSet package.json:'));
      console.log(kleur.blue('- Not find package.json:'));
      console.log('  dester ./src ./dist --no-pkg');
      console.log(kleur.blue('- Find package.json:'));
      console.log('  dester ./src ./dist --pkg ./some-dir');
      console.log('  dester ./src ./dist --pkg ./some-dir/package.json');
      console.log('  dester ./src ./dist --pkg ./some-dir/custom-package.json');

      console.log(kleur.bold().red('\nSet tsconfig.json:'));
      console.log(kleur.blue('- Not find tsconfig.json:'));
      console.log('  dester ./src ./dist --no-tsc');
      console.log(kleur.blue('- Find tsconfig.json:'));
      console.log('  dester ./src ./dist --tsc ./some-dir');
      console.log('  dester ./src ./dist --tsc ./some-dir/tsconfig.json');

      console.log('\n--------------------------------------------------------');
    }

    return;
  }

  const rollup = require('rollup');
  // const rollupPluginResolve = require('@rollup/plugin-node-resolve').default({
  //   extensions: EXTENSIONS
  // });
  // const rollupPluginCommonjs = require('@rollup/plugin-commonjs')({
  //   // transformMixedEsModules: 'ignore',
  //   extensions: EXTENSIONS
  // });
  const rollupPluginJson = require('@rollup/plugin-json')();
  const rollupPluginSucrase = require('@rollup/plugin-sucrase')({
    transforms: ['typescript']
  });

  const DIR_INPUT = path.resolve(argvInput);
  const DIR_OUTPUT = path.resolve(argvOutput);
  const DIR_TYPES = argvTypes ? path.resolve(DIR_OUTPUT, argvTypes) : null;

  const createTypesFn = () => {
    // console.log(process);
    const DIR_CACHE = createCacheDir();
    const DIR_CACHE_DESTER = path.resolve(DIR_CACHE, 'dester');
    if (!fs.existsSync(DIR_CACHE_DESTER)) fs.mkdirSync(DIR_CACHE_DESTER);
    const FILE_TSCONFIG = path.resolve(
      DIR_CACHE_DESTER,
      hash(DIR_INPUT + DIR_OUTPUT) + '.json'
    );

    const OBJ_TSCONFIG = {
      // Change this to match your project
      include: [toPosix(path.join(DIR_INPUT, '/**/*'))],
      exclude: [toPosix(path.join(DIR_INPUT, '/**/_*'))],

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
    };

    fs.writeFileSync(FILE_TSCONFIG, JSON.stringify(OBJ_TSCONFIG));
    process.on('exit', () => fs.unlinkSync(FILE_TSCONFIG));

    let cliTS = 'tsc';

    // prettier-ignore
    // eslint-disable-next-line block-spacing, brace-style
    try {
      (() => {
        const tsc = require.resolve('.bin/tsc');
        if (fs.existsSync(tsc)) cliTS = tsc;
      })();
    } catch (err) { /* */ }

    // prettier-ignore
    try {
      const tsFork = require('child_process').spawn(cliTS,
        ['--build', FILE_TSCONFIG, ...(argvWatch ? ['--watch'] : [])],
        { shell: true  }
        // { stdio: ['ignore', 'inherit', 'inherit'], shell: true }
      );
      const exit = () => tsFork && tsFork.kill(0);
      process.on('SIGTERM', exit), process.on('exit', exit);
      tsFork.stdout.on('data', (data) => {
        verbose([data.toString()]);
      });
      tsFork.on('error', (data) => {
        argv.types = false;
        verbose(kleur.red('"tsc" not found. Use "--no-types" parameter!'));
      });
    } catch (err) {/* */}
  };
  if (argv.types) createTypesFn();

  argvInput = path.resolve(argvInput);
  argvOutput = path.resolve(argvOutput);

  const findFileFn = (fileFromArgv, base) => {
    let file = fileFromArgv;

    // prettier-ignore
    // eslint-disable-next-line block-spacing, brace-style
    try { file = JSON.parse(file); } catch (err) { /* */ }

    if (file === true || file === '' || file === 'auto') {
      (() => {
        file = '';
        let dir = DIR_INPUT;
        let lastDir;
        do {
          lastDir = dir;
          // prettier-ignore
          // eslint-disable-next-line block-spacing, brace-style
          try { file = require.resolve(path.resolve(dir, base)); }
          catch (err) {/* */}
          dir = path.dirname(dir);
        } while (lastDir !== dir && !file);
      })();
    } else if (typeof file === 'string') {
      file = path.resolve(fileFromArgv);
      if (!path.extname(file)) file = path.resolve(file, base);
    } else file = false;
    return file;
  };

  const pkgFile = findFileFn(argv.pkg, 'package.json');
  const tscFile = findFileFn(argv.tsc, 'tsconfig.json');

  verbose(kleur.cyan().inverse(' DIR_INPUT: \n    ' + DIR_INPUT + ' '));
  verbose(kleur.cyan().inverse(' DIR_OUTPUT: \n    ' + DIR_OUTPUT + ' '));
  verbose('');
  verbose(kleur.cyan().inverse(' FILE_PKG: \n    ' + pkgFile + ' '));
  verbose(kleur.cyan().inverse(' FILE_TSC: \n    ' + tscFile + ' '));
  verbose('');
  verbose(kleur.cyan().inverse(' DIR_TYPES: \n    ' + DIR_TYPES + ' '));

  let watcher;
  const buildRollupFn = () => {
    // if (watcher) watcher.close(), watcher = null;
    if (watcher) return watcher;

    const BUILD_KEYS = findExternalsFn(DIR_INPUT, DIR_OUTPUT);
    // console.log('DIR_OUTPUT', DIR_OUTPUT);
    // console.log('BUILD_KEYS', BUILD_KEYS);

    const buildDefaultPackage = (key, props = {}) => {
      const filePackage = path.resolve(key, 'package.json');

      let __package__ = {};
      if (fs.existsSync(filePackage)) {
        __package__ = JSON.parse(fs.readFileSync(filePackage).toString());
      }

      const files = (__package__.files || []).filter((v) => {
        return fs.existsSync(path.resolve(key, v));
      });

      if (argv.types) {
        if (path.resolve(DIR_OUTPUT) === path.dirname(DIR_TYPES)) {
          files.push(toPosix(path.join(resolveExternals(key, DIR_TYPES))));
        }
      }

      const datafiles = Object.keys(BUILD_KEYS)
        .map((v) => {
          v = v.indexOf(key) === 0 ? v.slice(key.length + 1) : '';
          return !v ? '' : v.split(SEP)[0];
        })
        .filter((v, k, a) => v && a.indexOf(v) === k);

      __package__.files = [...files, ...datafiles].filter(
        (v, k, a) => v && a.indexOf(v) === k
      );
      __package__.files.sort();

      fs.writeFileSync(
        filePackage,
        JSON.stringify(__package__, null, '  ') + '\n'
      );
    };

    if (!(DIR_OUTPUT in BUILD_KEYS)) buildDefaultPackage(DIR_OUTPUT);

    let pkg;
    if (pkgFile) pkg = JSON.parse(fs.readFileSync(pkgFile).toString());

    let rollupPluginTypescript;
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
      });
    }

    const external = [].concat(
      Object.keys(process.binding('natives')),
      pkg ? Object.keys(pkg.dependencies || {}) : [],
      pkg ? Object.keys(pkg.peerDependencies || {}) : []
    );

    const ROLLS = [];
    let writeKeys = {};
    for (const key of Object.keys(BUILD_KEYS)) {
      const { input, output } = BUILD_KEYS[key];
      const plugins = [
        rollupPluginJson
        // rollupPluginResolve,
        // rollupPluginCommonjs
      ];
      const isTs = startsWith(path.parse(input).ext, '.ts');
      if (isTs) plugins.unshift(rollupPluginTypescript || rollupPluginSucrase);

      const filePackage = path.resolve(key, 'package.json');

      plugins.push({
        writeBundle({ format }, data) {
          // console.log('format: ' + format, Object.keys(data));
          if (key in writeKeys) return;
          writeKeys[key] = true;

          const MAIN = 'index';
          const INDEX = 'index.js';
          const MODULE = 'index.mjs';
          const TYPES = 'index.d.ts';

          let __package__ = {};
          if (fs.existsSync(filePackage)) {
            __package__ = JSON.parse(fs.readFileSync(filePackage).toString());
          }
          (__package__.main = MAIN), (__package__.module = MODULE);

          const files = (__package__.files || []).filter((v) => {
            if ([INDEX, MODULE, TYPES].indexOf(v) >= 0) return false;
            return fs.existsSync(path.resolve(key, v));
          });
          files.push(INDEX, MODULE);

          if (argv.types) {
            __package__.types = TYPES;
            const importPath = toPosix(
              resolveExternals(
                path.join(
                  resolveExternals(key, DIR_TYPES),
                  resolveExternals(DIR_OUTPUT, key)
                )
              )
            );

            const exports = data[Object.keys(data)[0]].exports;
            verbose('exports: ', exports);

            let text = '';
            exports.forEach((v, k, a) => {
              if (v === 'default') {
                if (text) text += '\n';
                text += `import __default__ from '${importPath}';\n`;
                text += 'export { __default__ as default };\n';
                if (k < a.length - 1) text += '\n';
              } else text += `export { ${v} } from '${importPath}';\n`;
            });

            files.push(TYPES);
            if (path.resolve(DIR_OUTPUT) === path.dirname(DIR_TYPES)) {
              files.push(toPosix(path.join(resolveExternals(key, DIR_TYPES))));
            }

            fs.writeFileSync(path.resolve(key, 'index.d.ts'), text);
          } else delete __package__.types;

          const datafiles = Object.keys(BUILD_KEYS)
            .map((v) => {
              v = v.indexOf(key) === 0 ? v.slice(key.length + 1) : '';
              return !v ? '' : v.split(SEP)[0];
            })
            .filter((v, k, a) => v && a.indexOf(v) === k);

          __package__.files = [...files, ...datafiles].filter(
            (v, k, a) => v && a.indexOf(v) === k
          );
          __package__.files.sort();

          fs.writeFileSync(
            filePackage,
            JSON.stringify(__package__, null, '  ') + '\n'
          );
        }
      });

      const watchOptions = {
        external: [
          ...external,
          ...Object.keys(BUILD_KEYS)
            .filter((v) => v !== key)
            .map((v) => toPosix(resolveExternals(key, v)))
        ],
        input,
        plugins,
        output
      };

      ROLLS.push(watchOptions);
    }

    watcher = rollup.watch(ROLLS);
    process.on('SIGTERM', watcher.close), process.on('exit', watcher.close);

    watcher.on('event', (event) => {
      verbose(event);
      // event.code can be one of:
      //   START        — the watcher is (re)starting
      //   BUNDLE_START — building an individual bundle
      //   BUNDLE_END   — finished building a bundle
      //   END          — finished building all bundles
      //   ERROR        — encountered an error while bundling

      if (event.code === 'BUNDLE_START') {
        verbose('\n');
        verbose(kleur.inverse(' ' + event.input + ' '));
      }

      if (event.code === 'BUNDLE_END') {
        verbose('--------------------------------------------------------');
      }

      if (event.code === 'END') {
        writeKeys = {};
        if (!argvWatch) watcher.close();
      }

      if (event.code === 'ERROR') {
        writeKeys = {};
        const text = ' Dester ERROR: ' + event.error + ' ';
        const bg = kleur.bgRed(
          [...Array(text.length)].map((v) => ' ').join('')
        );
        console.error('\n' + bg + '\n' + kleur.bgRed(text) + '\n' + bg);
        console.error(event);
        if (!argvWatch) watcher.close(), process.kill(0), process.exit(0);
      }
    });

    return watcher;
  };

  watcher = buildRollupFn();
  let last;
  const rebuildFn = (force) => (type, file) => {
    const l = type + file;

    if (last !== l) {
      last = l;
      verbose('\n');
      verbose(kleur.green().inverse(' ' + type + ': ' + file + ' '));
    }

    if (type !== 'change' || force) {
      if (watcher) watcher.close(), (watcher = null);
      setTimeout(() => (watcher = buildRollupFn()), 1000);
    }
  };
  if (argvWatch) {
    const chokidar = require('chokidar');
    chokidar.watch(argvInput).on('raw', rebuildFn());
    if (pkgFile) chokidar.watch(pkgFile).on('change', rebuildFn(true));
    if (tscFile) chokidar.watch(tscFile).on('change', rebuildFn(true));
  }
})();
