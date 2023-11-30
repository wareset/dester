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

var w = e.red, O = (0, e.cyan)((0, e.bold)(`\n    ___       ${w("__")} _ ${w("_ _ _ /_,_")}  ${w("_______   ____")}\n   / _ \\_${w("(/(/(_(")}/ ${w("(-_)(-/_ _)")} ${w("/ ___/ /  /  _/")}\n  / _/ / -_/_ —/ __/ -_/ __/ ${w("/ /__/ /___/ /")}\n  \\___/\\__/___/\\__/\\__/_/    ${w("\\___/____/___/")}\n\n`)), N = [].concat([ "$schema", "name", "displayName", "version" ], [ "private", "publishConfig" ], [ "description", "categories", "keywords", "license", "qna" ], [ "homepage", "bugs", "repository", "funding" ], [ "author", "maintainers", "contributors", "publisher" ], "sideEffects", "type", [ "proxy", "homepage" ], [ "flat", "resolutions", "workspaces" ], "bolt", "jsdelivr", "unpkg", [ "source", "umd:main" ], "jsnext:main", "main", "module", [ "types", "typesVersions", "typings" ], "files", "assets", [ "imports", "exports", "bin", "man", "directories" ], [ "browser", "esnext", "es2015", "esm", "module-browser", "modules.root" ], [ "engines", "engineStrict", "languageName", "os", "cpu" ], "preferGlobal", "example", "examplestyle", [ "binary", "scripts", "betterScripts", "capabilities", "activationEvents", "contributes", "husky", "simple-git-hooks", "commitlint", "lint-staged", "config", "nodemonConfig" ], [ "applypatch-msg", "pre-applypatch", "post-applypatch", "pre-commit", "pre-merge-commit", "prepare-commit-msg", "commit-msg", "post-commit", "pre-rebase", "post-checkout", "post-merge", "pre-push", "pre-receive", "update", "proc-receive", "post-receive", "post-update", "reference-transaction", "push-to-checkout", "pre-auto-gc", "post-rewrite", "sendemail-validate", "fsmonitor-watchman", "p4-changelist", "p4-prepare-changelist", "p4-post-changelist", "p4-pre-submit", "post-index-change" ], [ "flow", "flow:main" ], [ "browserify", "browserify.transform" ], "browserslist", "babel", "style", "xo", "prettier", [ "eslintConfig", "eslintIgnore" ], "npmpkgjsonlint", "remarkConfig", "stylelint", "ava", "jest", "mocha", "nyc", "tap", [ "react-native" ], [ "@std", "@std/esm" ], [ "jspm", "ignore", "format", "registry", "shim", "map" ], "size-limit", "pwmetrics", [ "peerDependencies", "peerDependenciesMeta", "optionalDependencies", "optionalDependenciesMeta", "bundledDependencies", "bundledDependenciesMeta", "bundleDependencies", "bundleDependenciesMeta", "devDependencies", "devDependenciesMeta", "dependencies", "dependenciesMeta" ], [ "extensionPack", "extensionDependencies", "icon", "badges", "galleryBanner", "preview", "markdown" ]);

var D = "dester-inject-", R = {}, $ = {};

!function(e, t) {
    for (var r = Object.getOwnPropertyNames(Object.prototype), o = r.length; o-- > 0; ) R["Object.prototype." + r[o]] = D + "Object.prototype." + r[o];
    for (var n, s = e.length; s-- > 0; ) {
        n = e[s];
        for (var i = [ "prototype" ].concat(Object.getOwnPropertyNames(n[1])), a = i.length; a-- > 0; ) R[n[0] + "." + i[a]] = D + n[0] + "." + i[a];
        $[n[0]] = D + n[0];
    }
    for (var l, c = t.length; c-- > 0; ) $[l = t[c]] = D + l;
}([ [ "Object", Object ], [ "Number", Number ], [ "Math", Math ], [ "String", String ], [ "Array", Array ], [ "JSON", JSON ], [ "Promise", Promise ] ], "\nFunction\nBoolean\n\nDate\nRegExp\nError\n\nsetTimeout\nclearTimeout\nsetInterval\nclearInterval\n\neval\nisFinite\nisNaN\nparseFloat\nparseInt\ndecodeURI\ndecodeURIComponent\nencodeURI\nencodeURIComponent\n".trim().split(/\W+/));

var I = /^[A-Z][^]*[a-z]/;

var E = "undefined" != typeof require ? require : d(import.meta.url);

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

var S = j(process.argv.slice(2), {
    default: {
        help: !1,
        dir: "",
        src: "src",
        out: "",
        types: "types",
        watch: !1,
        min: !1,
        takeout: !1
    },
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
    if (console.log(O), S.help) console.log("help"); else {
        if (S.watch && console.clear(), console.log("rollup: v" + f), console.log("babel:  v" + y), 
        console.log(""), S.dir = t(S.dir), S.src = t(S.dir, S.src), S.out = t(S.dir, S.out), 
        console.log(e.bgGreen(e.black(e.bold("dir: ") + S.dir))), console.log(e.bgGreen(e.black(e.bold("src: ") + S.src))), 
        console.log(e.bgGreen(e.black(e.bold("out: ") + S.out))), console.log(""), !S.out.startsWith(S.dir)) return printError("dir OUT must be in dir DIR");
        var p, d, j, w = t(S.dir, "package.json");
        if (!i(w)) return printError("package.json not found in " + S.dir);
        function getExternals() {
            var e = JSON.parse(a(w, "utf8")), t = e.dependencies || {}, r = e.peerDependencies || {};
            p = function unique(e) {
                return e.filter(((e, t, r) => e && r.indexOf(e) === t)).sort();
            }([ ...Object.keys(process.binding("natives")), ...Object.keys(t), ...Object.keys(r) ]).map((e => new RegExp(`^${e}($|/|\\\\)`)));
        }
        if (console.log(e.bgMagenta(e.black(e.bold("package.json: ") + w))), console.log(""), 
        getExternals(), S.types) {
            if ("string" != typeof S.types && (S.types = "types"), S.types = t(S.dir, S.types), 
            console.log(e.bgGreen(e.black(e.bold("types: ") + S.types))), !S.types.startsWith(S.dir)) return console.log(e.bgRed(e.black("ERROR:"))), 
            printError("dir TYPES must be in dir DIR");
            if (d = function getTSC() {
                var t, r = e.bgBlue(e.black(e.bold("tsc: ")));
                try {
                    t = E.resolve(".bin/tsc"), console.log(r + e.bgBlue(e.black(t))), u(t, [ "-v" ], {
                        stdio: [ "ignore", "inherit", "inherit" ],
                        shell: !0
                    });
                } catch {
                    console.warn(r + e.bgRed(e.black("not found")));
                }
                return t;
            }()) {
                var P = t(S.dir, ".dester.tsconfig.json"), C = {};
                if (i(P)) try {
                    C = JSON.parse(a(P)).compilerOptions || {};
                } catch {}
                var M = {
                    include: [ toPosix(t(S.src, "**/*")) ],
                    exclude: [ toPosix(t(S.src, "**/node_modules")), toPosix(t(S.src, "**/_*")), toPosix(t(S.src, "**/*.test.*")), toPosix(t(S.src, "**/*.tests.*")) ],
                    compilerOptions: {
                        ...C,
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
                        outDir: toPosix(S.types)
                    }
                };
                l(P, JSON.stringify(M, null, 2));
                var F = m(d, [ "--build", P, ...S.watch ? [ "--watch" ] : [] ], {
                    cwd: S.src,
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
                var e = getInputValidFiles(S.src).map((function(e) {
                    var t = s(r(S.src, e)), n = t.dir, i = t.name;
                    return {
                        id: e,
                        fileName: o(n, "index" === i ? i : o(i, "index"))
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
        }, T = {}, B = g([ ".mjs", ".js" ].map((function(t, n) {
            return {
                output: {
                    exports: "named",
                    format: ".js" === t ? "commonjs" : "esm",
                    dir: S.out,
                    chunkFileNames: "_includes/[name]" + t,
                    generatedCode: W
                },
                external: function(e, t) {
                    return !!e.startsWith("node:") || (t ? /^\.?[/\\]|\\/.test(e) ? void 0 : !!p.length && p.some((t => t.test(e))) : void 0);
                },
                plugins: [ {
                    name: "chunks",
                    buildStart() {
                        j || getChunks(), n || (this.addWatchFile(S.src), this.addWatchFile(w));
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
                }, (S.ie, {
                    name: "babel-custom",
                    async transform(e) {
                        try {
                            e = (await _(e, {
                                plugins: [ "@babel/plugin-transform-runtime", [ "@babel/plugin-transform-block-scoping", {
                                    throwIfClosureRequired: !0
                                } ], [ "@babel/plugin-transform-destructuring" ] ]
                            })).code;
                        } catch (t) {
                            console.error("babel-custom"), console.error(t);
                        }
                        return {
                            code: e
                        };
                    }
                }), ...S.takeout ? [ v(R), v($), {
                    name: D,
                    resolveId: e => e.startsWith(D) ? {
                        id: e,
                        external: !1
                    } : null,
                    load: e => e.startsWith(D) ? `const v = ${e.slice(14)}; export default v` : null
                } ] : [], h({
                    extensions: [ ".mjs", ".js", ".jsx", ".mts", ".ts", ".tsx", ".json" ]
                }), b(), (s = S.min, {
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
                                    keep_classnames: I,
                                    keep_fnames: I
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
                            var i = s.fileName, a = s.facadeModuleId, l = s.exports;
                            T[i] = {
                                facadeModuleId: a,
                                exports: l
                            };
                            try {
                                a && console.log(e.green("BUILD: " + r(S.src, a) + " => " + r(S.dir, o(S.out, i))));
                            } catch (c) {
                                console.error(c);
                            }
                        }
                        return "/* eslint-disable */\n" + t;
                    }
                } ]
            };
            var s;
        }))).on("change", (function(e, t) {
            e === w && getExternals(), "update" !== t.event && (j = null, console.log(t.event + ": " + e));
        })).on("event", (function(e) {
            if ("ERROR" === e.code) console.error(e); else if ("END" === e.code) {
                S.watch ? console.log("\n...WATCH...\n") : B.close(), console.log("");
                var s = T;
                if (T = {}, J === (J = JSON.stringify(s))) return;
                var p = JSON.parse(a(w, "utf8"));
                delete p.main, delete p.module, delete p.types;
                var m = {};
                if (p.files) for (var u of p.files) u = r(S.dir, o(S.dir, u)), /^\.?[\\/]/.test(u) && printError(u), 
                m[u = u.split(/[\\/]/)[0]] = !0;
                var f, g, b, h, _, y, v, x = {}, k = {};
                for (var j in s) g = null, f = s[j].facadeModuleId, m[(b = r(S.dir, o(S.out, j))).split(/[\\/]/)[0]] = !0, 
                f && (h = "./" + toPosix(n(b)), (_ = "index.mjs" === b) && (p.main = "index", p.module = "index.mjs", 
                h = ".", m["index.js"] = m["index.mjs"] = !0), b = toPosix(b), x[h] = {
                    import: "./" + b,
                    require: "./" + b.slice(0, -3) + "js"
                }, k[h] = s[j].exports, d && (g = toPosix((g = r(S.dir, o(S.types, r(S.src, f)))).replace(/\.([mc]?)[tj]s$/, ".d.$1ts")), 
                /\.d\.[mc]?ts$/.test(g) || printError("type: " + g), _ && (p.types = g, m["index.d.ts"] = !0), 
                x[h].types = "./" + g));
                p.exports = {
                    "./package.json": "./package.json"
                };
                for (var O, D = Object.keys(x).sort(), R = 0; R < D.length; R++) if (O = D[R], p.exports[O] = x[O], 
                d) {
                    var $ = toPosix(r(t(S.dir, n(x[O].import)), t(S.dir, x[O].types))).replace(/(\/index)?\.d\.\w+$/, "");
                    "." !== $[0] && ($ = "./" + $);
                    var I = `export * from ${$ = JSON.stringify($)};\n`;
                    for (var E of k[O]) "default" === E ? I += `import { ${E} as __default__ } from ${$};\nexport { __default__ as default };\n` : "*" !== E[0] && (I += `export { ${E} } from ${$};\n`);
                    l(t(S.dir, O, "index.d.ts"), I);
                }
                for (var P in p.files = [], d && (m[v = r(S.dir, S.types).split(/[\\/]/)[0]] = !0), 
                m) d && "index.d.ts" === P ? p.files.push(P) : d && v && v === P ? p.files.push(P + "/**/*") : i(y = o(S.dir, P)) && (
                //! FIX FOR NPM
                c(y).isDirectory() && (P += "/**/*"), p.files.push(P));
                p.files.sort();
                var C = function sort_pkg_json(e) {
                    var t = {}, r = Object.keys(e).sort();
                    return [ ...N, ...r ].filter((function(e, t, o) {
                        return r.indexOf(e) > -1 && t === o.indexOf(e);
                    })).forEach((function(r) {
                        t[r] = e[r];
                    })), t;
                }(p);
                l(w, JSON.stringify(C, null, 2));
            }
        }));
    }
}();
