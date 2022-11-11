/* eslint-disable */
import kleur from "kleur";

import { createRequire } from "module";

import { spawnSync, spawn } from "child_process";

import { resolve, relative, join, dirname, parse } from "path";

import { existsSync, readFileSync, lstatSync, writeFileSync, readdirSync } from "fs";

import { VERSION, watch } from "rollup";

import commonjs from "@rollup/plugin-commonjs";

import resolve$1 from "@rollup/plugin-node-resolve";

import { transformAsync, version } from "@babel/core";

import { minify } from "terser";

import { transform } from "sucrase";

import minimist from "minimist";

const {red: red, cyan: cyan, bold: bold} = kleur;

const LOGO = cyan(bold(`\n    ___       ${red("__")} _ ${red("_ _ _ /_,_")}  ${red("_______   ____")}\n   / _ \\_${red("(/(/(_(")}/ ${red("(-_)(-/_ _)")} ${red("/ ___/ /  /  _/")}\n  / _/ / -_/_ —/ __/ -_/ __/ ${red("/ /__/ /___/ /")}\n  \\___/\\__/___/\\__/\\__/_/    ${red("\\___/____/___/")}\n\n`));

const REQUIRE = typeof require !== "undefined" ? require : createRequire(import.meta.url);

const title = kleur.bgBlue(kleur.black(kleur.bold("tsc: ")));

function getTSC() {
    let e;
    try {
        e = REQUIRE.resolve(".bin/tsc");
        console.log(title + kleur.bgBlue(kleur.black(e)));
        spawnSync(e, [ "-v" ], {
            stdio: [ "ignore", "inherit", "inherit" ],
            shell: true
        });
    } catch {
        console.warn(title + kleur.bgRed(kleur.black("not found")));
    }
    return e;
}

const essentials = [ "$schema", "name", "displayName", "version" ];

const info = [ "description", "categories", "keywords", "license", "qna" ];

const links = [ "homepage", "bugs", "repository", "funding" ];

const maintainers = [ "author", "maintainers", "contributors", "publisher" ];

const files = [ "imports", "exports", "bin", "man", "directories" ];

const tasks = [ "binary", "scripts", "betterScripts", "capabilities", "activationEvents", "contributes", "husky", "simple-git-hooks", "commitlint", "lint-staged", "config", "nodemonConfig" ];

const gitHooks = [ "applypatch-msg", "pre-applypatch", "post-applypatch", "pre-commit", "pre-merge-commit", "prepare-commit-msg", "commit-msg", "post-commit", "pre-rebase", "post-checkout", "post-merge", "pre-push", "pre-receive", "update", "proc-receive", "post-receive", "post-update", "reference-transaction", "push-to-checkout", "pre-auto-gc", "post-rewrite", "sendemail-validate", "fsmonitor-watchman", "p4-changelist", "p4-prepare-changelist", "p4-post-changelist", "p4-pre-submit", "post-index-change" ];

const dependencies = [ "peerDependencies", "peerDependenciesMeta", "optionalDependencies", "optionalDependenciesMeta", "bundledDependencies", "bundledDependenciesMeta", "bundleDependencies", "bundleDependenciesMeta", "devDependencies", "devDependenciesMeta", "dependencies", "dependenciesMeta" ];

const system = [ "engines", "engineStrict", "languageName", "os", "cpu" ];

const publishing = [ "private", "publishConfig" ];

const yarn = [ "flat", "resolutions", "workspaces" ];

const types = [ "types", "typesVersions", "typings" ];

const flow = [ "flow", "flow:main" ];

const packageBundlers = [ "browser", "esnext", "es2015", "esm", "module-browser", "modules.root" ];

const metro = [ "react-native" ];

const microbundle = [ "source", "umd:main" ];

const stdEsm = [ "@std", "@std/esm" ];

const jspm = [ "jspm", "ignore", "format", "registry", "shim", "map" ];

const browserify = [ "browserify", "browserify.transform" ];

const createReactApp = [ "proxy", "homepage" ];

const eslint = [ "eslintConfig", "eslintIgnore" ];

const vscode = [ "extensionPack", "extensionDependencies", "icon", "badges", "galleryBanner", "preview", "markdown" ];

const headList = [].concat(essentials, publishing, info, links, maintainers, "sideEffects", "type", createReactApp, yarn, "bolt", "jsdelivr", "unpkg", microbundle, "jsnext:main", "main", "module", types, "files", "assets", files, packageBundlers, system, "preferGlobal", "example", "examplestyle", tasks, gitHooks, flow, browserify, "browserslist", "babel", "style", "xo", "prettier", eslint, "npmpkgjsonlint", "remarkConfig", "stylelint", "ava", "jest", "mocha", "nyc", "tap", metro, stdEsm, jspm, "size-limit", "pwmetrics", dependencies, vscode);

function sort_pkg_json(e) {
    const t = {};
    const r = Object.keys(e).sort();
    [ ...headList, ...r ].filter((function(e, t, s) {
        return r.indexOf(e) > -1 && t === s.indexOf(e);
    })).forEach((function(r) {
        t[r] = e[r];
    }));
    return t;
}

function babelPlugin(e) {
    return {
        name: "babel-custom",
        async transform(t) {
            const r = await transformAsync(t, {
                presets: [ [ "@babel/preset-env", {
                    corejs: 3,
                    loose: true,
                    bugfixes: true,
                    modules: false,
                    useBuiltIns: "entry",
                    targets: "> 1%, not dead" + (e ? ", ie " + Math.max(9, +e || 11) : "")
                } ] ],
                plugins: [ "@babel/plugin-transform-runtime" ]
            });
            return {
                code: r.code
            };
        }
    };
}

function terserPlugin(e) {
    return {
        name: "terser-custom",
        async renderChunk(t) {
            t = (await minify(t, {
                safari10: true,
                mangle: true,
                ...e ? {
                    toplevel: true,
                    compress: true,
                    keep_classnames: false
                } : {
                    toplevel: false,
                    compress: false,
                    keep_classnames: true,
                    format: {
                        beautify: true
                    }
                }
            })).code;
            return {
                code: t
            };
        }
    };
}

function sucrasePlugin() {
    return {
        name: "sucrase-custom",
        transform(e, t) {
            return /\.tsx?$/.test(t) ? transform(e, {
                transforms: [ "typescript" ]
            }).code : null;
        }
    };
}

console.clear();

function toPosix(e) {
    return e.replace(/\\+/, "/");
}

function unique(e) {
    return e.filter(((e, t, r) => e && r.indexOf(e) === t)).sort();
}

function fixClearScreen(e) {
    return e.replace(/[\u001bc]/g, "").trim();
}

function getInputValidFiles(e) {
    const t = [];
    const r = readdirSync(e, {
        withFileTypes: true
    });
    for (let s, n, o = r.length; o-- > 0; ) {
        s = r[o];
        if (/^[^._]/.test(s.name) && !/\.tests?($|\.)/i.test(s.name)) {
            n = join(e, s.name);
            if (s.isDirectory()) {
                t.push(...getInputValidFiles(n));
            } else if (/\.[mc]?[jt]s$/.test(s.name)) {
                t.push(n);
            }
        }
    }
    return t;
}

function ERROR(e) {
    console.log(kleur.bgRed(kleur.black("ERROR: " + e)));
    process.kill(0);
    throw e;
}

const argv = minimist(process.argv.slice(2), {
    default: {
        help: false,
        dir: "",
        src: "src",
        out: "",
        types: "types",
        watch: false,
        min: false,
        ie: false
    },
    number: [ "ie" ],
    string: [ "dir", "src", "out", "types" ],
    boolean: [ "help", "watch", "min" ],
    alias: {
        h: "help",
        d: "dir",
        t: "types",
        w: "watch",
        m: "min"
    }
});

(function() {
    console.log(LOGO);
    if (argv.help) {
        console.log("help");
    } else {
        console.log("rollup: v" + VERSION);
        console.log("babel:  v" + version);
        console.log("");
        argv.dir = resolve(argv.dir);
        argv.src = resolve(argv.dir, argv.src);
        argv.out = resolve(argv.dir, argv.out);
        console.log(kleur.bgGreen(kleur.black(kleur.bold("dir: ") + argv.dir)));
        console.log(kleur.bgGreen(kleur.black(kleur.bold("src: ") + argv.src)));
        console.log(kleur.bgGreen(kleur.black(kleur.bold("out: ") + argv.out)));
        console.log("");
        if (!argv.out.startsWith(argv.dir)) {
            return ERROR("dir OUT must be in dir DIR");
        }
        const r = resolve(argv.dir, "package.json");
        if (!existsSync(r)) {
            return ERROR("package.json not found in " + argv.dir);
        }
        console.log(kleur.bgMagenta(kleur.black(kleur.bold("package.json: ") + r)));
        console.log("");
        let s;
        function e() {
            const e = JSON.parse(readFileSync(r, "utf8"));
            const t = e.dependencies || {};
            const n = e.peerDependencies || {};
            s = unique([ ...Object.keys(t), ...Object.keys(n) ]).map((e => new RegExp(`^${e}($|/|\\\\)`)));
        }
        e();
        let n;
        if (argv.types) {
            if (typeof argv.types !== "string") argv.types = "types";
            argv.types = resolve(argv.dir, argv.types);
            console.log(kleur.bgGreen(kleur.black(kleur.bold("types: ") + argv.types)));
            if (!argv.types.startsWith(argv.dir)) {
                console.log(kleur.bgRed(kleur.black("ERROR:")));
                return ERROR("dir TYPES must be in dir DIR");
            }
            if (n = getTSC()) {
                const u = spawn(n, [ ...argv.watch ? [ "--watch" ] : [], ...[ "--target", "esnext" ], ...[ "--moduleResolution", "node" ], ...[ "--module", "esnext" ], "--allowJs", "--declaration", "--emitDeclarationOnly", "--esModuleInterop", "--resolveJsonModule", "--emitDecoratorMetadata", "--experimentalDecorators", "--allowSyntheticDefaultImports", ...[ "--rootDir", argv.src ], ...[ "--baseUrl", argv.src ], ...[ "--declarationDir", argv.types ] ], {
                    shell: true
                });
                u.stdout.on("data", (function(e) {
                    e = fixClearScreen(e.toString());
                    if (e) console.log("\n" + kleur.bgBlue(kleur.black("tsc: ")), e);
                }));
                u.stderr.on("data", (function(e) {
                    e = fixClearScreen(e.toString());
                    if (e) console.log("\n" + kleur.bgRed(kleur.black("tsc: ")), e);
                }));
                const p = function() {
                    u.kill(0);
                };
                process.on("SIGTERM", p);
                process.on("exit", p);
            }
        }
        console.log("");
        let o;
        function t() {
            if (!o) {
                const e = getInputValidFiles(argv.src).map((function(e) {
                    const {dir: t, name: r} = parse(relative(argv.src, e));
                    const s = join(t, r === "index" ? r : join(r, "index"));
                    return {
                        id: e,
                        fileName: s
                    };
                }));
                o = e.sort((function(e, t) {
                    return e.fileName.localeCompare(t.fileName);
                }));
            }
        }
        const i = {
            preset: "es5",
            arrowFunctions: false,
            constBindings: true,
            objectShorthand: false,
            reservedNamesAsProps: true,
            symbols: false
        };
        let l = {}, a;
        const c = watch([ ".mjs", ".js" ].map((function(e, n) {
            return {
                output: {
                    exports: "named",
                    format: e === ".js" ? "commonjs" : "esm",
                    dir: argv.out,
                    chunkFileNames: "_includes/[name]-[hash]" + e,
                    generatedCode: i
                },
                external: function(e, t) {
                    if (t) {
                        if (/^\.?[/\\]|\\/.test(e)) return void 0; else return s.some((t => t.test(e)));
                    }
                },
                plugins: [ function() {
                    return {
                        name: "chunks",
                        buildStart() {
                            o || t();
                            if (!n) {
                                this.addWatchFile(argv.src);
                                this.addWatchFile(r);
                            }
                            for (let t = o.length; t-- > 0; ) {
                                this.emitFile({
                                    type: "chunk",
                                    id: o[t].id,
                                    fileName: o[t].fileName + e,
                                    preserveSignature: "strict",
                                    generatedCode: i
                                });
                            }
                        }
                    };
                }(), sucrasePlugin(), argv.ie && babelPlugin(argv.ie), resolve$1({
                    extensions: [ ".mjs", ".js", ".jsx", ".mts", ".ts", ".tsx", ".json" ]
                }), commonjs(), terserPlugin(argv.min), {
                    renderChunk(e, t) {
                        if (!n) {
                            const {fileName: e, facadeModuleId: r} = t;
                            l[e] = r;
                        }
                        return "/* eslint-disable */\n" + e;
                    }
                } ]
            };
        }))).on("change", (function(t, s) {
            if (t === r) e();
            if (s.event !== "update") {
                o = null;
                console.log(s.event + ": " + t);
            }
        })).on("event", (function(e) {
            if (e.code === "END") {
                if (!argv.watch) c.close(); else console.log("\n...WATCH...\n");
                console.log("");
                const e = l;
                l = {};
                if (a === (a = JSON.stringify(e))) return;
                const t = JSON.parse(readFileSync(r, "utf8"));
                delete t.main;
                delete t.module;
                delete t.types;
                const s = {};
                if (t.files) {
                    for (let e of t.files) {
                        e = relative(argv.dir, join(argv.dir, e));
                        if (/^\.?[\\/]/.test(e)) ERROR(e);
                        e = e.split(/[\\/]/)[0];
                        s[e] = true;
                    }
                }
                const o = {};
                let i, u, p, d, m;
                for (const r in e) {
                    u = null;
                    i = e[r];
                    p = relative(argv.dir, join(argv.out, r));
                    s[p.split(/[\\/]/)[0]] = true;
                    if (i) {
                        d = "./" + toPosix(dirname(p));
                        if (m = p === "index.mjs") {
                            t.main = "index", t.module = "index.mjs";
                            d = ".";
                        }
                        p = toPosix(p);
                        console.log(kleur.green("BUILD: " + relative(argv.src, i) + " => " + p));
                        o[d] = {
                            import: "./" + p,
                            require: "./" + p.slice(0, -3) + "js"
                        };
                        if (n) {
                            u = relative(argv.dir, join(argv.types, relative(argv.src, i)));
                            u = toPosix(u.replace(/\.([mc]?)[tj]s$/, ".d.$1ts"));
                            if (!/\.d\.[mc]?ts$/.test(u)) ERROR("type: " + u);
                            if (m) t.types = u;
                            o[d].types = "./" + u;
                        }
                    }
                }
                t.exports = {
                    "./package.json": "./package.json"
                };
                for (let r = Object.keys(o).sort(), n = 0; n < r.length; n++) {
                    t.exports[r[n]] = o[r[n]];
                }
                t.files = [];
                let g;
                if (n) s[relative(argv.dir, argv.types).split(/[\\/]/)[0]] = true;
                for (let r in s) {
                    if (existsSync(g = join(argv.dir, r))) {
                        //! FIX FOR NPM
                        if (lstatSync(g).isDirectory()) r += "/**/*";
                        t.files.push(r);
                    }
                }
                t.files.sort();
                const f = sort_pkg_json(t);
                writeFileSync(r, JSON.stringify(f, null, 2));
            }
        }));
    }
})();
