import { concat, keys } from '../ws-utils';

// https://github.com/stereobooster/package.json
// https://docs.npmjs.com/cli/v7/configuring-npm/package-json#files
// https://github.com/keithamus/sort-package-json/blob/master/tests/snapshots/main.js.md
const essentials = ['$schema', 'name', 'displayName', 'version'];
const info = ['description', 'categories', 'keywords', 'license', 'qna'];
const links = ['homepage', 'bugs', 'repository', 'funding'];
const maintainers = ['author', 'maintainers', 'contributors', 'publisher'];
const files = [
    'imports',
    'exports',
    'bin',
    'man',
    'directories'
    // 'files'
    // 'main'
];
const tasks = [
    'binary',
    'scripts',
    'betterScripts',
    'capabilities',
    'activationEvents',
    'contributes',
    'husky',
    'simple-git-hooks',
    'commitlint',
    'lint-staged',
    'config',
    'nodemonConfig'
];
const gitHooks = [
    'applypatch-msg',
    'pre-applypatch',
    'post-applypatch',
    'pre-commit',
    'pre-merge-commit',
    'prepare-commit-msg',
    'commit-msg',
    'post-commit',
    'pre-rebase',
    'post-checkout',
    'post-merge',
    'pre-push',
    'pre-receive',
    'update',
    'proc-receive',
    'post-receive',
    'post-update',
    'reference-transaction',
    'push-to-checkout',
    'pre-auto-gc',
    'post-rewrite',
    'sendemail-validate',
    'fsmonitor-watchman',
    'p4-changelist',
    'p4-prepare-changelist',
    'p4-post-changelist',
    'p4-pre-submit',
    'post-index-change'
];
const dependencies = [
    'peerDependencies',
    'peerDependenciesMeta',
    'optionalDependencies',
    'optionalDependenciesMeta',
    'bundledDependencies',
    'bundledDependenciesMeta',
    'bundleDependencies',
    'bundleDependenciesMeta',
    'devDependencies',
    'devDependenciesMeta',
    'dependencies',
    'dependenciesMeta'
];
const system = ['engines', 'engineStrict', 'languageName', 'os', 'cpu'];
const publishing = ['private', 'publishConfig'];
const yarn = ['flat', 'resolutions', 'workspaces'];
const types = ['types', 'typesVersions', 'typings'];
const flow = ['flow', 'flow:main'];
const packageBundlers = [
    // 'module',
    'browser',
    'esnext',
    'es2015',
    'esm',
    'module-browser',
    'modules.root'
    // 'jsnext:main'
];
const metro = ['react-native'];
const microbundle = ['source', 'umd:main'];
const stdEsm = ['@std', '@std/esm'];
const jspm = ['jspm', 'ignore', 'format', 'registry', 'shim', 'map'];
const browserify = ['browserify', 'browserify.transform'];
const createReactApp = ['proxy', 'homepage'];
const eslint = ['eslintConfig', 'eslintIgnore'];
const vscode = [
    'extensionPack',
    'extensionDependencies',
    'icon',
    'badges',
    'galleryBanner',
    'preview',
    'markdown'
];
const headList = concat(essentials, publishing, info, links, maintainers, 'sideEffects', 'type', createReactApp, yarn, 'bolt', 'jsdelivr', 'unpkg', microbundle, 'jsnext:main', 'main', 'module', types, 'files', 'assets', files, packageBundlers, system, 'preferGlobal', 'example', 'examplestyle', tasks, gitHooks, flow, browserify, 'browserslist', 'babel', 'style', 'xo', 'prettier', eslint, 'npmpkgjsonlint', 'remarkConfig', 'stylelint', 'ava', 'jest', 'mocha', 'nyc', 'tap', metro, stdEsm, jspm, 'size-limit', 'pwmetrics', dependencies, vscode);
const sortPackageJson = (obj) => {
    const res = {};
    // const arrOrigin = keys(obj).sort().reverse()
    // let arr = unique([...dependencies, ...arrOrigin]).reverse()
    // arr = unique([...headList, ...arr], (v) => includes(arrOrigin, v))
    const arr = keys(obj).sort();
    [...headList, ...arr]
        .filter((v, k, a) => arr.indexOf(v) > -1 && k === a.indexOf(v))
        .forEach((v) => {
        res[v] = obj[v];
    });
    return res;
};

export { sortPackageJson as default };
