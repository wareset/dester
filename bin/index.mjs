/* eslint-disable */
import e from "kleur";

import { resolve as t, relative as o, join as s, dirname as n, parse as r } from "path";

import { existsSync as i, readFileSync as c, writeFileSync as l, lstatSync as a, readdirSync as p } from "fs";

import { createRequire as d } from "module";

import { spawn as m, spawnSync as u } from "child_process";

import { VERSION as f, watch as g } from "rollup";

import b from "@rollup/plugin-commonjs";

import _ from "@rollup/plugin-node-resolve";

import { transformAsync as h, version as y } from "@babel/core";

import { minify as x } from "terser";

import { transform as k } from "sucrase";

import j from "minimist";

const {red: v, cyan: w, bold: D} = e, $ = w(D(`\n    ___       ${v("__")} _ ${v("_ _ _ /_,_")}  ${v("_______   ____")}\n   / _ \\_${v("(/(/(_(")}/ ${v("(-_)(-/_ _)")} ${v("/ ___/ /  /  _/")}\n  / _/ / -_/_ —/ __/ -_/ __/ ${v("/ /__/ /___/ /")}\n  \\___/\\__/___/\\__/\\__/_/    ${v("\\___/____/___/")}\n\n`)), O = [].concat([ "$schema", "name", "displayName", "version" ], [ "private", "publishConfig" ], [ "description", "categories", "keywords", "license", "qna" ], [ "homepage", "bugs", "repository", "funding" ], [ "author", "maintainers", "contributors", "publisher" ], "sideEffects", "type", [ "proxy", "homepage" ], [ "flat", "resolutions", "workspaces" ], "bolt", "jsdelivr", "unpkg", [ "source", "umd:main" ], "jsnext:main", "main", "module", [ "types", "typesVersions", "typings" ], "files", "assets", [ "imports", "exports", "bin", "man", "directories" ], [ "browser", "esnext", "es2015", "esm", "module-browser", "modules.root" ], [ "engines", "engineStrict", "languageName", "os", "cpu" ], "preferGlobal", "example", "examplestyle", [ "binary", "scripts", "betterScripts", "capabilities", "activationEvents", "contributes", "husky", "simple-git-hooks", "commitlint", "lint-staged", "config", "nodemonConfig" ], [ "applypatch-msg", "pre-applypatch", "post-applypatch", "pre-commit", "pre-merge-commit", "prepare-commit-msg", "commit-msg", "post-commit", "pre-rebase", "post-checkout", "post-merge", "pre-push", "pre-receive", "update", "proc-receive", "post-receive", "post-update", "reference-transaction", "push-to-checkout", "pre-auto-gc", "post-rewrite", "sendemail-validate", "fsmonitor-watchman", "p4-changelist", "p4-prepare-changelist", "p4-post-changelist", "p4-pre-submit", "post-index-change" ], [ "flow", "flow:main" ], [ "browserify", "browserify.transform" ], "browserslist", "babel", "style", "xo", "prettier", [ "eslintConfig", "eslintIgnore" ], "npmpkgjsonlint", "remarkConfig", "stylelint", "ava", "jest", "mocha", "nyc", "tap", [ "react-native" ], [ "@std", "@std/esm" ], [ "jspm", "ignore", "format", "registry", "shim", "map" ], "size-limit", "pwmetrics", [ "peerDependencies", "peerDependenciesMeta", "optionalDependencies", "optionalDependenciesMeta", "bundledDependencies", "bundledDependenciesMeta", "bundleDependencies", "bundleDependenciesMeta", "devDependencies", "devDependenciesMeta", "dependencies", "dependenciesMeta" ], [ "extensionPack", "extensionDependencies", "icon", "badges", "galleryBanner", "preview", "markdown" ]);

console.clear();

const N = "undefined" != typeof require ? require : d(import.meta.url);

function R(e) {
    return e.replace(/[/\\]+/, "/");
}

function S(e) {
    const t = [], o = p(e, {
        withFileTypes: !0
    });
    for (let n, r, i = o.length; i-- > 0; ) n = o[i], /^[^._]/.test(n.name) && !/\.tests?($|\.)/i.test(n.name) && (r = s(e, n.name), 
    n.isDirectory() ? t.push(...S(r)) : /\.[mc]?[jt]s$/.test(n.name) && t.push(r));
    return t;
}

function M(t) {
    throw console.log(e.bgRed(e.black("ERROR: " + t))), process.kill(0), t;
}

const I = j(process.argv.slice(2), {
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
    if (console.log($), I.help) console.log("help"); else {
        if (console.log("rollup: v" + f), console.log("babel:  v" + y), console.log(""), 
        I.dir = t(I.dir), I.src = t(I.dir, I.src), I.out = t(I.dir, I.out), console.log(e.bgGreen(e.black(e.bold("dir: ") + I.dir))), 
        console.log(e.bgGreen(e.black(e.bold("src: ") + I.src))), console.log(e.bgGreen(e.black(e.bold("out: ") + I.out))), 
        console.log(""), !I.out.startsWith(I.dir)) return M("dir OUT must be in dir DIR");
        const j = t(I.dir, "package.json");
        if (!i(j)) return M("package.json not found in " + I.dir);
        let v, w, D;
        function p() {
            const e = JSON.parse(c(j, "utf8")), t = e.dependencies || {}, o = e.peerDependencies || {};
            var s;
            v = (s = [ ...Object.keys(process.binding("natives")), ...Object.keys(t), ...Object.keys(o) ], 
            s.filter(((e, t, o) => e && o.indexOf(e) === t)).sort()).map((e => new RegExp(`^${e}($|/|\\\\)`)));
        }
        if (console.log(e.bgMagenta(e.black(e.bold("package.json: ") + j))), console.log(""), 
        p(), I.types) {
            if ("string" != typeof I.types && (I.types = "types"), I.types = t(I.dir, I.types), 
            console.log(e.bgGreen(e.black(e.bold("types: ") + I.types))), !I.types.startsWith(I.dir)) return console.log(e.bgRed(e.black("ERROR:"))), 
            M("dir TYPES must be in dir DIR");
            if (w = function() {
                let t;
                const o = e.bgBlue(e.black(e.bold("tsc: ")));
                try {
                    t = N.resolve(".bin/tsc"), console.log(o + e.bgBlue(e.black(t))), u(t, [ "-v" ], {
                        stdio: [ "ignore", "inherit", "inherit" ],
                        shell: !0
                    });
                } catch {
                    console.warn(o + e.bgRed(e.black("not found")));
                }
                return t;
            }()) {
                const F = t(I.dir, ".dester.tsconfig.json");
                let G = {};
                if (i(F)) try {
                    G = JSON.parse(c(F)).compilerOptions || {};
                } catch {}
                const W = {
                    include: [ R(t(I.src, "**/*")) ],
                    exclude: [ R(t(I.src, "**/node_modules")), R(t(I.src, "**/_*")), R(t(I.src, "**/*.test.*")), R(t(I.src, "**/*.tests.*")) ],
                    compilerOptions: {
                        ...G,
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
                        outDir: R(I.types)
                    }
                };
                l(F, JSON.stringify(W, null, 2));
                const T = m(w, [ "--build", F, ...I.watch ? [ "--watch" ] : [] ], {
                    cwd: I.src,
                    shell: !0
                });
                T.stdout.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgBlue(e.black("tsc: "))), console.dir(t);
                })), T.stderr.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgRed(e.black("tsc: "))), console.dir(t);
                }));
                const q = function() {
                    T.kill(0);
                };
                process.on("SIGTERM", q), process.on("exit", q);
            }
        }
        function d() {
            if (!D) {
                const e = S(I.src).map((function(e) {
                    const {dir: t, name: n} = r(o(I.src, e));
                    return {
                        id: e,
                        fileName: s(t, "index" === n ? n : s(n, "index"))
                    };
                }));
                D = e.sort((function(e, t) {
                    return e.fileName.localeCompare(t.fileName);
                }));
            }
        }
        console.log("");
        const C = {
            preset: "es5",
            arrowFunctions: !1,
            constBindings: !0,
            objectShorthand: !1,
            reservedNamesAsProps: !0,
            symbols: !1
        };
        let E, J = {};
        const B = g([ ".mjs", ".js" ].map((function(t, n) {
            return {
                output: {
                    exports: "named",
                    format: ".js" === t ? "commonjs" : "esm",
                    dir: I.out,
                    chunkFileNames: "_includes/[name]" + t,
                    generatedCode: C
                },
                external: function(e, t) {
                    return !!e.startsWith("node:") || (t ? /^\.?[/\\]|\\/.test(e) ? void 0 : !!v.length && v.some((t => t.test(e))) : void 0);
                },
                plugins: [ {
                    name: "chunks",
                    buildStart() {
                        D || d(), n || (this.addWatchFile(I.src), this.addWatchFile(j));
                        for (let e = D.length; e-- > 0; ) this.emitFile({
                            type: "chunk",
                            id: D[e].id,
                            fileName: D[e].fileName + t,
                            generatedCode: C
                        });
                    }
                }, {
                    name: "sucrase-custom",
                    transform(e, t) {
                        if (/\.[mc]?tsx?$/.test(t)) {
                            try {
                                e = k(e, {
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
                }, ...I.ie ? [ (i = I.ie, {
                    name: "babel-custom",
                    async transform(e) {
                        try {
                            e = (await h(e, {
                                presets: [ [ "@babel/preset-env", {
                                    corejs: 3,
                                    loose: !0,
                                    bugfixes: !0,
                                    modules: !1,
                                    useBuiltIns: "entry",
                                    targets: "> 1%, not dead" + (i ? ", ie " + Math.max(9, +i || 11) : "")
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
                }) ] : [], _({
                    extensions: [ ".mjs", ".js", ".jsx", ".mts", ".ts", ".tsx", ".json" ]
                }), b(), (r = I.min, {
                    name: "terser-custom",
                    async renderChunk(e) {
                        try {
                            e = (await x(e, {
                                safari10: !0,
                                mangle: !0,
                                module: !0,
                                toplevel: !0,
                                compress: !0,
                                ...r ? {
                                    keep_classnames: !1
                                } : {
                                    keep_classnames: !0,
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
                        if (!n) {
                            const {fileName: t, facadeModuleId: n, exports: c} = r;
                            J[t] = {
                                facadeModuleId: n,
                                exports: c
                            };
                            try {
                                n && console.log(e.green("BUILD: " + o(I.src, n) + " => " + o(I.dir, s(I.out, t))));
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
            e === j && p(), "update" !== t.event && (D = null, console.log(t.event + ": " + e));
        })).on("event", (function(e) {
            if ("ERROR" === e.code) console.error(e); else if ("END" === e.code) {
                I.watch ? console.log("\n...WATCH...\n") : B.close(), console.log("");
                const e = J;
                if (J = {}, E === (E = JSON.stringify(e))) return;
                const r = JSON.parse(c(j, "utf8"));
                delete r.main, delete r.module, delete r.types;
                const p = {};
                if (r.files) for (let t of r.files) t = o(I.dir, s(I.dir, t)), /^\.?[\\/]/.test(t) && M(t), 
                t = t.split(/[\\/]/)[0], p[t] = !0;
                const d = {}, m = {};
                let u, f, g, b, _, h, y;
                for (const t in e) f = null, u = e[t].facadeModuleId, g = o(I.dir, s(I.out, t)), 
                p[g.split(/[\\/]/)[0]] = !0, u && (b = "./" + R(n(g)), (_ = "index.mjs" === g) && (r.main = "index", 
                r.module = "index.mjs", b = ".", p["index.js"] = p["index.mjs"] = !0), g = R(g), 
                d[b] = {
                    import: "./" + g,
                    require: "./" + g.slice(0, -3) + "js"
                }, m[b] = e[t].exports, w && (f = o(I.dir, s(I.types, o(I.src, u))), f = R(f.replace(/\.([mc]?)[tj]s$/, ".d.$1ts")), 
                /\.d\.[mc]?ts$/.test(f) || M("type: " + f), _ && (r.types = f, p["index.d.ts"] = !0), 
                d[b].types = "./" + f));
                r.exports = {
                    "./package.json": "./package.json"
                };
                for (let s, i = Object.keys(d).sort(), c = 0; c < i.length; c++) if (s = i[c], r.exports[s] = d[s], 
                w) {
                    let e = R(o(t(I.dir, n(d[s].import)), t(I.dir, d[s].types))).replace(/(\/index)?\.d\.\w+$/, "");
                    "." !== e[0] && (e = "./" + e), e = JSON.stringify(e);
                    let r = `export * from ${e};\n`;
                    for (const t of m[s]) "default" === t ? r += `import { ${t} as __default__ } from ${e};\nexport { __default__ as default };\n` : "*" !== t[0] && (r += `export { ${t} } from ${e};\n`);
                    l(t(I.dir, s, "index.d.ts"), r);
                }
                r.files = [], w && (p[y = o(I.dir, I.types).split(/[\\/]/)[0]] = !0);
                for (let t in p) w && "index.d.ts" === t ? r.files.push(t) : w && y && y === t ? r.files.push(t + "/**/*") : i(h = s(I.dir, t)) && (
                //! FIX FOR NPM
                a(h).isDirectory() && (t += "/**/*"), r.files.push(t));
                r.files.sort();
                const x = function(e) {
                    const t = {}, o = Object.keys(e).sort();
                    return [ ...O, ...o ].filter((function(e, t, s) {
                        return o.indexOf(e) > -1 && t === s.indexOf(e);
                    })).forEach((function(o) {
                        t[o] = e[o];
                    })), t;
                }(r);
                l(j, JSON.stringify(x, null, 2));
            }
        }));
    }
}();
