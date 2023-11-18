/* eslint-disable */
import e from "kleur";

import { resolve as t, relative as r, join as o, dirname as n, parse as s } from "path";

import { existsSync as i, readFileSync as a, writeFileSync as l, lstatSync as c, readdirSync as p } from "fs";

import { createRequire as d } from "module";

import { spawn as m, spawnSync as u } from "child_process";

import { VERSION as f, watch as g } from "rollup";

import b from "@rollup/plugin-commonjs";

import h from "@rollup/plugin-node-resolve";

import { transformAsync as _, version as y } from "@babel/core";

import v from "@rollup/plugin-inject";

import { minify as x } from "terser";

import { transform as k } from "sucrase";

import j from "minimist";

var {red: w, cyan: O, bold: N} = e, D = O(N(`\n    ___       ${w("__")} _ ${w("_ _ _ /_,_")}  ${w("_______   ____")}\n   / _ \\_${w("(/(/(_(")}/ ${w("(-_)(-/_ _)")} ${w("/ ___/ /  /  _/")}\n  / _/ / -_/_ —/ __/ -_/ __/ ${w("/ /__/ /___/ /")}\n  \\___/\\__/___/\\__/\\__/_/    ${w("\\___/____/___/")}\n\n`)), R = [].concat([ "$schema", "name", "displayName", "version" ], [ "private", "publishConfig" ], [ "description", "categories", "keywords", "license", "qna" ], [ "homepage", "bugs", "repository", "funding" ], [ "author", "maintainers", "contributors", "publisher" ], "sideEffects", "type", [ "proxy", "homepage" ], [ "flat", "resolutions", "workspaces" ], "bolt", "jsdelivr", "unpkg", [ "source", "umd:main" ], "jsnext:main", "main", "module", [ "types", "typesVersions", "typings" ], "files", "assets", [ "imports", "exports", "bin", "man", "directories" ], [ "browser", "esnext", "es2015", "esm", "module-browser", "modules.root" ], [ "engines", "engineStrict", "languageName", "os", "cpu" ], "preferGlobal", "example", "examplestyle", [ "binary", "scripts", "betterScripts", "capabilities", "activationEvents", "contributes", "husky", "simple-git-hooks", "commitlint", "lint-staged", "config", "nodemonConfig" ], [ "applypatch-msg", "pre-applypatch", "post-applypatch", "pre-commit", "pre-merge-commit", "prepare-commit-msg", "commit-msg", "post-commit", "pre-rebase", "post-checkout", "post-merge", "pre-push", "pre-receive", "update", "proc-receive", "post-receive", "post-update", "reference-transaction", "push-to-checkout", "pre-auto-gc", "post-rewrite", "sendemail-validate", "fsmonitor-watchman", "p4-changelist", "p4-prepare-changelist", "p4-post-changelist", "p4-pre-submit", "post-index-change" ], [ "flow", "flow:main" ], [ "browserify", "browserify.transform" ], "browserslist", "babel", "style", "xo", "prettier", [ "eslintConfig", "eslintIgnore" ], "npmpkgjsonlint", "remarkConfig", "stylelint", "ava", "jest", "mocha", "nyc", "tap", [ "react-native" ], [ "@std", "@std/esm" ], [ "jspm", "ignore", "format", "registry", "shim", "map" ], "size-limit", "pwmetrics", [ "peerDependencies", "peerDependenciesMeta", "optionalDependencies", "optionalDependenciesMeta", "bundledDependencies", "bundledDependenciesMeta", "bundleDependencies", "bundleDependenciesMeta", "devDependencies", "devDependenciesMeta", "dependencies", "dependenciesMeta" ], [ "extensionPack", "extensionDependencies", "icon", "badges", "galleryBanner", "preview", "markdown" ]);

var $ = "dester-inject-", I = {}, E = {};

!function(e, t) {
    for (var r = Object.getOwnPropertyNames(Object.prototype), o = r.length; o-- > 0; ) I["Object.prototype." + r[o]] = $ + "Object.prototype." + r[o];
    for (var n, s = e.length; s-- > 0; ) {
        n = e[s];
        for (var i = [ "prototype" ].concat(Object.getOwnPropertyNames(n[1])), a = i.length; a-- > 0; ) I[n[0] + "." + i[a]] = $ + n[0] + "." + i[a];
        E[n[0]] = $ + n[0];
    }
    for (var l, c = t.length; c-- > 0; ) E[l = t[c]] = $ + l;
}([ [ "Object", Object ], [ "Number", Number ], [ "Math", Math ], [ "String", String ], [ "Array", Array ], [ "JSON", JSON ], [ "Promise", Promise ] ], "\nFunction\nBoolean\n\nDate\nRegExp\nError\n\nsetTimeout\nclearTimeout\nsetInterval\nclearInterval\n\neval\nisFinite\nisNaN\nparseFloat\nparseInt\ndecodeURI\ndecodeURIComponent\nencodeURI\nencodeURIComponent\n".trim().split(/\W+/));

var S = /^[A-Z][^]*[a-z]/;

var P = "undefined" != typeof require ? require : d(import.meta.url);

function toPosix(e) {
    return e.replace(/[/\\]+/, "/");
}

function getInputValidFiles(e) {
    for (var t, r, n = [], s = p(e, {
        withFileTypes: !0
    }), i = s.length; i-- > 0; ) t = s[i], /^[^._]/.test(t.name) && !/\.tests?($|\.)/i.test(t.name) && (r = o(e, t.name), 
    t.isDirectory() ? n.push(...getInputValidFiles(r)) : /\.[mc]?[jt]s$/.test(t.name) && n.push(r));
    return n;
}

function printError(t) {
    throw console.log(e.bgRed(e.black("ERROR: " + t))), process.kill(0), t;
}

var C = j(process.argv.slice(2), {
    default: {
        help: !1,
        dir: "",
        src: "src",
        out: "",
        types: "types",
        watch: !1,
        min: !1,
        ie: !1,
        takeout: !1
    },
    number: [ "ie" ],
    string: [ "dir", "src", "out", "types" ],
    boolean: [ "help", "watch", "min", "takeout" ],
    alias: {
        h: "help",
        d: "dir",
        t: "types",
        w: "watch",
        m: "min"
    }
});

!function() {
    if (console.log(D), C.help) console.log("help"); else {
        if (C.watch && console.clear(), console.log("rollup: v" + f), console.log("babel:  v" + y), 
        console.log(""), C.dir = t(C.dir), C.src = t(C.dir, C.src), C.out = t(C.dir, C.out), 
        console.log(e.bgGreen(e.black(e.bold("dir: ") + C.dir))), console.log(e.bgGreen(e.black(e.bold("src: ") + C.src))), 
        console.log(e.bgGreen(e.black(e.bold("out: ") + C.out))), console.log(""), !C.out.startsWith(C.dir)) return printError("dir OUT must be in dir DIR");
        var p, d, j, w = t(C.dir, "package.json");
        if (!i(w)) return printError("package.json not found in " + C.dir);
        function getExternals() {
            var e = JSON.parse(a(w, "utf8")), t = e.dependencies || {}, r = e.peerDependencies || {};
            p = function unique(e) {
                return e.filter(((e, t, r) => e && r.indexOf(e) === t)).sort();
            }([ ...Object.keys(process.binding("natives")), ...Object.keys(t), ...Object.keys(r) ]).map((e => new RegExp(`^${e}($|/|\\\\)`)));
        }
        if (console.log(e.bgMagenta(e.black(e.bold("package.json: ") + w))), console.log(""), 
        getExternals(), C.types) {
            if ("string" != typeof C.types && (C.types = "types"), C.types = t(C.dir, C.types), 
            console.log(e.bgGreen(e.black(e.bold("types: ") + C.types))), !C.types.startsWith(C.dir)) return console.log(e.bgRed(e.black("ERROR:"))), 
            printError("dir TYPES must be in dir DIR");
            if (d = function getTSC() {
                var t, r = e.bgBlue(e.black(e.bold("tsc: ")));
                try {
                    t = P.resolve(".bin/tsc"), console.log(r + e.bgBlue(e.black(t))), u(t, [ "-v" ], {
                        stdio: [ "ignore", "inherit", "inherit" ],
                        shell: !0
                    });
                } catch {
                    console.warn(r + e.bgRed(e.black("not found")));
                }
                return t;
            }()) {
                var O = t(C.dir, ".dester.tsconfig.json"), N = {};
                if (i(O)) try {
                    N = JSON.parse(a(O)).compilerOptions || {};
                } catch {}
                var M = {
                    include: [ toPosix(t(C.src, "**/*")) ],
                    exclude: [ toPosix(t(C.src, "**/node_modules")), toPosix(t(C.src, "**/_*")), toPosix(t(C.src, "**/*.test.*")), toPosix(t(C.src, "**/*.tests.*")) ],
                    compilerOptions: {
                        ...N,
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
                        outDir: toPosix(C.types)
                    }
                };
                l(O, JSON.stringify(M, null, 2));
                var F = m(d, [ "--build", O, ...C.watch ? [ "--watch" ] : [] ], {
                    cwd: C.src,
                    shell: !0
                });
                F.stdout.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgBlue(e.black("tsc: "))), console.dir(t);
                })), F.stderr.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgRed(e.black("tsc: "))), console.dir(t);
                }));
                var tscExit = function() {
                    F.kill(0);
                };
                process.on("SIGTERM", tscExit), process.on("exit", tscExit);
            }
        }
        function getChunks() {
            if (!j) {
                var e = getInputValidFiles(C.src).map((function(e) {
                    var {dir: t, name: n} = s(r(C.src, e));
                    return {
                        id: e,
                        fileName: o(t, "index" === n ? n : o(n, "index"))
                    };
                }));
                j = e.sort((function(e, t) {
                    return e.fileName.localeCompare(t.fileName);
                }));
            }
        }
        console.log("");
        var J, W = {
            preset: "es5",
            arrowFunctions: !1,
            constBindings: !0,
            objectShorthand: !1,
            reservedNamesAsProps: !0,
            symbols: !1
        }, B = {}, T = g([ ".mjs", ".js" ].map((function(t, n) {
            return {
                output: {
                    exports: "named",
                    format: ".js" === t ? "commonjs" : "esm",
                    dir: C.out,
                    chunkFileNames: "_includes/[name]" + t,
                    generatedCode: W
                },
                external: function(e, t) {
                    return !!e.startsWith("node:") || (t ? /^\.?[/\\]|\\/.test(e) ? void 0 : !!p.length && p.some((t => t.test(e))) : void 0);
                },
                plugins: [ {
                    name: "chunks",
                    buildStart() {
                        j || getChunks(), n || (this.addWatchFile(C.src), this.addWatchFile(w));
                        for (var e = j.length; e-- > 0; ) this.emitFile({
                            type: "chunk",
                            id: j[e].id,
                            fileName: j[e].fileName + t,
                            generatedCode: W
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
                            } catch (r) {
                                console.error("sucrase-custom"), console.error(r);
                            }
                            return {
                                code: e
                            };
                        }
                        return null;
                    }
                }, (i = C.ie, {
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
                                plugins: [ "@babel/plugin-transform-runtime", [ "@babel/plugin-transform-block-scoping", {
                                    throwIfClosureRequired: !0
                                } ] ]
                            })).code;
                        } catch (t) {
                            console.error("babel-custom"), console.error(t);
                        }
                        return {
                            code: e
                        };
                    }
                }), ...C.takeout ? [ v(I), v(E), {
                    name: $,
                    resolveId: e => e.startsWith($) ? {
                        id: e,
                        external: !1
                    } : null,
                    load: e => e.startsWith($) ? `const v = ${e.slice(14)}; export default v` : null
                } ] : [], h({
                    extensions: [ ".mjs", ".js", ".jsx", ".mts", ".ts", ".tsx", ".json" ]
                }), b(), (s = C.min, {
                    name: "terser-custom",
                    async renderChunk(e) {
                        try {
                            e = (await x(e, {
                                safari10: !0,
                                mangle: !0,
                                module: !0,
                                toplevel: !0,
                                compress: !0,
                                ...s ? {
                                    keep_classnames: S,
                                    keep_fnames: S
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
                    renderChunk(t, s) {
                        if (!n) {
                            var {fileName: i, facadeModuleId: a, exports: l} = s;
                            B[i] = {
                                facadeModuleId: a,
                                exports: l
                            };
                            try {
                                a && console.log(e.green("BUILD: " + r(C.src, a) + " => " + r(C.dir, o(C.out, i))));
                            } catch (c) {
                                console.error(c);
                            }
                        }
                        return "/* eslint-disable */\n" + t;
                    }
                } ]
            };
            var s, i;
        }))).on("change", (function(e, t) {
            e === w && getExternals(), "update" !== t.event && (j = null, console.log(t.event + ": " + e));
        })).on("event", (function(e) {
            if ("ERROR" === e.code) console.error(e); else if ("END" === e.code) {
                C.watch ? console.log("\n...WATCH...\n") : T.close(), console.log("");
                var s = B;
                if (B = {}, J === (J = JSON.stringify(s))) return;
                var p = JSON.parse(a(w, "utf8"));
                delete p.main, delete p.module, delete p.types;
                var m = {};
                if (p.files) for (var u of p.files) u = r(C.dir, o(C.dir, u)), /^\.?[\\/]/.test(u) && printError(u), 
                m[u = u.split(/[\\/]/)[0]] = !0;
                var f, g, b, h, _, y, v, x = {}, k = {};
                for (var j in s) g = null, f = s[j].facadeModuleId, m[(b = r(C.dir, o(C.out, j))).split(/[\\/]/)[0]] = !0, 
                f && (h = "./" + toPosix(n(b)), (_ = "index.mjs" === b) && (p.main = "index", p.module = "index.mjs", 
                h = ".", m["index.js"] = m["index.mjs"] = !0), b = toPosix(b), x[h] = {
                    import: "./" + b,
                    require: "./" + b.slice(0, -3) + "js"
                }, k[h] = s[j].exports, d && (g = toPosix((g = r(C.dir, o(C.types, r(C.src, f)))).replace(/\.([mc]?)[tj]s$/, ".d.$1ts")), 
                /\.d\.[mc]?ts$/.test(g) || printError("type: " + g), _ && (p.types = g, m["index.d.ts"] = !0), 
                x[h].types = "./" + g));
                p.exports = {
                    "./package.json": "./package.json"
                };
                for (var O, N = Object.keys(x).sort(), D = 0; D < N.length; D++) if (O = N[D], p.exports[O] = x[O], 
                d) {
                    var $ = toPosix(r(t(C.dir, n(x[O].import)), t(C.dir, x[O].types))).replace(/(\/index)?\.d\.\w+$/, "");
                    "." !== $[0] && ($ = "./" + $);
                    var I = `export * from ${$ = JSON.stringify($)};\n`;
                    for (var E of k[O]) "default" === E ? I += `import { ${E} as __default__ } from ${$};\nexport { __default__ as default };\n` : "*" !== E[0] && (I += `export { ${E} } from ${$};\n`);
                    l(t(C.dir, O, "index.d.ts"), I);
                }
                for (var S in p.files = [], d && (m[v = r(C.dir, C.types).split(/[\\/]/)[0]] = !0), 
                m) d && "index.d.ts" === S ? p.files.push(S) : d && v && v === S ? p.files.push(S + "/**/*") : i(y = o(C.dir, S)) && (
                //! FIX FOR NPM
                c(y).isDirectory() && (S += "/**/*"), p.files.push(S));
                p.files.sort();
                var P = function sort_pkg_json(e) {
                    var t = {}, r = Object.keys(e).sort();
                    return [ ...R, ...r ].filter((function(e, t, o) {
                        return r.indexOf(e) > -1 && t === o.indexOf(e);
                    })).forEach((function(r) {
                        t[r] = e[r];
                    })), t;
                }(p);
                l(w, JSON.stringify(P, null, 2));
            }
        }));
    }
}();
