/* eslint-disable */
import e from "kleur";

import { resolve as t, relative as o, join as n, dirname as s, parse as r } from "path";

import { existsSync as i, readFileSync as l, writeFileSync as c, lstatSync as a, readdirSync as p } from "fs";

import { createRequire as d } from "module";

import { spawn as m, spawnSync as u } from "child_process";

import { VERSION as f, watch as g } from "rollup";

import b from "@rollup/plugin-commonjs";

import h from "@rollup/plugin-node-resolve";

import { transformAsync as _, version as y } from "@babel/core";

import x from "@rollup/plugin-inject";

import { minify as k } from "terser";

import { transform as R } from "sucrase";

import v from "minimist";

const j = RegExp, w = JSON, D = w.parse, $ = Object, O = $.keys, I = w.stringify, {red: E, cyan: N, bold: P} = e, M = N(P(`\n    ___       ${E("__")} _ ${E("_ _ _ /_,_")}  ${E("_______   ____")}\n   / _ \\_${E("(/(/(_(")}/ ${E("(-_)(-/_ _)")} ${E("/ ___/ /  /  _/")}\n  / _/ / -_/_ —/ __/ -_/ __/ ${E("/ /__/ /___/ /")}\n  \\___/\\__/___/\\__/\\__/_/    ${E("\\___/____/___/")}\n\n`)), C = [].concat([ "$schema", "name", "displayName", "version" ], [ "private", "publishConfig" ], [ "description", "categories", "keywords", "license", "qna" ], [ "homepage", "bugs", "repository", "funding" ], [ "author", "maintainers", "contributors", "publisher" ], "sideEffects", "type", [ "proxy", "homepage" ], [ "flat", "resolutions", "workspaces" ], "bolt", "jsdelivr", "unpkg", [ "source", "umd:main" ], "jsnext:main", "main", "module", [ "types", "typesVersions", "typings" ], "files", "assets", [ "imports", "exports", "bin", "man", "directories" ], [ "browser", "esnext", "es2015", "esm", "module-browser", "modules.root" ], [ "engines", "engineStrict", "languageName", "os", "cpu" ], "preferGlobal", "example", "examplestyle", [ "binary", "scripts", "betterScripts", "capabilities", "activationEvents", "contributes", "husky", "simple-git-hooks", "commitlint", "lint-staged", "config", "nodemonConfig" ], [ "applypatch-msg", "pre-applypatch", "post-applypatch", "pre-commit", "pre-merge-commit", "prepare-commit-msg", "commit-msg", "post-commit", "pre-rebase", "post-checkout", "post-merge", "pre-push", "pre-receive", "update", "proc-receive", "post-receive", "post-update", "reference-transaction", "push-to-checkout", "pre-auto-gc", "post-rewrite", "sendemail-validate", "fsmonitor-watchman", "p4-changelist", "p4-prepare-changelist", "p4-post-changelist", "p4-pre-submit", "post-index-change" ], [ "flow", "flow:main" ], [ "browserify", "browserify.transform" ], "browserslist", "babel", "style", "xo", "prettier", [ "eslintConfig", "eslintIgnore" ], "npmpkgjsonlint", "remarkConfig", "stylelint", "ava", "jest", "mocha", "nyc", "tap", [ "react-native" ], [ "@std", "@std/esm" ], [ "jspm", "ignore", "format", "registry", "shim", "map" ], "size-limit", "pwmetrics", [ "peerDependencies", "peerDependenciesMeta", "optionalDependencies", "optionalDependenciesMeta", "bundledDependencies", "bundledDependenciesMeta", "bundleDependencies", "bundleDependenciesMeta", "devDependencies", "devDependenciesMeta", "dependencies", "dependenciesMeta" ], [ "extensionPack", "extensionDependencies", "icon", "badges", "galleryBanner", "preview", "markdown" ]);

const S = Number, F = Math, W = String, B = Array, T = Promise, G = $.getOwnPropertyNames, U = $.prototype, q = "dester-inject-", A = {}, J = {};

!function(e, t) {
    for (let o = G(U), n = o.length; n-- > 0; ) A["Object.prototype." + o[n]] = q + "Object.prototype." + o[n];
    for (let o, n = e.length; n-- > 0; ) {
        o = e[n];
        for (let e = [ "prototype" ].concat(G(o[1])), t = e.length; t-- > 0; ) A[o[0] + "." + e[t]] = q + o[0] + "." + e[t];
        J[o[0]] = q + o[0];
    }
    for (let o, n = t.length; n-- > 0; ) J[o = t[n]] = q + o;
}([ [ "Object", $ ], [ "Number", S ], [ "Math", F ], [ "String", W ], [ "Array", B ], [ "JSON", w ], [ "Promise", T ] ], "\nFunction Boolean\nDate\nRegExp\nError\n\nsetTimeout\nclearTimeout\nsetInterval\nclearInterval\n\neval\nisFinite\nisNaN\nparseFloat\nparseInt\ndecodeURI\ndecodeURIComponent\nencodeURI\nencodeURIComponent\n".trim().split(/\W+/));

const V = /^[A-Z][^]*[a-z]/;

const z = "undefined" != typeof require ? require : d(import.meta.url);

function toPosix(e) {
    return e.replace(/[/\\]+/, "/");
}

function getInputValidFiles(e) {
    const t = [], o = p(e, {
        withFileTypes: !0
    });
    for (let s, r, i = o.length; i-- > 0; ) s = o[i], /^[^._]/.test(s.name) && !/\.tests?($|\.)/i.test(s.name) && (r = n(e, s.name), 
    s.isDirectory() ? t.push(...getInputValidFiles(r)) : /\.[mc]?[jt]s$/.test(s.name) && t.push(r));
    return t;
}

function ERROR(t) {
    throw console.log(e.bgRed(e.black("ERROR: " + t))), process.kill(0), t;
}

const H = v(process.argv.slice(2), {
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
    if (console.log(M), H.help) console.log("help"); else {
        if (H.watch && console.clear(), console.log("rollup: v" + f), console.log("babel:  v" + y), 
        console.log(""), H.dir = t(H.dir), H.src = t(H.dir, H.src), H.out = t(H.dir, H.out), 
        console.log(e.bgGreen(e.black(e.bold("dir: ") + H.dir))), console.log(e.bgGreen(e.black(e.bold("src: ") + H.src))), 
        console.log(e.bgGreen(e.black(e.bold("out: ") + H.out))), console.log(""), !H.out.startsWith(H.dir)) return ERROR("dir OUT must be in dir DIR");
        const p = t(H.dir, "package.json");
        if (!i(p)) return ERROR("package.json not found in " + H.dir);
        let d, v, w;
        function getExternals() {
            const e = D(l(p, "utf8")), t = e.dependencies || {}, o = e.peerDependencies || {};
            d = function unique(e) {
                return e.filter(((e, t, o) => e && o.indexOf(e) === t)).sort();
            }([ ...O(process.binding("natives")), ...O(t), ...O(o) ]).map((e => new j(`^${e}($|/|\\\\)`)));
        }
        if (console.log(e.bgMagenta(e.black(e.bold("package.json: ") + p))), console.log(""), 
        getExternals(), H.types) {
            if ("string" != typeof H.types && (H.types = "types"), H.types = t(H.dir, H.types), 
            console.log(e.bgGreen(e.black(e.bold("types: ") + H.types))), !H.types.startsWith(H.dir)) return console.log(e.bgRed(e.black("ERROR:"))), 
            ERROR("dir TYPES must be in dir DIR");
            if (v = function getTSC() {
                let t;
                const o = e.bgBlue(e.black(e.bold("tsc: ")));
                try {
                    t = z.resolve(".bin/tsc"), console.log(o + e.bgBlue(e.black(t))), u(t, [ "-v" ], {
                        stdio: [ "ignore", "inherit", "inherit" ],
                        shell: !0
                    });
                } catch {
                    console.warn(o + e.bgRed(e.black("not found")));
                }
                return t;
            }()) {
                const S = t(H.dir, ".dester.tsconfig.json");
                let F = {};
                if (i(S)) try {
                    F = D(l(S)).compilerOptions || {};
                } catch {}
                const W = {
                    include: [ toPosix(t(H.src, "**/*")) ],
                    exclude: [ toPosix(t(H.src, "**/node_modules")), toPosix(t(H.src, "**/_*")), toPosix(t(H.src, "**/*.test.*")), toPosix(t(H.src, "**/*.tests.*")) ],
                    compilerOptions: {
                        ...F,
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
                        outDir: toPosix(H.types)
                    }
                };
                c(S, I(W, null, 2));
                const B = m(v, [ "--build", S, ...H.watch ? [ "--watch" ] : [] ], {
                    cwd: H.src,
                    shell: !0
                });
                B.stdout.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgBlue(e.black("tsc: "))), console.dir(t);
                })), B.stderr.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgRed(e.black("tsc: "))), console.dir(t);
                }));
                const tscExit = function() {
                    B.kill(0);
                };
                process.on("SIGTERM", tscExit), process.on("exit", tscExit);
            }
        }
        function getChunks() {
            if (!w) {
                const e = getInputValidFiles(H.src).map((function(e) {
                    const {dir: t, name: s} = r(o(H.src, e));
                    return {
                        id: e,
                        fileName: n(t, "index" === s ? s : n(s, "index"))
                    };
                }));
                w = e.sort((function(e, t) {
                    return e.fileName.localeCompare(t.fileName);
                }));
            }
        }
        console.log("");
        const $ = {
            preset: "es5",
            arrowFunctions: !1,
            constBindings: !0,
            objectShorthand: !1,
            reservedNamesAsProps: !0,
            symbols: !1
        };
        let E, N = {};
        const P = g([ ".mjs", ".js" ].map((function(t, s) {
            return {
                output: {
                    exports: "named",
                    format: ".js" === t ? "commonjs" : "esm",
                    dir: H.out,
                    chunkFileNames: "_includes/[name]" + t,
                    generatedCode: $
                },
                external: function(e, t) {
                    return !!e.startsWith("node:") || (t ? /^\.?[/\\]|\\/.test(e) ? void 0 : !!d.length && d.some((t => t.test(e))) : void 0);
                },
                plugins: [ {
                    name: "chunks",
                    buildStart() {
                        w || getChunks(), s || (this.addWatchFile(H.src), this.addWatchFile(p));
                        for (let e = w.length; e-- > 0; ) this.emitFile({
                            type: "chunk",
                            id: w[e].id,
                            fileName: w[e].fileName + t,
                            generatedCode: $
                        });
                    }
                }, {
                    name: "sucrase-custom",
                    transform(e, t) {
                        if (/\.[mc]?tsx?$/.test(t)) {
                            try {
                                e = R(e, {
                                    transforms: [ "typescript" ]
                                }).code;
                            } catch (o) {
                                console.error("sucrase-custom"), console.error(o);
                            }
                            return {
                                code: e
                            };
                        }
                        return null;
                    }
                }, ...H.ie ? [ (i = H.ie, {
                    name: "babel-custom",
                    async transform(e) {
                        try {
                            e = (await _(e, {
                                presets: [ [ "@babel/preset-env", {
                                    corejs: 3,
                                    loose: !0,
                                    bugfixes: !0,
                                    modules: !1,
                                    useBuiltIns: "entry",
                                    targets: "> 1%, not dead" + (i ? ", ie " + (+i > 8 ? +i : 11) : "")
                                } ] ],
                                plugins: [ "@babel/plugin-transform-runtime" ]
                            })).code;
                        } catch (t) {
                            console.error("babel-custom"), console.error(t);
                        }
                        return {
                            code: e
                        };
                    }
                }) ] : [], x(A), x(J), {
                    name: q,
                    resolveId: e => e.startsWith(q) ? {
                        id: e,
                        external: !1
                    } : null,
                    load: e => e.startsWith(q) ? `const v = ${e.slice(q.length)}; export default v` : null
                }, h({
                    extensions: [ ".mjs", ".js", ".jsx", ".mts", ".ts", ".tsx", ".json" ]
                }), b(), (r = H.min, {
                    name: "terser-custom",
                    async renderChunk(e) {
                        try {
                            e = (await k(e, {
                                safari10: !0,
                                mangle: !0,
                                module: !0,
                                toplevel: !0,
                                compress: !0,
                                ...r ? {
                                    keep_classnames: V,
                                    keep_fnames: V
                                } : {
                                    keep_classnames: !0,
                                    keep_fnames: !0,
                                    format: {
                                        beautify: !0
                                    }
                                }
                            })).code;
                        } catch (t) {
                            console.error("terser-custom"), console.error(t);
                        }
                        return {
                            code: e
                        };
                    }
                }), {
                    renderChunk(t, r) {
                        if (!s) {
                            const {fileName: t, facadeModuleId: s, exports: l} = r;
                            N[t] = {
                                facadeModuleId: s,
                                exports: l
                            };
                            try {
                                s && console.log(e.green("BUILD: " + o(H.src, s) + " => " + o(H.dir, n(H.out, t))));
                            } catch (i) {
                                console.error(i);
                            }
                        }
                        return "/* eslint-disable */\n" + t;
                    }
                } ]
            };
            var r, i;
        }))).on("change", (function(e, t) {
            e === p && getExternals(), "update" !== t.event && (w = null, console.log(t.event + ": " + e));
        })).on("event", (function(e) {
            if ("ERROR" === e.code) console.error(e); else if ("END" === e.code) {
                H.watch ? console.log("\n...WATCH...\n") : P.close(), console.log("");
                const e = N;
                if (N = {}, E === (E = I(e))) return;
                const r = D(l(p, "utf8"));
                delete r.main, delete r.module, delete r.types;
                const d = {};
                if (r.files) for (let t of r.files) t = o(H.dir, n(H.dir, t)), /^\.?[\\/]/.test(t) && ERROR(t), 
                t = t.split(/[\\/]/)[0], d[t] = !0;
                const m = {}, u = {};
                let f, g, b, h, _, y, x;
                for (const t in e) g = null, f = e[t].facadeModuleId, b = o(H.dir, n(H.out, t)), 
                d[b.split(/[\\/]/)[0]] = !0, f && (h = "./" + toPosix(s(b)), (_ = "index.mjs" === b) && (r.main = "index", 
                r.module = "index.mjs", h = ".", d["index.js"] = d["index.mjs"] = !0), b = toPosix(b), 
                m[h] = {
                    import: "./" + b,
                    require: "./" + b.slice(0, -3) + "js"
                }, u[h] = e[t].exports, v && (g = o(H.dir, n(H.types, o(H.src, f))), g = toPosix(g.replace(/\.([mc]?)[tj]s$/, ".d.$1ts")), 
                /\.d\.[mc]?ts$/.test(g) || ERROR("type: " + g), _ && (r.types = g, d["index.d.ts"] = !0), 
                m[h].types = "./" + g));
                r.exports = {
                    "./package.json": "./package.json"
                };
                for (let n, i = O(m).sort(), l = 0; l < i.length; l++) if (n = i[l], r.exports[n] = m[n], 
                v) {
                    let e = toPosix(o(t(H.dir, s(m[n].import)), t(H.dir, m[n].types))).replace(/(\/index)?\.d\.\w+$/, "");
                    "." !== e[0] && (e = "./" + e), e = I(e);
                    let r = `export * from ${e};\n`;
                    for (const t of u[n]) "default" === t ? r += `import { ${t} as __default__ } from ${e};\nexport { __default__ as default };\n` : "*" !== t[0] && (r += `export { ${t} } from ${e};\n`);
                    c(t(H.dir, n, "index.d.ts"), r);
                }
                r.files = [], v && (d[x = o(H.dir, H.types).split(/[\\/]/)[0]] = !0);
                for (let t in d) v && "index.d.ts" === t ? r.files.push(t) : v && x && x === t ? r.files.push(t + "/**/*") : i(y = n(H.dir, t)) && (
                //! FIX FOR NPM
                a(y).isDirectory() && (t += "/**/*"), r.files.push(t));
                r.files.sort();
                const k = function sort_pkg_json(e) {
                    const t = {}, o = O(e).sort();
                    return [ ...C, ...o ].filter((function(e, t, n) {
                        return o.indexOf(e) > -1 && t === n.indexOf(e);
                    })).forEach((function(o) {
                        t[o] = e[o];
                    })), t;
                }(r);
                c(p, I(k, null, 2));
            }
        }));
    }
}();
