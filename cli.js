const fs = require('fs');
const path = require('path');
const kleur = require('kleur');
const argv = require('minimist')(process.argv.slice(2), {
  default: { external: true, tsc: true },
  string: ['input', 'output', 'pkg'],
  boolean: ['external', 'watch', 'tsc'],
  alias: {
    h: 'help',
    v: 'version',
    i: 'input',
    o: 'output',
    e: 'external',
    w: 'watch'
  }
  // '--': true,
  // stopEarly: true, /* populate _ with first non-option */
  // unknown: function () { ... } /* invoked on unknown param */
});

(() => {
  if (argv.version) {
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

    return;
  }

  // console.log(argv);

  let input = argv.input || argv._[0] || 'src';
  let output =
    argv.output ||
    argv._[1] ||
    (argv._[0] && input !== argv._[0] ? argv._[0] : 'dist');

  input = path.resolve(input);
  output = path.resolve(output);

  let external = !!argv.external;

  let pkg;
  if (argv.pkg) {
    pkg = path.resolve(argv.pkg);
    if (!path.extname(pkg)) pkg = path.resolve(pkg, 'package.json');
  }
  if (external && !pkg) {
    (() => {
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
  }
  if (pkg) pkg = require(pkg);

  // console.log('pkg', pkg);

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

  external = [].concat(
    Object.keys(process.binding('natives')),
    pkg ? Object.keys(pkg.dependencies || {}) : [],
    pkg ? Object.keys(pkg.peerDependencies || {}) : []
  );

  const rollupPluginJson = require('@rollup/plugin-json')();
  const rollupPluginSucrase = require('@rollup/plugin-sucrase')({
    transforms: ['typescript']
  });

  // console.log('external', external);

  const rollup = require('rollup');
  // console.log(rollup);

  const startsWith = (s, text, pos = 0) => s.indexOf(text, pos) === pos;
  const resolveExternals = (key, v) => {
    let res = v !== undefined ? path.relative(key, v) : key;
    if (!startsWith(res, '/') && !startsWith(res, '..')) res = './' + res;
    return res;
  };

  const __types__ = path.resolve(output, '__types__');

  if (
    argv.tsc &&
    Object.keys(BUILD_KEYS).some(v =>
      startsWith(path.parse(BUILD_KEYS[v].input).ext, '.ts')
    )
  ) {
    (() => {
      let tsc = 'tsc';
      try {
        tsc = require.resolve('.bin/tsc');
      } catch (err) {
        /* */
      }

      let ts;
      function toExit() {
        if (ts) ts.kill(0);
      }

      try {
        ts = require('child_process').spawn(
          tsc,
          [
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
      } catch (err) {
        /* */
      }
    })();
  }

  (() => {
    const ROLLS = [];
    let lastRollInput;
    for (const key of Object.keys(BUILD_KEYS)) {
      const data = BUILD_KEYS[key];
      lastRollInput = data.input;
      const isTS = path.parse(data.input).ext === '.ts';
      const plugins = [rollupPluginJson];
      if (isTS) plugins.push(rollupPluginSucrase);

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

          if (isTS && argv.tsc) {
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

    watcher.on('event', event => {
      // event.code can be one of:
      //   START        — the watcher is (re)starting
      //   BUNDLE_START — building an individual bundle
      //   BUNDLE_END   — finished building a bundle
      //   END          — finished building all bundles
      //   ERROR        — encountered an error while bundling
      if (event.code === 'BUNDLE_START') {
        console.log(kleur.cyan(event.input));
        return;
      }

      if (event.code === 'BUNDLE_END') {
        console.log('--------------------------------------------------------');
        if (!argv.watch && event.input === lastRollInput) watcher.close();
      }
    });
  })();
})();
