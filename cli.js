const fs = require('fs');
const path = require('path');
const kleur = require('kleur');
const argv = require('minimist')(process.argv.slice(2), {
  default: { tsc: true, pkg: true },
  string: ['input', 'output', 'pkg', 'tsc'],
  boolean: ['help', 'version', 'watch'],
  alias: {
    h: 'help',
    v: 'version',
    i: 'input',
    o: 'output',
    w: 'watch'
  }
  // '--': true,
  // stopEarly: true, /* populate _ with first non-option */
  // unknown: function () { ... } /* invoked on unknown param */
});

// console.log(argv);

const rollup = require('rollup');

const rollupPluginCommonjs = require('@rollup/plugin-commonjs')({
  extensions: ['.mjs', '.cjs', '.js', '.ts', '.tsx']
});
const rollupPluginJson = require('@rollup/plugin-json')();
const rollupPluginSucrase = require('@rollup/plugin-sucrase')({
  transforms: ['typescript']
});
let rollupPluginTypescript;

let input = argv.input || argv._[0] || 'src';
let output =
  argv.output ||
  argv._[1] ||
  (argv._[0] && input !== argv._[0] ? argv._[0] : 'dist');

input = path.resolve(input);
output = path.resolve(output);

let pkgFile, tscFile;

let destructor;
const DESTER = () => {
  let DESTRUCTOR = () => { };
  if (destructor) return destructor;

  if (argv.version || argv.help) {
    const red = v => kleur.red(v);
    console.log(
      kleur.cyan().bold(`
   ___       ${red('__')} _ ${red('_ _ _ /_,_')}  ${red('_______   ____')}
  / _ \\_${red('(/(/(_(')}/ ${red('(-_)(-/_ _)')} ${red('/ ___/ /  /  _/')}
 / _/ / -_/_ —/ __/ -_/ __/ ${red('/ /__/ /___/ /')}
/____/\\__/___/\\__/\\__/_/    ${red('\\___/____/___/')}
    `)
    );

    //     console.log(
    //       `
    //     ___       __ _ _ _ _ /_,_
    //    / _ \\_(/(/(_(/ (-_)(-/_ _)
    //   / _/ / -_/_ —/ __/ -_/ __/
    //  /____/\\__/___/\\__/\\__/_/
    // `
    //     );
    const { name, version, description } = require('./package.json');
    console.log(name);
    console.log(version);
    console.log(description);

    if (argv.help) {
      console.log('\nArguments:');
      console.log('  dester [input] [output]');
      console.log('  -i, --input  -  Input folder. Default: "src"');
      console.log('  -o, --output  -  Output folder. Default: "dist"');
      console.log('  -w, --watch  -  Watch files. Default: false');
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

  console.log(kleur.cyan().inverse(' inputDirectory: \n    ' + input + ' '));
  console.log(kleur.cyan().inverse(' outputDirectory: \n    ' + output + ' '));
  console.log('');

  let pkg = argv.pkg;
  try {
    pkg = JSON.parse(pkg);
  } catch (err) {
    /* */
  }
  if (pkg === true || pkg === '' || pkg === 'auto') {
    (() => {
      pkg = '';
      let dir = input;
      let lastDir;
      do {
        lastDir = dir;
        try {
          pkg = require.resolve(path.resolve(dir, 'package.json'));
        } catch (err) {
          /* */
        }
        dir = path.dirname(dir);
      } while (lastDir !== dir && !pkg);
    })();
  } else if (typeof pkg === 'string') {
    pkg = path.resolve(argv.pkg);
    if (!path.extname(pkg)) pkg = path.resolve(pkg, 'package.json');
  } else pkg = false;
  if (pkg) pkgFile = require.resolve(pkg), pkg = require(pkg);

  let tsc = argv.tsc;
  try {
    tsc = JSON.parse(tsc);
  } catch (err) {
    /* */
  }
  if (tsc === true || tsc === '' || tsc === 'auto') {
    (() => {
      tsc = '';
      let dir = input;
      let lastDir;
      do {
        lastDir = dir;
        try {
          tsc = require.resolve(path.resolve(dir, 'tsconfig.json'));
        } catch (err) {
          /* */
        }
        dir = path.dirname(dir);
      } while (lastDir !== dir && !tsc);
    })();
  } else if (typeof tsc === 'string') {
    tsc = path.resolve(argv.tsc);
    if (!path.extname(tsc)) tsc = path.resolve(tsc, 'tsconfig.json');
  } else tsc = false;
  if (tsc) tscFile = require.resolve(tsc);

  console.log(kleur.cyan().inverse(' pkgFile: \n    ' + pkgFile + ' '));
  console.log(kleur.cyan().inverse(' tscFile: \n    ' + tscFile + ' '));


  const BUILD_KEYS = {};
  const findBuilders = (input, output) => {
    const files = fs.readdirSync(input, { withFileTypes: true });
    // console.log(files);

    const isIndex = [...files].some(dirent => {
      if (
        dirent.isFile() &&
        path.parse(dirent.name).name === 'index' &&
        !(output in BUILD_KEYS)
      ) {
        BUILD_KEYS[output] = {
          name: dirent.name,
          input: path.resolve(input, dirent.name),
          output: [
            { file: path.resolve(output, 'index.mjs'), format: 'esm' },
            { file: path.resolve(output, 'index.js'), format: 'cjs' }
          ]
        };
        return true;
      }
    });

    let name, key;
    for (const dirent of files) {
      name = dirent.name;
      if (name[0] === '_') continue;
      if (dirent.isDirectory()) {
        findBuilders(path.resolve(input, name), path.resolve(output, name));
      } else if (!isIndex && dirent.isFile()) {
        name = path.parse(name).name;
        key = path.resolve(output, name);
        // continue;
        if (!(key in BUILD_KEYS)) {
          BUILD_KEYS[key] = {
            name: dirent.name,
            input: path.resolve(input, dirent.name),
            output: [
              { file: path.resolve(output, name, 'index.mjs'), format: 'esm' },
              { file: path.resolve(output, name, 'index.js'), format: 'cjs' }
            ]
          };
        }
      }
      // console.log(dirent);
    }
  };

  findBuilders(input, output);
  // console.log('BUILD_KEYS', BUILD_KEYS);

  const external = [].concat(
    Object.keys(process.binding('natives')),
    pkg ? Object.keys(pkg.dependencies || {}) : [],
    pkg ? Object.keys(pkg.peerDependencies || {}) : []
  );

  // console.log('external', external);

  const startsWith = (s, text, pos = 0) => s.indexOf(text, pos) === pos;
  const resolveExternals = (key, v) => {
    let res = v !== undefined ? path.relative(key, v) : key;
    if (!startsWith(res, '/') && !startsWith(res, '..')) res = './' + res;
    return res;
  };

  const __types__ = path.resolve(output, '__types__');

  if (
    tsc &&
    !rollupPluginTypescript &&
    Object.keys(BUILD_KEYS).some(v =>
      startsWith(path.parse(BUILD_KEYS[v].input).ext, '.ts')
    )
  ) {
    if (!rollupPluginTypescript) {
      rollupPluginTypescript = require('rollup-plugin-typescript2')({
        tsconfig: tsc,
        tsconfigOverride: { compilerOptions: { declaration: false } }
      });
    }

    (() => {
      let cliTS = 'tsc';
      try {
        cliTS = require.resolve('.bin/tsc');
      } catch (err) {
        /* */
      }

      let ts;
      function toExit() {
        if (ts) ts.kill(0);
      }

      try {
        ts = require('child_process').spawn(
          cliTS,
          [
            ...(tsc ? ['--project', tsc] : []),
            '--rootDir',
            input,
            argv.watch ? '--watch' : '',
            '--emitDeclarationOnly',
            '--declarationDir',
            __types__,
            '--resolveJsonModule',
            '--declaration'
          ],
          {
            stdio: ['ignore', 'inherit', 'inherit'],
            shell: true
          }
        );

        process.on('SIGTERM', toExit);
        process.on('exit', toExit);
        // const DESTRUCTOR_ORIGIN = DESTRUCTOR;
        // DESTRUCTOR = () => {
        //   DESTRUCTOR_ORIGIN(), toExit();
        // };
      } catch (err) {
        /* */
      }
    })();
  }

  (() => {
    const ROLLS = [];
    for (const key of Object.keys(BUILD_KEYS)) {
      const data = BUILD_KEYS[key];
      const isTS = startsWith(path.parse(data.input).ext, '.ts');
      const plugins = [];
      if (rollupPluginTypescript) plugins.push(rollupPluginTypescript);
      plugins.push(rollupPluginSucrase, rollupPluginCommonjs, rollupPluginJson);

      const inputOptions = {
        external: [
          ...external,
          ...Object.keys(BUILD_KEYS)
            .filter(v => v !== key)
            .map(v => resolveExternals(key, v))
        ],
        input: data.input,
        plugins
      };

      const filePackage = path.resolve(key, 'package.json');

      plugins.push({
        writeBundle() {
          let __package__ = {};
          if (fs.existsSync(filePackage)) {
            __package__ = JSON.parse(fs.readFileSync(filePackage).toString());
          }
          (__package__.main = './index'), (__package__.module = './index.mjs');
          delete __package__.types;

          if (isTS && tsc) {
            __package__.types = './index.d.ts';

            const importPath = resolveExternals(
              path.join(
                resolveExternals(key, __types__),
                resolveExternals(output, key)
              )
            );

            fs.writeFileSync(
              path.resolve(key, 'index.d.ts'),
              `export * from '${importPath}';`
            );
          }

          fs.writeFileSync(
            filePackage,
            JSON.stringify(__package__, null, '  ')
          );
        }
      });

      const watchOptions = { ...inputOptions, output: data.output };
      ROLLS.push(watchOptions);
    }

    const watcher = rollup.watch(ROLLS);
    process.on('SIGTERM', watcher.close);
    process.on('exit', watcher.close);

    const DESTRUCTOR_ORIGIN = DESTRUCTOR;
    DESTRUCTOR = () => {
      DESTRUCTOR_ORIGIN(), watcher.close();
    };

    watcher.on('event', event => {
      // console.log(event, watcher);
      // event.code can be one of:
      //   START        — the watcher is (re)starting
      //   BUNDLE_START — building an individual bundle
      //   BUNDLE_END   — finished building a bundle
      //   END          — finished building all bundles
      //   ERROR        — encountered an error while bundling

      if (event.code === 'BUNDLE_START') {
        console.log('\n');
        console.log(kleur.inverse(' ' + event.input + ' '));
      }

      if (event.code === 'BUNDLE_END') {
        console.log('--------------------------------------------------------');
      }

      if (event.code === 'END' && !argv.watch) {
        watcher.close();
      }

      if (event.code === 'ERROR') {
        console.error(event);
        if (!argv.watch) {
          watcher.close();
          process.kill(0);
          process.exit(0);
        }
      }
    });
  })();

  return DESTRUCTOR;
};

destructor = DESTER();
const redester = force => (type, file) => {
  console.log('\n');
  console.log(kleur.red().inverse(' ' + type + ': ' + file + ' '));
  if (type === 'rename' || force) {
    if (destructor) destructor(), destructor = null;
    setTimeout(() => (destructor = DESTER()), 1000);
  }
};
if (argv.watch) {
  fs.watch(input, redester());
  if (pkgFile) fs.watch(pkgFile, redester(true));
  if (tscFile) fs.watch(tscFile, redester(true));
}
