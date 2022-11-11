/* eslint-disable */
import e from "kleur";

import { resolve as t, relative as s, join as o, dirname as n, parse as r } from "path";

import { existsSync as i, writeFileSync as l, readFileSync as c, lstatSync as a, readdirSync as p } from "fs";

import d from "os";

import { createRequire as m } from "module";

import { spawn as u, spawnSync as f } from "child_process";

import { VERSION as g, watch as b } from "rollup";

import _ from "@rollup/plugin-commonjs";

import h from "@rollup/plugin-node-resolve";

import { transformAsync as y, version as k } from "@babel/core";

import { minify as x } from "terser";

import { transform as j } from "sucrase";

import v from "minimist";

const {red: w, cyan: D, bold: N} = e, O = D(N(`\n    ___       ${w("__")} _ ${w("_ _ _ /_,_")}  ${w("_______   ____")}\n   / _ \\_${w("(/(/(_(")}/ ${w("(-_)(-/_ _)")} ${w("/ ___/ /  /  _/")}\n  / _/ / -_/_ —/ __/ -_/ __/ ${w("/ /__/ /___/ /")}\n  \\___/\\__/___/\\__/\\__/_/    ${w("\\___/____/___/")}\n\n`)), $ = [].concat([ "$schema", "name", "displayName", "version" ], [ "private", "publishConfig" ], [ "description", "categories", "keywords", "license", "qna" ], [ "homepage", "bugs", "repository", "funding" ], [ "author", "maintainers", "contributors", "publisher" ], "sideEffects", "type", [ "proxy", "homepage" ], [ "flat", "resolutions", "workspaces" ], "bolt", "jsdelivr", "unpkg", [ "source", "umd:main" ], "jsnext:main", "main", "module", [ "types", "typesVersions", "typings" ], "files", "assets", [ "imports", "exports", "bin", "man", "directories" ], [ "browser", "esnext", "es2015", "esm", "module-browser", "modules.root" ], [ "engines", "engineStrict", "languageName", "os", "cpu" ], "preferGlobal", "example", "examplestyle", [ "binary", "scripts", "betterScripts", "capabilities", "activationEvents", "contributes", "husky", "simple-git-hooks", "commitlint", "lint-staged", "config", "nodemonConfig" ], [ "applypatch-msg", "pre-applypatch", "post-applypatch", "pre-commit", "pre-merge-commit", "prepare-commit-msg", "commit-msg", "post-commit", "pre-rebase", "post-checkout", "post-merge", "pre-push", "pre-receive", "update", "proc-receive", "post-receive", "post-update", "reference-transaction", "push-to-checkout", "pre-auto-gc", "post-rewrite", "sendemail-validate", "fsmonitor-watchman", "p4-changelist", "p4-prepare-changelist", "p4-post-changelist", "p4-pre-submit", "post-index-change" ], [ "flow", "flow:main" ], [ "browserify", "browserify.transform" ], "browserslist", "babel", "style", "xo", "prettier", [ "eslintConfig", "eslintIgnore" ], "npmpkgjsonlint", "remarkConfig", "stylelint", "ava", "jest", "mocha", "nyc", "tap", [ "react-native" ], [ "@std", "@std/esm" ], [ "jspm", "ignore", "format", "registry", "shim", "map" ], "size-limit", "pwmetrics", [ "peerDependencies", "peerDependenciesMeta", "optionalDependencies", "optionalDependenciesMeta", "bundledDependencies", "bundledDependenciesMeta", "bundleDependencies", "bundleDependenciesMeta", "devDependencies", "devDependenciesMeta", "dependencies", "dependenciesMeta" ], [ "extensionPack", "extensionDependencies", "icon", "badges", "galleryBanner", "preview", "markdown" ]);

console.clear();

const R = "undefined" != typeof require ? require : m(import.meta.url);

function S() {
    let t;
    const s = e.bgBlue(e.black(e.bold("tsc: ")));
    try {
        t = R.resolve(".bin/tsc"), console.log(s + e.bgBlue(e.black(t))), f(t, [ "-v" ], {
            stdio: [ "ignore", "inherit", "inherit" ],
            shell: !0
        });
    } catch {
        console.warn(s + e.bgRed(e.black("not found")));
    }
    return t;
}

function M(e) {
    return e.replace(/\\+/, "/");
}

function C(e) {
    const t = [], s = p(e, {
        withFileTypes: !0
    });
    for (let n, r, i = s.length; i-- > 0; ) n = s[i], /^[^._]/.test(n.name) && !/\.tests?($|\.)/i.test(n.name) && (r = o(e, n.name), 
    n.isDirectory() ? t.push(...C(r)) : /\.[mc]?[jt]s$/.test(n.name) && t.push(r));
    return t;
}

function I(t) {
    throw console.log(e.bgRed(e.black("ERROR: " + t))), process.kill(0), t;
}

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
    if (console.log(O), E.help) console.log("help"); else {
        if (console.log("rollup: v" + g), console.log("babel:  v" + k), console.log(""), 
        E.dir = t(E.dir), E.src = t(E.dir, E.src), E.out = t(E.dir, E.out), console.log(e.bgGreen(e.black(e.bold("dir: ") + E.dir))), 
        console.log(e.bgGreen(e.black(e.bold("src: ") + E.src))), console.log(e.bgGreen(e.black(e.bold("out: ") + E.out))), 
        console.log(""), !E.out.startsWith(E.dir)) return I("dir OUT must be in dir DIR");
        const f = t(E.dir, "package.json");
        if (!i(f)) return I("package.json not found in " + E.dir);
        let v, w, D;
        function p() {
            const e = JSON.parse(c(f, "utf8")), t = e.dependencies || {}, s = e.peerDependencies || {};
            var o;
            v = (o = [ ...Object.keys(t), ...Object.keys(s) ], o.filter(((e, t, s) => e && s.indexOf(e) === t)).sort()).map((e => new RegExp(`^${e}($|/|\\\\)`)));
        }
        if (console.log(e.bgMagenta(e.black(e.bold("package.json: ") + f))), console.log(""), 
        p(), E.types) {
            if ("string" != typeof E.types && (E.types = "types"), E.types = t(E.dir, E.types), 
            console.log(e.bgGreen(e.black(e.bold("types: ") + E.types))), !E.types.startsWith(E.dir)) return console.log(e.bgRed(e.black("ERROR:"))), 
            I("dir TYPES must be in dir DIR");
            if (w = S()) {
                const J = t(d.tmpdir(), "dester-tsconfig.json"), G = {
                    include: [ M(t(E.src, "**/*")) ],
                    exclude: [ "**/node_modules", "**/_*", "**/*.test.*", "**/*.tests.*" ],
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
                        rootDir: M(E.src),
                        baseUrl: M(E.src),
                        outDir: M(E.types),
                        declarationDir: M(E.types)
                    }
                };
                l(J, JSON.stringify(G));
                const T = u(w, [ "--build", J, ...E.watch ? [ "--watch" ] : [] ], {
                    cwd: E.src,
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
        function m() {
            if (!D) {
                const e = C(E.src).map((function(e) {
                    const {dir: t, name: n} = r(s(E.src, e));
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
        const N = {
            preset: "es5",
            arrowFunctions: !1,
            constBindings: !0,
            objectShorthand: !1,
            reservedNamesAsProps: !0,
            symbols: !1
        };
        let R, B = {};
        const F = b([ ".mjs", ".js" ].map((function(e, t) {
            return {
                output: {
                    exports: "named",
                    format: ".js" === e ? "commonjs" : "esm",
                    dir: E.out,
                    chunkFileNames: "_includes/[name]-[hash]" + e,
                    generatedCode: N
                },
                external: function(e, t) {
                    if (t) return /^\.?[/\\]|\\/.test(e) ? void 0 : v.some((t => t.test(e)));
                },
                plugins: [ {
                    name: "chunks",
                    buildStart() {
                        D || m(), t || (this.addWatchFile(E.src), this.addWatchFile(f));
                        for (let t = D.length; t-- > 0; ) this.emitFile({
                            type: "chunk",
                            id: D[t].id,
                            fileName: D[t].fileName + e,
                            preserveSignature: "strict",
                            generatedCode: N
                        });
                    }
                }, {
                    name: "sucrase-custom",
                    transform: (e, t) => /\.tsx?$/.test(t) ? j(e, {
                        transforms: [ "typescript" ]
                    }).code : null
                }, E.ie && (o = E.ie, {
                    name: "babel-custom",
                    transform: async e => ({
                        code: (await y(e, {
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
                }), h({
                    extensions: [ ".mjs", ".js", ".jsx", ".mts", ".ts", ".tsx", ".json" ]
                }), _(), (s = E.min, {
                    name: "terser-custom",
                    renderChunk: async e => ({
                        code: e = (await x(e, {
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
            e === f && p(), "update" !== t.event && (D = null, console.log(t.event + ": " + e));
        })).on("event", (function(t) {
            if ("END" === t.code) {
                E.watch ? console.log("\n...WATCH...\n") : F.close(), console.log("");
                const t = B;
                if (B = {}, R === (R = JSON.stringify(t))) return;
                const r = JSON.parse(c(f, "utf8"));
                delete r.main, delete r.module, delete r.types;
                const p = {};
                if (r.files) for (let e of r.files) e = s(E.dir, o(E.dir, e)), /^\.?[\\/]/.test(e) && I(e), 
                e = e.split(/[\\/]/)[0], p[e] = !0;
                const d = {};
                let m, u, g, b, _, h, y;
                for (const i in t) u = null, m = t[i], g = s(E.dir, o(E.out, i)), p[g.split(/[\\/]/)[0]] = !0, 
                m && (b = "./" + M(n(g)), (_ = "index.mjs" === g) && (r.main = "index", r.module = "index.mjs", 
                b = "."), g = M(g), console.log(e.green("BUILD: " + s(E.src, m) + " => " + g)), 
                d[b] = {
                    import: "./" + g,
                    require: "./" + g.slice(0, -3) + "js"
                }, w && (u = s(E.dir, o(E.types, s(E.src, m))), u = M(u.replace(/\.([mc]?)[tj]s$/, ".d.$1ts")), 
                /\.d\.[mc]?ts$/.test(u) || I("type: " + u), _ && (r.types = u), d[b].types = "./" + u));
                r.exports = {
                    "./package.json": "./package.json"
                };
                for (let e = Object.keys(d).sort(), s = 0; s < e.length; s++) r.exports[e[s]] = d[e[s]];
                r.files = [], w && (p[y = s(E.dir, E.types).split(/[\\/]/)[0]] = !0);
                for (let e in p) y && y === e ? r.files.push(e + "/**/*") : i(h = o(E.dir, e)) && (
                //! FIX FOR NPM
                a(h).isDirectory() && (e += "/**/*"), r.files.push(e));
                r.files.sort();
                const k = function(e) {
                    const t = {}, s = Object.keys(e).sort();
                    return [ ...$, ...s ].filter((function(e, t, o) {
                        return s.indexOf(e) > -1 && t === o.indexOf(e);
                    })).forEach((function(s) {
                        t[s] = e[s];
                    })), t;
                }(r);
                l(f, JSON.stringify(k, null, 2));
            }
        }));
    }
}();

export { S as getTSC };
