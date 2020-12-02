const fs = require('fs');
const path = require('path');

const SEP = path.sep;

// prettier-ignore
const hash = (s) => (s.replace(/\r/g, '').split('').reduce((a, b) =>
  (a = (a << 5) - a + b.charCodeAt(0)), 0) >>> 0).toString(36);
const startsWith = (s, text, pos = 0) => s.indexOf(text, pos) === pos;
const resolveExternals = (key, v) => {
  let res = v !== undefined ? path.relative(key, v) : key;
  if (!startsWith(res, SEP) && !startsWith(res, '..')) res = '.' + SEP + res;
  return res;
};

// const parseJSON = (str) => JSON.parse(str.replace(/^\s*\/\/.*/gm, ''));

// const __jsonSpliter__ = split(null, /(\0)/, /\/\*/, /\*\//, true, true);
// const jsonNormalize = (data) => {
//   return __jsonSpliter__(
//     data.replace(/(\/\*|\/\/)|(\*\/|$)/gm, (__, c, a) =>
//       c ? `\0${c}` : `${a}\0`
//     )
//   )
//     .filter((v) => v.trim() && v[0] !== '/')
//     .join('')
//     .replace(/\0/g, '');
// };

const kleur = require('kleur');
const argv = require('minimist')(process.argv.slice(2), {
  default: {
    tsc: true,
    pkg: true,
    types: true,
    sourcemap: false,
    silent: false
  },
  string: ['input', 'output', 'pkg', 'tsc'],
  boolean: ['help', 'version', 'watch', 'types', 'sourcemap', 'silent'],
  alias: {
    h: 'help',
    v: 'version',
    i: 'input',
    o: 'output',
    t: 'types',
    w: 'watch',
    s: 'silent'
  }
  // '--': true,
  // stopEarly: true, /* populate _ with first non-option */
  // unknown: function () { ... } /* invoked on unknown param */
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
      // interop: 'esModule',
      sourcemap: argvSourcemap
    },
    {
      file: path.resolve(output, name, 'index.js'),
      format: 'cjs',
      exports: 'named',
      // interop: 'esModule',
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
      console.log('\nArguments:');
      console.log('  dester [input] [output]');
      console.log('  -i, --input  -  Input folder. Default: "src"');
      console.log('  -o, --output  -  Output folder. Default: "dist"');
      console.log('  -t, --types  -  Create declarations. Default: true');
      console.log('  -w, --watch  -  Watch files. Default: false');
      console.log('  -s, --silent  -  Do not display messages. Default: false');
      console.log('  --sourcemap  -  Create SourceMap. Default: false');
      console.log('  --pkg  -  Path to package.json. Default: "auto"');
      console.log('  --tsc  -  Path to tsconfig.json. Default: "auto"');

      console.log('\nExamples:');
      console.log('  dester ./src ./dist');
      console.log('  dester ./src ./dist --pkg ./pakage.json');
      console.log('  dester ./src ./dist --no-pkg');
      console.log('  dester ./src ./dist --watch');
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
  const DIR_TYPES = path.resolve(DIR_OUTPUT, '__types__');

  const createTypesFn = () => {
    // console.log(process);
    const DIR_NODE_MODULES = require.main.paths[0];
    const DIR_CACHE = path.resolve(DIR_NODE_MODULES, '.cache');
    if (!fs.existsSync(DIR_CACHE)) fs.mkdirSync(DIR_CACHE);
    const DIR_CACHE_DESTER = path.resolve(DIR_CACHE, 'dester');
    if (!fs.existsSync(DIR_CACHE_DESTER)) fs.mkdirSync(DIR_CACHE_DESTER);
    const FILE_TSCONFIG = path.resolve(
      DIR_CACHE_DESTER,
      hash(DIR_INPUT + DIR_OUTPUT) + '.json'
    );

    const OBJ_TSCONFIG = {
      // Change this to match your project
      include: [path.join(DIR_INPUT, '/**/*')],

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
        outDir: DIR_TYPES,
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
    try { cliTS = require.resolve('.bin/tsc'); } catch (err) { /* */ }

    // prettier-ignore
    try {
      const tsFork = require('child_process').spawn(cliTS,
        ['--build', FILE_TSCONFIG, ...(argvWatch ? ['--watch'] : [])]
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
  if (argv.tsc !== false && argv.types) createTypesFn();

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

  let watcher;
  const buildRollupFn = () => {
    // if (watcher) watcher.close(), watcher = null;
    if (watcher) return watcher;

    const BUILD_KEYS = findExternalsFn(DIR_INPUT, DIR_OUTPUT);
    // console.log('BUILD_KEYS', BUILD_KEYS);

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

          const MAIN = './index';
          const INDEX = './index.js';
          const MODULE = './index.mjs';
          const TYPES = './index.d.ts';
          const __TYPES__ = './__types__';

          let __package__ = {};
          if (fs.existsSync(filePackage)) {
            __package__ = JSON.parse(fs.readFileSync(filePackage).toString());
          }
          (__package__.main = MAIN), (__package__.module = MODULE);

          const files = (__package__.files || ['edewd']).filter((v) => {
            if ([INDEX, MODULE, TYPES, __TYPES__].indexOf(v) >= 0) return false;
            return fs.existsSync(path.resolve(key, v));
          });
          files.push(INDEX, MODULE);

          if (argv.tsc !== false && argv.types) {
            __package__.types = TYPES;
            const importPath = resolveExternals(
              path.join(
                resolveExternals(key, DIR_TYPES),
                resolveExternals(DIR_OUTPUT, key)
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
            if (path.resolve(DIR_OUTPUT) === path.resolve(key)) {
              files.push(__TYPES__);
            }

            // let text = `export * from '${importPath}';\n`;
            //             if (~exports.indexOf('default')) {
            //               text += `import __default__ from '${importPath}';
            // export { __default__ as default };\n`;
            //             }

            fs.writeFileSync(path.resolve(key, 'index.d.ts'), text);
          } else delete __package__.types;

          const datafiles = Object.keys(BUILD_KEYS)
            .map((v) => {
              v = v.indexOf(key) === 0 ? v.slice(key.length + 1) : '';
              return !v ? '' : './' + v.split(SEP)[0];
            })
            .filter((v, k, a) => v && a.indexOf(v) === k);

          __package__.files = [...files, ...datafiles];
          __package__.files.sort();

          fs.writeFileSync(
            filePackage,
            JSON.stringify(__package__, null, '  ')
          );
        }
      });

      const watchOptions = {
        external: [
          ...external,
          ...Object.keys(BUILD_KEYS)
            .filter((v) => v !== key)
            .map((v) => resolveExternals(key, v))
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
