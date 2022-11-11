/* eslint-disable */
import e from "kleur";

import { createRequire as t } from "module";

import { spawnSync as s, spawn as o } from "child_process";

import { resolve as n, relative as r, join as i, dirname as l, parse as c } from "path";

import { existsSync as a, readFileSync as p, lstatSync as d, writeFileSync as m, readdirSync as u } from "fs";

import { VERSION as f, watch as g } from "rollup";

import b from "@rollup/plugin-commonjs";

import _ from "@rollup/plugin-node-resolve";

import { transformAsync as h, version as y } from "@babel/core";

import { minify as k } from "terser";

import { transform as x } from "sucrase";

import v from "minimist";

const {red: w, cyan: j, bold: D} = e, $ = j(D(`\n    ___       ${w("__")} _ ${w("_ _ _ /_,_")}  ${w("_______   ____")}\n   / _ \\_${w("(/(/(_(")}/ ${w("(-_)(-/_ _)")} ${w("/ ___/ /  /  _/")}\n  / _/ / -_/_ —/ __/ -_/ __/ ${w("/ /__/ /___/ /")}\n  \\___/\\__/___/\\__/\\__/_/    ${w("\\___/____/___/")}\n\n`)), N = "undefined" != typeof require ? require : t(import.meta.url), O = e.bgBlue(e.black(e.bold("tsc: ")));

const R = [].concat([ "$schema", "name", "displayName", "version" ], [ "private", "publishConfig" ], [ "description", "categories", "keywords", "license", "qna" ], [ "homepage", "bugs", "repository", "funding" ], [ "author", "maintainers", "contributors", "publisher" ], "sideEffects", "type", [ "proxy", "homepage" ], [ "flat", "resolutions", "workspaces" ], "bolt", "jsdelivr", "unpkg", [ "source", "umd:main" ], "jsnext:main", "main", "module", [ "types", "typesVersions", "typings" ], "files", "assets", [ "imports", "exports", "bin", "man", "directories" ], [ "browser", "esnext", "es2015", "esm", "module-browser", "modules.root" ], [ "engines", "engineStrict", "languageName", "os", "cpu" ], "preferGlobal", "example", "examplestyle", [ "binary", "scripts", "betterScripts", "capabilities", "activationEvents", "contributes", "husky", "simple-git-hooks", "commitlint", "lint-staged", "config", "nodemonConfig" ], [ "applypatch-msg", "pre-applypatch", "post-applypatch", "pre-commit", "pre-merge-commit", "prepare-commit-msg", "commit-msg", "post-commit", "pre-rebase", "post-checkout", "post-merge", "pre-push", "pre-receive", "update", "proc-receive", "post-receive", "post-update", "reference-transaction", "push-to-checkout", "pre-auto-gc", "post-rewrite", "sendemail-validate", "fsmonitor-watchman", "p4-changelist", "p4-prepare-changelist", "p4-post-changelist", "p4-pre-submit", "post-index-change" ], [ "flow", "flow:main" ], [ "browserify", "browserify.transform" ], "browserslist", "babel", "style", "xo", "prettier", [ "eslintConfig", "eslintIgnore" ], "npmpkgjsonlint", "remarkConfig", "stylelint", "ava", "jest", "mocha", "nyc", "tap", [ "react-native" ], [ "@std", "@std/esm" ], [ "jspm", "ignore", "format", "registry", "shim", "map" ], "size-limit", "pwmetrics", [ "peerDependencies", "peerDependenciesMeta", "optionalDependencies", "optionalDependenciesMeta", "bundledDependencies", "bundledDependenciesMeta", "bundleDependencies", "bundleDependenciesMeta", "devDependencies", "devDependenciesMeta", "dependencies", "dependenciesMeta" ], [ "extensionPack", "extensionDependencies", "icon", "badges", "galleryBanner", "preview", "markdown" ]);

function S(e) {
    return e.replace(/\\+/, "/");
}

function M(e) {
    const t = [], s = u(e, {
        withFileTypes: !0
    });
    for (let o, n, r = s.length; r-- > 0; ) o = s[r], /^[^._]/.test(o.name) && !/\.tests?($|\.)/i.test(o.name) && (n = i(e, o.name), 
    o.isDirectory() ? t.push(...M(n)) : /\.[mc]?[jt]s$/.test(o.name) && t.push(n));
    return t;
}

function C(t) {
    throw console.log(e.bgRed(e.black("ERROR: " + t))), process.kill(0), t;
}

console.clear();

const E = v(process.argv.slice(2), {
    default: {
        help: !1,
        dir: "",
        src: "src",
        out: "",
        types: "types",
        watch: !1,
        min: !1,
        ie: !1
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

!function() {
    if (console.log($), E.help) console.log("help"); else {
        if (console.log("rollup: v" + f), console.log("babel:  v" + y), console.log(""), 
        E.dir = n(E.dir), E.src = n(E.dir, E.src), E.out = n(E.dir, E.out), console.log(e.bgGreen(e.black(e.bold("dir: ") + E.dir))), 
        console.log(e.bgGreen(e.black(e.bold("src: ") + E.src))), console.log(e.bgGreen(e.black(e.bold("out: ") + E.out))), 
        console.log(""), !E.out.startsWith(E.dir)) return C("dir OUT must be in dir DIR");
        const v = n(E.dir, "package.json");
        if (!a(v)) return C("package.json not found in " + E.dir);
        let w, j, D;
        function t() {
            const e = JSON.parse(p(v, "utf8")), t = e.dependencies || {}, s = e.peerDependencies || {};
            var o;
            w = (o = [ ...Object.keys(t), ...Object.keys(s) ], o.filter(((e, t, s) => e && s.indexOf(e) === t)).sort()).map((e => new RegExp(`^${e}($|/|\\\\)`)));
        }
        if (console.log(e.bgMagenta(e.black(e.bold("package.json: ") + v))), console.log(""), 
        t(), E.types) {
            if ("string" != typeof E.types && (E.types = "types"), E.types = n(E.dir, E.types), 
            console.log(e.bgGreen(e.black(e.bold("types: ") + E.types))), !E.types.startsWith(E.dir)) return console.log(e.bgRed(e.black("ERROR:"))), 
            C("dir TYPES must be in dir DIR");
            if (j = function() {
                let t;
                try {
                    t = N.resolve(".bin/tsc"), console.log(O + e.bgBlue(e.black(t))), s(t, [ "-v" ], {
                        stdio: [ "ignore", "inherit", "inherit" ],
                        shell: !0
                    });
                } catch {
                    console.warn(O + e.bgRed(e.black("not found")));
                }
                return t;
            }()) {
                const J = o(j, [ ...E.watch ? [ "--watch" ] : [], "--target", "esnext", "--module", "esnext", "--moduleResolution", "node", "--allowJs", "--declaration", "--emitDeclarationOnly", "--esModuleInterop", "--resolveJsonModule", "--emitDecoratorMetadata", "--experimentalDecorators", "--allowSyntheticDefaultImports", "--rootDir", E.src, "--baseUrl", E.src, "--outDir", E.types, "--declarationDir", E.types ], {
                    cwd: E.src,
                    shell: !0
                });
                J.stdout.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgBlue(e.black("tsc: "))), console.dir(t);
                })), J.stderr.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgRed(e.black("tsc: "))), console.dir(t);
                }));
                const T = function() {
                    J.kill(0);
                };
                process.on("SIGTERM", T), process.on("exit", T);
            }
        }
        function u() {
            if (!D) {
                const e = M(E.src).map((function(e) {
                    const {dir: t, name: s} = c(r(E.src, e));
                    return {
                        id: e,
                        fileName: i(t, "index" === s ? s : i(s, "index"))
                    };
                }));
                D = e.sort((function(e, t) {
                    return e.fileName.localeCompare(t.fileName);
                }));
            }
        }
        console.log("");
        const I = {
            preset: "es5",
            arrowFunctions: !1,
            constBindings: !0,
            objectShorthand: !1,
            reservedNamesAsProps: !0,
            symbols: !1
        };
        let B, F = {};
        const G = g([ ".mjs", ".js" ].map((function(e, t) {
            return {
                output: {
                    exports: "named",
                    format: ".js" === e ? "commonjs" : "esm",
                    dir: E.out,
                    chunkFileNames: "_includes/[name]-[hash]" + e,
                    generatedCode: I
                },
                external: function(e, t) {
                    if (t) return /^\.?[/\\]|\\/.test(e) ? void 0 : w.some((t => t.test(e)));
                },
                plugins: [ {
                    name: "chunks",
                    buildStart() {
                        D || u(), t || (this.addWatchFile(E.src), this.addWatchFile(v));
                        for (let t = D.length; t-- > 0; ) this.emitFile({
                            type: "chunk",
                            id: D[t].id,
                            fileName: D[t].fileName + e,
                            preserveSignature: "strict",
                            generatedCode: I
                        });
                    }
                }, {
                    name: "sucrase-custom",
                    transform: (e, t) => /\.tsx?$/.test(t) ? x(e, {
                        transforms: [ "typescript" ]
                    }).code : null
                }, E.ie && (o = E.ie, {
                    name: "babel-custom",
                    transform: async e => ({
                        code: (await h(e, {
                            presets: [ [ "@babel/preset-env", {
                                corejs: 3,
                                loose: !0,
                                bugfixes: !0,
                                modules: !1,
                                useBuiltIns: "entry",
                                targets: "> 1%, not dead" + (o ? ", ie " + Math.max(9, +o || 11) : "")
                            } ] ],
                            plugins: [ "@babel/plugin-transform-runtime" ]
                        })).code
                    })
                }), _({
                    extensions: [ ".mjs", ".js", ".jsx", ".mts", ".ts", ".tsx", ".json" ]
                }), b(), (s = E.min, {
                    name: "terser-custom",
                    renderChunk: async e => ({
                        code: e = (await k(e, {
                            safari10: !0,
                            mangle: !0,
                            module: !0,
                            toplevel: !0,
                            compress: !0,
                            ...s ? {
                                keep_classnames: !1
                            } : {
                                keep_classnames: !0,
                                format: {
                                    beautify: !0
                                }
                            }
                        })).code
                    })
                }), {
                    renderChunk(e, s) {
                        if (!t) {
                            const {fileName: e, facadeModuleId: t} = s;
                            F[e] = t;
                        }
                        return "/* eslint-disable */\n" + e;
                    }
                } ]
            };
            var s, o;
        }))).on("change", (function(e, s) {
            e === v && t(), "update" !== s.event && (D = null, console.log(s.event + ": " + e));
        })).on("event", (function(t) {
            if ("END" === t.code) {
                E.watch ? console.log("\n...WATCH...\n") : G.close(), console.log("");
                const t = F;
                if (F = {}, B === (B = JSON.stringify(t))) return;
                const s = JSON.parse(p(v, "utf8"));
                delete s.main, delete s.module, delete s.types;
                const o = {};
                if (s.files) for (let e of s.files) e = r(E.dir, i(E.dir, e)), /^\.?[\\/]/.test(e) && C(e), 
                e = e.split(/[\\/]/)[0], o[e] = !0;
                const n = {};
                let c, u, f, g, b, _, h;
                for (const a in t) u = null, c = t[a], f = r(E.dir, i(E.out, a)), o[f.split(/[\\/]/)[0]] = !0, 
                c && (g = "./" + S(l(f)), (b = "index.mjs" === f) && (s.main = "index", s.module = "index.mjs", 
                g = "."), f = S(f), console.log(e.green("BUILD: " + r(E.src, c) + " => " + f)), 
                n[g] = {
                    import: "./" + f,
                    require: "./" + f.slice(0, -3) + "js"
                }, j && (u = r(E.dir, i(E.types, r(E.src, c))), u = S(u.replace(/\.([mc]?)[tj]s$/, ".d.$1ts")), 
                /\.d\.[mc]?ts$/.test(u) || C("type: " + u), b && (s.types = u), n[g].types = "./" + u));
                s.exports = {
                    "./package.json": "./package.json"
                };
                for (let e = Object.keys(n).sort(), r = 0; r < e.length; r++) s.exports[e[r]] = n[e[r]];
                s.files = [], j && (o[h = r(E.dir, E.types).split(/[\\/]/)[0]] = !0);
                for (let e in o) h && h === e ? s.files.push(e + "/**/*") : a(_ = i(E.dir, e)) && (
                //! FIX FOR NPM
                d(_).isDirectory() && (e += "/**/*"), s.files.push(e));
                s.files.sort();
                const y = function(e) {
                    const t = {}, s = Object.keys(e).sort();
                    return [ ...R, ...s ].filter((function(e, t, o) {
                        return s.indexOf(e) > -1 && t === o.indexOf(e);
                    })).forEach((function(s) {
                        t[s] = e[s];
                    })), t;
                }(s);
                m(v, JSON.stringify(y, null, 2));
            }
        }));
    }
}();
