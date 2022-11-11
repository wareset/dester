/* eslint-disable */
"use strict";

const kleur = require("kleur");

const module$1 = require("module");

const child_process = require("child_process");

const path = require("path");

const fs = require("fs");

const rollup = require("rollup");

const commonjs = require("@rollup/plugin-commonjs");

const resolve = require("@rollup/plugin-node-resolve");

const core = require("@babel/core");

const terser = require("terser");

const sucrase = require("sucrase");

const minimist = require("minimist");

const {red: red, cyan: cyan, bold: bold} = kleur;

const LOGO = cyan(bold(`\n    ___       ${red("__")} _ ${red("_ _ _ /_,_")}  ${red("_______   ____")}\n   / _ \\_${red("(/(/(_(")}/ ${red("(-_)(-/_ _)")} ${red("/ ___/ /  /  _/")}\n  / _/ / -_/_ —/ __/ -_/ __/ ${red("/ /__/ /___/ /")}\n  \\___/\\__/___/\\__/\\__/_/    ${red("\\___/____/___/")}\n\n`));

const REQUIRE = typeof require !== "undefined" ? require : module$1.createRequire(typeof document === "undefined" ? new (require("u" + "rl").URL)("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("index.js", document.baseURI).href);

const title = kleur.bgBlue(kleur.black(kleur.bold("tsc: ")));

function getTSC() {
    let e;
    try {
        e = REQUIRE.resolve(".bin/tsc");
        console.log(title + kleur.bgBlue(kleur.black(e)));
        child_process.spawnSync(e, [ "-v" ], {
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
    const s = Object.keys(e).sort();
    [ ...headList, ...s ].filter((function(e, t, r) {
        return s.indexOf(e) > -1 && t === r.indexOf(e);
    })).forEach((function(s) {
        t[s] = e[s];
    }));
    return t;
}

function babelPlugin(e) {
    return {
        name: "babel-custom",
        async transform(t) {
            const s = await core.transformAsync(t, {
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
                code: s.code
            };
        }
    };
}

function terserPlugin(e) {
    return {
        name: "terser-custom",
        async renderChunk(t) {
            t = (await terser.minify(t, {
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
            return /\.tsx?$/.test(t) ? sucrase.transform(e, {
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
    return e.filter(((e, t, s) => e && s.indexOf(e) === t)).sort();
}

function fixClearScreen(e) {
    return e.replace(/[\u001bc]/g, "").trim();
}

function getInputValidFiles(e) {
    const t = [];
    const s = fs.readdirSync(e, {
        withFileTypes: true
    });
    for (let r, n, o = s.length; o-- > 0; ) {
        r = s[o];
        if (/^[^._]/.test(r.name) && !/\.tests?($|\.)/i.test(r.name)) {
            n = path.join(e, r.name);
            if (r.isDirectory()) {
                t.push(...getInputValidFiles(n));
            } else if (/\.[mc]?[jt]s$/.test(r.name)) {
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
        minify: false,
        ie: false
    },
    number: [ "ie" ],
    string: [ "dir", "src", "out", "types" ],
    boolean: [ "help", "watch", "minify" ],
    alias: {
        h: "help",
        d: "dir",
        t: "types",
        w: "watch",
        m: "minify"
    }
});

(function() {
    console.log(LOGO);
    if (argv.help) {
        console.log("help");
    } else {
        console.log("rollup: v" + rollup.VERSION);
        console.log("babel:  v" + core.version);
        console.log("");
        argv.dir = path.resolve(argv.dir);
        argv.src = path.resolve(argv.dir, argv.src);
        argv.out = path.resolve(argv.dir, argv.out);
        console.log(kleur.bgGreen(kleur.black(kleur.bold("dir: ") + argv.dir)));
        console.log(kleur.bgGreen(kleur.black(kleur.bold("src: ") + argv.src)));
        console.log(kleur.bgGreen(kleur.black(kleur.bold("out: ") + argv.out)));
        console.log("");
        if (!argv.out.startsWith(argv.dir)) {
            return ERROR("dir OUT must be in dir DIR");
        }
        const e = path.resolve(argv.dir, "package.json");
        if (!fs.existsSync(e)) {
            return ERROR("package.json not found in " + argv.dir);
        }
        console.log(kleur.bgMagenta(kleur.black(kleur.bold("package.json: ") + e)));
        console.log("");
        let t;
        function s() {
            const s = JSON.parse(fs.readFileSync(e, "utf8"));
            const r = s.dependencies || {};
            const n = s.peerDependencies || {};
            t = unique([ ...Object.keys(r), ...Object.keys(n) ]).map((e => new RegExp(`^${e}($|/|\\\\)`)));
        }
        s();
        let r;
        if (argv.types) {
            if (typeof argv.types !== "string") argv.types = "types";
            argv.types = path.resolve(argv.dir, argv.types);
            console.log(kleur.bgGreen(kleur.black(kleur.bold("types: ") + argv.types)));
            if (!argv.types.startsWith(argv.dir)) {
                console.log(kleur.bgRed(kleur.black("ERROR:")));
                return ERROR("dir TYPES must be in dir DIR");
            }
            if (r = getTSC()) {
                const u = child_process.spawn(r, [ ...argv.watch ? [ "--watch" ] : [], ...[ "--target", "esnext" ], ...[ "--moduleResolution", "node" ], ...[ "--module", "esnext" ], "--allowJs", "--declaration", "--emitDeclarationOnly", "--esModuleInterop", "--resolveJsonModule", "--emitDecoratorMetadata", "--experimentalDecorators", "--allowSyntheticDefaultImports", ...[ "--rootDir", argv.src ], ...[ "--baseUrl", argv.src ], ...[ "--declarationDir", argv.types ] ], {
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
        let n;
        function o() {
            if (!n) {
                const e = getInputValidFiles(argv.src).map((function(e) {
                    const {dir: t, name: s} = path.parse(path.relative(argv.src, e));
                    const r = path.join(t, s === "index" ? s : path.join(s, "index"));
                    return {
                        id: e,
                        fileName: r
                    };
                }));
                n = e.sort((function(e, t) {
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
        const c = rollup.watch([ ".mjs", ".js" ].map((function(s, r) {
            return {
                output: {
                    exports: "named",
                    format: s === ".js" ? "commonjs" : "esm",
                    dir: argv.out,
                    chunkFileNames: "_includes/[name]-[hash]" + s,
                    generatedCode: i
                },
                external: function(e, s) {
                    if (s) {
                        if (/^\.?[/\\]|\\/.test(e)) return void 0; else return t.some((t => t.test(e)));
                    }
                },
                plugins: [ function() {
                    return {
                        name: "chunks",
                        buildStart() {
                            n || o();
                            if (!r) {
                                this.addWatchFile(argv.src);
                                this.addWatchFile(e);
                            }
                            for (let e = n.length; e-- > 0; ) {
                                this.emitFile({
                                    type: "chunk",
                                    id: n[e].id,
                                    fileName: n[e].fileName + s,
                                    preserveSignature: "strict",
                                    generatedCode: i
                                });
                            }
                        }
                    };
                }(), sucrasePlugin(), argv.ie && babelPlugin(argv.ie), resolve({
                    extensions: [ ".mjs", ".js", ".jsx", ".mts", ".ts", ".tsx", ".json" ]
                }), commonjs(), terserPlugin(argv.minify), {
                    renderChunk(e, t) {
                        if (!r) {
                            const {fileName: e, facadeModuleId: s} = t;
                            l[e] = s;
                        }
                        return "/* eslint-disable */\n" + e;
                    }
                } ]
            };
        }))).on("change", (function(t, r) {
            if (t === e) s();
            if (r.event !== "update") {
                n = null;
                console.log(r.event + ": " + t);
            }
        })).on("event", (function(t) {
            if (t.code === "END") {
                if (!argv.watch) c.close(); else console.log("\n...WATCH...\n");
                console.log("");
                const t = l;
                l = {};
                if (a === (a = JSON.stringify(t))) return;
                const s = JSON.parse(fs.readFileSync(e, "utf8"));
                delete s.main;
                delete s.module;
                delete s.types;
                const n = {};
                if (s.files) {
                    for (let e of s.files) {
                        e = path.relative(argv.dir, path.join(argv.dir, e));
                        if (/^\.?[\\/]/.test(e)) ERROR(e);
                        e = e.split(/[\\/]/)[0];
                        n[e] = true;
                    }
                }
                const o = {};
                let i, u, p, d, g;
                for (const e in t) {
                    u = null;
                    i = t[e];
                    p = path.relative(argv.dir, path.join(argv.out, e));
                    n[p.split(/[\\/]/)[0]] = true;
                    if (i) {
                        d = "./" + toPosix(path.dirname(p));
                        if (g = p === "index.mjs") {
                            s.main = "index", s.module = "index.mjs";
                            d = ".";
                        }
                        p = toPosix(p);
                        console.log(kleur.green("BUILD: " + path.relative(argv.src, i) + " => " + p));
                        o[d] = {
                            import: "./" + p,
                            require: "./" + p.slice(0, -3) + "js"
                        };
                        if (r) {
                            u = path.relative(argv.dir, path.join(argv.types, path.relative(argv.src, i)));
                            u = toPosix(u.replace(/\.([mc]?)[tj]s$/, ".d.$1ts"));
                            if (!/\.d\.[mc]?ts$/.test(u)) ERROR("type: " + u);
                            if (g) s.types = u;
                            o[d].types = "./" + u;
                        }
                    }
                }
                s.exports = {
                    "./package.json": "./package.json"
                };
                for (let e = Object.keys(o).sort(), r = 0; r < e.length; r++) {
                    s.exports[e[r]] = o[e[r]];
                }
                s.files = [];
                let f;
                if (r) n[path.relative(argv.dir, argv.types).split(/[\\/]/)[0]] = true;
                for (let e in n) {
                    if (fs.existsSync(f = path.join(argv.dir, e))) {
                        //! FIX FOR NPM
                        if (fs.lstatSync(f).isDirectory()) e += "/**/*";
                        s.files.push(e);
                    }
                }
                s.files.sort();
                const m = sort_pkg_json(s);
                fs.writeFileSync(e, JSON.stringify(m, null, 2));
            }
        }));
    }
})();
