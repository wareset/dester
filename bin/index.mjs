/* eslint-disable */
import e from "kleur";

import { resolve as t, relative as s, join as o, dirname as n, parse as r } from "path";

import { existsSync as i, writeFileSync as l, readFileSync as c, lstatSync as a, readdirSync as p } from "fs";

import { createRequire as d } from "module";

import { spawn as m, spawnSync as u } from "child_process";

import { VERSION as f, watch as g } from "rollup";

import b from "@rollup/plugin-commonjs";

import _ from "@rollup/plugin-node-resolve";

import { transformAsync as h, version as y } from "@babel/core";

import { minify as k } from "terser";

import { transform as x } from "sucrase";

import j from "minimist";

const {red: v, cyan: w, bold: D} = e, N = w(D(`\n    ___       ${v("__")} _ ${v("_ _ _ /_,_")}  ${v("_______   ____")}\n   / _ \\_${v("(/(/(_(")}/ ${v("(-_)(-/_ _)")} ${v("/ ___/ /  /  _/")}\n  / _/ / -_/_ —/ __/ -_/ __/ ${v("/ /__/ /___/ /")}\n  \\___/\\__/___/\\__/\\__/_/    ${v("\\___/____/___/")}\n\n`)), O = [].concat([ "$schema", "name", "displayName", "version" ], [ "private", "publishConfig" ], [ "description", "categories", "keywords", "license", "qna" ], [ "homepage", "bugs", "repository", "funding" ], [ "author", "maintainers", "contributors", "publisher" ], "sideEffects", "type", [ "proxy", "homepage" ], [ "flat", "resolutions", "workspaces" ], "bolt", "jsdelivr", "unpkg", [ "source", "umd:main" ], "jsnext:main", "main", "module", [ "types", "typesVersions", "typings" ], "files", "assets", [ "imports", "exports", "bin", "man", "directories" ], [ "browser", "esnext", "es2015", "esm", "module-browser", "modules.root" ], [ "engines", "engineStrict", "languageName", "os", "cpu" ], "preferGlobal", "example", "examplestyle", [ "binary", "scripts", "betterScripts", "capabilities", "activationEvents", "contributes", "husky", "simple-git-hooks", "commitlint", "lint-staged", "config", "nodemonConfig" ], [ "applypatch-msg", "pre-applypatch", "post-applypatch", "pre-commit", "pre-merge-commit", "prepare-commit-msg", "commit-msg", "post-commit", "pre-rebase", "post-checkout", "post-merge", "pre-push", "pre-receive", "update", "proc-receive", "post-receive", "post-update", "reference-transaction", "push-to-checkout", "pre-auto-gc", "post-rewrite", "sendemail-validate", "fsmonitor-watchman", "p4-changelist", "p4-prepare-changelist", "p4-post-changelist", "p4-pre-submit", "post-index-change" ], [ "flow", "flow:main" ], [ "browserify", "browserify.transform" ], "browserslist", "babel", "style", "xo", "prettier", [ "eslintConfig", "eslintIgnore" ], "npmpkgjsonlint", "remarkConfig", "stylelint", "ava", "jest", "mocha", "nyc", "tap", [ "react-native" ], [ "@std", "@std/esm" ], [ "jspm", "ignore", "format", "registry", "shim", "map" ], "size-limit", "pwmetrics", [ "peerDependencies", "peerDependenciesMeta", "optionalDependencies", "optionalDependenciesMeta", "bundledDependencies", "bundledDependenciesMeta", "bundleDependencies", "bundleDependenciesMeta", "devDependencies", "devDependenciesMeta", "dependencies", "dependenciesMeta" ], [ "extensionPack", "extensionDependencies", "icon", "badges", "galleryBanner", "preview", "markdown" ]);

console.clear();

const $ = "undefined" != typeof require ? require : d(import.meta.url);

function R(e) {
    return e.replace(/\\+/, "/");
}

function S(e) {
    const t = [], s = p(e, {
        withFileTypes: !0
    });
    for (let n, r, i = s.length; i-- > 0; ) n = s[i], /^[^._]/.test(n.name) && !/\.tests?($|\.)/i.test(n.name) && (r = o(e, n.name), 
    n.isDirectory() ? t.push(...S(r)) : /\.[mc]?[jt]s$/.test(n.name) && t.push(r));
    return t;
}

function M(t) {
    throw console.log(e.bgRed(e.black("ERROR: " + t))), process.kill(0), t;
}

const C = j(process.argv.slice(2), {
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
    if (console.log(N), C.help) console.log("help"); else {
        if (console.log("rollup: v" + f), console.log("babel:  v" + y), console.log(""), 
        C.dir = t(C.dir), C.src = t(C.dir, C.src), C.out = t(C.dir, C.out), console.log(e.bgGreen(e.black(e.bold("dir: ") + C.dir))), 
        console.log(e.bgGreen(e.black(e.bold("src: ") + C.src))), console.log(e.bgGreen(e.black(e.bold("out: ") + C.out))), 
        console.log(""), !C.out.startsWith(C.dir)) return M("dir OUT must be in dir DIR");
        const j = t(C.dir, "package.json");
        if (!i(j)) return M("package.json not found in " + C.dir);
        let v, w, D;
        function p() {
            const e = JSON.parse(c(j, "utf8")), t = e.dependencies || {}, s = e.peerDependencies || {};
            var o;
            v = (o = [ ...Object.keys(t), ...Object.keys(s) ], o.filter(((e, t, s) => e && s.indexOf(e) === t)).sort()).map((e => new RegExp(`^${e}($|/|\\\\)`)));
        }
        if (console.log(e.bgMagenta(e.black(e.bold("package.json: ") + j))), console.log(""), 
        p(), C.types) {
            if ("string" != typeof C.types && (C.types = "types"), C.types = t(C.dir, C.types), 
            console.log(e.bgGreen(e.black(e.bold("types: ") + C.types))), !C.types.startsWith(C.dir)) return console.log(e.bgRed(e.black("ERROR:"))), 
            M("dir TYPES must be in dir DIR");
            if (w = function() {
                let t;
                const s = e.bgBlue(e.black(e.bold("tsc: ")));
                try {
                    t = $.resolve(".bin/tsc"), console.log(s + e.bgBlue(e.black(t))), u(t, [ "-v" ], {
                        stdio: [ "ignore", "inherit", "inherit" ],
                        shell: !0
                    });
                } catch {
                    console.warn(s + e.bgRed(e.black("not found")));
                }
                return t;
            }()) {
                const J = t(C.dir, ".dester.tsconfig.json"), G = {
                    include: [ R(t(C.src, "**/*")) ],
                    exclude: [ R(t(C.src, "**/node_modules")), R(t(C.src, "**/_*")), R(t(C.src, "**/*.test.*")), R(t(C.src, "**/*.tests.*")) ],
                    compilerOptions: {
                        target: "esnext",
                        module: "esnext",
                        moduleResolution: "node",
                        allowJs: !0,
                        declaration: !0,
                        emitDeclarationOnly: !0,
                        esModuleInterop: !0,
                        resolveJsonModule: !0,
                        emitDecoratorMetadata: !0,
                        experimentalDecorators: !0,
                        allowSyntheticDefaultImports: !0,
                        forceConsistentCasingInFileNames: !0,
                        rootDir: R(C.src),
                        baseUrl: R(C.src),
                        outDir: R(C.types),
                        declarationDir: R(C.types)
                    }
                };
                l(J, JSON.stringify(G, null, 2));
                const T = m(w, [ "--build", J, ...C.watch ? [ "--watch" ] : [] ], {
                    cwd: C.src,
                    shell: !0
                });
                T.stdout.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgBlue(e.black("tsc: "))), console.dir(t);
                })), T.stderr.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgRed(e.black("tsc: "))), console.dir(t);
                }));
                const W = function() {
                    T.kill(0);
                };
                process.on("SIGTERM", W), process.on("exit", W);
            }
        }
        function d() {
            if (!D) {
                const e = S(C.src).map((function(e) {
                    const {dir: t, name: n} = r(s(C.src, e));
                    return {
                        id: e,
                        fileName: o(t, "index" === n ? n : o(n, "index"))
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
        let E, B = {};
        const F = g([ ".mjs", ".js" ].map((function(e, t) {
            return {
                output: {
                    exports: "named",
                    format: ".js" === e ? "commonjs" : "esm",
                    dir: C.out,
                    chunkFileNames: "_includes/[name]-[hash]" + e,
                    generatedCode: I
                },
                external: function(e, t) {
                    if (t) return /^\.?[/\\]|\\/.test(e) ? void 0 : v.some((t => t.test(e)));
                },
                plugins: [ {
                    name: "chunks",
                    buildStart() {
                        D || d(), t || (this.addWatchFile(C.src), this.addWatchFile(j));
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
                }, C.ie && (o = C.ie, {
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
                }), b(), (s = C.min, {
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
                            B[e] = t;
                        }
                        return "/* eslint-disable */\n" + e;
                    }
                } ]
            };
            var s, o;
        }))).on("change", (function(e, t) {
            e === j && p(), "update" !== t.event && (D = null, console.log(t.event + ": " + e));
        })).on("event", (function(t) {
            if ("END" === t.code) {
                C.watch ? console.log("\n...WATCH...\n") : F.close(), console.log("");
                const t = B;
                if (B = {}, E === (E = JSON.stringify(t))) return;
                const r = JSON.parse(c(j, "utf8"));
                delete r.main, delete r.module, delete r.types;
                const p = {};
                if (r.files) for (let e of r.files) e = s(C.dir, o(C.dir, e)), /^\.?[\\/]/.test(e) && M(e), 
                e = e.split(/[\\/]/)[0], p[e] = !0;
                const d = {};
                let m, u, f, g, b, _, h;
                for (const i in t) u = null, m = t[i], f = s(C.dir, o(C.out, i)), p[f.split(/[\\/]/)[0]] = !0, 
                m && (g = "./" + R(n(f)), (b = "index.mjs" === f) && (r.main = "index", r.module = "index.mjs", 
                g = "."), f = R(f), console.log(e.green("BUILD: " + s(C.src, m) + " => " + f)), 
                d[g] = {
                    import: "./" + f,
                    require: "./" + f.slice(0, -3) + "js"
                }, w && (u = s(C.dir, o(C.types, s(C.src, m))), u = R(u.replace(/\.([mc]?)[tj]s$/, ".d.$1ts")), 
                /\.d\.[mc]?ts$/.test(u) || M("type: " + u), b && (r.types = u), d[g].types = "./" + u));
                r.exports = {
                    "./package.json": "./package.json"
                };
                for (let e = Object.keys(d).sort(), s = 0; s < e.length; s++) r.exports[e[s]] = d[e[s]];
                r.files = [], w && (p[h = s(C.dir, C.types).split(/[\\/]/)[0]] = !0);
                for (let e in p) h && h === e ? r.files.push(e + "/**/*") : i(_ = o(C.dir, e)) && (
                //! FIX FOR NPM
                a(_).isDirectory() && (e += "/**/*"), r.files.push(e));
                r.files.sort();
                const y = function(e) {
                    const t = {}, s = Object.keys(e).sort();
                    return [ ...O, ...s ].filter((function(e, t, o) {
                        return s.indexOf(e) > -1 && t === o.indexOf(e);
                    })).forEach((function(s) {
                        t[s] = e[s];
                    })), t;
                }(r);
                l(j, JSON.stringify(y, null, 2));
            }
        }));
    }
}();
