/* eslint-disable */
import e from "kleur";

import { resolve as t, relative as r, join as o, dirname as s, parse as n } from "path";

import { existsSync as i, readFileSync as a, writeFileSync as l, lstatSync as c, readdirSync as p } from "fs";

import { createRequire as d } from "module";

import { spawn as u, spawnSync as m } from "child_process";

import { VERSION as f, watch as g } from "rollup";

import b from "@rollup/plugin-commonjs";

import h from "@rollup/plugin-node-resolve";

import { transformAsync as _, version as y } from "@babel/core";

import v from "@rollup/plugin-inject";

import { minify as x } from "terser";

import { transform as k } from "sucrase";

import j from "minimist";

var w = e.red, O = (0, e.cyan)((0, e.bold)(`\n    ___       ${w("__")} _ ${w("_ _ _ /_,_")}  ${w("_______   ____")}\n   / _ \\_${w("(/(/(_(")}/ ${w("(-_)(-/_ _)")} ${w("/ ___/ /  /  _/")}\n  / _/ / -_/_ —/ __/ -_/ __/ ${w("/ /__/ /___/ /")}\n  \\___/\\__/___/\\__/\\__/_/    ${w("\\___/____/___/")}\n\n`)), N = [].concat([ "$schema", "name", "displayName", "version" ], [ "private", "publishConfig" ], [ "description", "categories", "keywords", "license", "qna" ], [ "homepage", "bugs", "repository", "funding" ], [ "author", "maintainers", "contributors", "publisher" ], "sideEffects", "type", [ "proxy", "homepage" ], [ "flat", "resolutions", "workspaces" ], "bolt", "jsdelivr", "unpkg", [ "source", "umd:main" ], "jsnext:main", "main", "module", [ "types", "typesVersions", "typings" ], "files", "assets", [ "imports", "exports", "bin", "man", "directories" ], [ "browser", "esnext", "es2015", "esm", "module-browser", "modules.root" ], [ "engines", "engineStrict", "languageName", "os", "cpu" ], "preferGlobal", "example", "examplestyle", [ "binary", "scripts", "betterScripts", "capabilities", "activationEvents", "contributes", "husky", "simple-git-hooks", "commitlint", "lint-staged", "config", "nodemonConfig" ], [ "applypatch-msg", "pre-applypatch", "post-applypatch", "pre-commit", "pre-merge-commit", "prepare-commit-msg", "commit-msg", "post-commit", "pre-rebase", "post-checkout", "post-merge", "pre-push", "pre-receive", "update", "proc-receive", "post-receive", "post-update", "reference-transaction", "push-to-checkout", "pre-auto-gc", "post-rewrite", "sendemail-validate", "fsmonitor-watchman", "p4-changelist", "p4-prepare-changelist", "p4-post-changelist", "p4-pre-submit", "post-index-change" ], [ "flow", "flow:main" ], [ "browserify", "browserify.transform" ], "browserslist", "babel", "style", "xo", "prettier", [ "eslintConfig", "eslintIgnore" ], "npmpkgjsonlint", "remarkConfig", "stylelint", "ava", "jest", "mocha", "nyc", "tap", [ "react-native" ], [ "@std", "@std/esm" ], [ "jspm", "ignore", "format", "registry", "shim", "map" ], "size-limit", "pwmetrics", [ "peerDependencies", "peerDependenciesMeta", "optionalDependencies", "optionalDependenciesMeta", "bundledDependencies", "bundledDependenciesMeta", "bundleDependencies", "bundleDependenciesMeta", "devDependencies", "devDependenciesMeta", "dependencies", "dependenciesMeta" ], [ "extensionPack", "extensionDependencies", "icon", "badges", "galleryBanner", "preview", "markdown" ]);

var D = "dester-inject-", $ = {
    sourceMap: !1
}, R = {
    sourceMap: !1
};

!function(e, t) {
    for (var r = Object.getOwnPropertyNames(Object.prototype), o = r.length; o-- > 0; ) $["Object.prototype." + r[o]] = D + "Object.prototype." + r[o];
    for (var s, n = e.length; n-- > 0; ) {
        s = e[n];
        for (var i = [ "prototype" ].concat(Object.getOwnPropertyNames(s[1])), a = i.length; a-- > 0; ) $[s[0] + "." + i[a]] = D + s[0] + "." + i[a];
        R[s[0]] = D + s[0];
    }
    for (var l, c = t.length; c-- > 0; ) R[l = t[c]] = D + l;
}([ [ "Object", Object ], [ "Number", Number ], [ "Math", Math ], [ "String", String ], [ "Array", Array ], [ "JSON", JSON ], [ "Promise", Promise ] ], "\nFunction\nBoolean\n\nDate\nRegExp\nError\n\nsetTimeout\nclearTimeout\nsetInterval\nclearInterval\n\neval\nisFinite\nisNaN\nparseFloat\nparseInt\ndecodeURI\ndecodeURIComponent\nencodeURI\nencodeURIComponent\n".trim().split(/\W+/));

var I = /^[A-Z][^]*[a-z]/;

var E = "undefined" != typeof require ? require : d(import.meta.url);

function toPosix(e) {
    return e.replace(/[/\\]+/, "/");
}

function getInputValidFiles(e) {
    for (var t, r, s = [], n = p(e, {
        withFileTypes: !0
    }), i = n.length; i-- > 0; ) t = n[i], /^[^._]/.test(t.name) && !/\.tests?($|\.)/i.test(t.name) && (r = o(e, t.name), 
    t.isDirectory() ? s.push(...getInputValidFiles(r)) : /\.[mc]?[jt]s$/.test(t.name) && !/\.d\.ts$/.test(t.name) && s.push(r));
    return s;
}

function printError(t) {
    throw console.log(e.bgRed(e.black("ERROR: " + t))), process.kill(0), t;
}

var M = j(process.argv.slice(2), {
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
    if (console.log(O), M.help) console.log("help"); else {
        if (M.watch && console.clear(), console.log("rollup: v" + f), console.log("babel:  v" + y), 
        console.log(""), M.dir = t(M.dir), M.src = t(M.dir, M.src), M.out = t(M.dir, M.out), 
        console.log(e.bgGreen(e.black(e.bold("dir: ") + M.dir))), console.log(e.bgGreen(e.black(e.bold("src: ") + M.src))), 
        console.log(e.bgGreen(e.black(e.bold("out: ") + M.out))), console.log(""), !M.out.startsWith(M.dir)) return printError("dir OUT must be in dir DIR");
        var p, d, j, w = t(M.dir, "package.json");
        if (!i(w)) return printError("package.json not found in " + M.dir);
        function getExternals() {
            var e = JSON.parse(a(w, "utf8")), t = e.dependencies || {}, r = e.peerDependencies || {};
            p = function unique(e) {
                return e.filter(((e, t, r) => e && r.indexOf(e) === t)).sort();
            }([ ...Object.keys(process.binding("natives")), ...Object.keys(t), ...Object.keys(r) ]).map((e => new RegExp(`^${e}($|/|\\\\)`)));
        }
        if (console.log(e.bgMagenta(e.black(e.bold("package.json: ") + w))), console.log(""), 
        getExternals(), M.types) {
            if ("string" != typeof M.types && (M.types = "types"), M.types = t(M.dir, M.types), 
            console.log(e.bgGreen(e.black(e.bold("types: ") + M.types))), !M.types.startsWith(M.dir)) return console.log(e.bgRed(e.black("ERROR:"))), 
            printError("dir TYPES must be in dir DIR");
            if (d = function getTSC() {
                var t, r = e.bgBlue(e.black(e.bold("tsc: ")));
                try {
                    t = E.resolve(".bin/tsc"), console.log(r + e.bgBlue(e.black(t))), m(t, [ "-v" ], {
                        stdio: [ "ignore", "inherit", "inherit" ],
                        shell: !0
                    });
                } catch {
                    console.warn(r + e.bgRed(e.black("not found")));
                }
                return t;
            }()) {
                var S = t(M.dir, ".dester.tsconfig.json"), C = {};
                if (i(S)) try {
                    C = JSON.parse(a(S)).compilerOptions || {};
                } catch {}
                var P = {
                    include: [ toPosix(t(M.src, "**/*")) ],
                    exclude: [ toPosix(t(M.src, "**/node_modules")), toPosix(t(M.src, "**/_*")), toPosix(t(M.src, "**/*.test.*")), toPosix(t(M.src, "**/*.tests.*")) ],
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
                        outDir: toPosix(M.types),
                        skipDefaultLibCheck: !0,
                        skipLibCheck: !0
                    }
                };
                l(S, JSON.stringify(P, null, 2));
                var F = u(d, [ "--build", S, ...M.watch ? [ "--watch" ] : [] ], {
                    cwd: M.src,
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
                var e = getInputValidFiles(M.src).map((function(e) {
                    var t = n(r(M.src, e)), s = t.dir, i = t.name;
                    return {
                        id: e,
                        fileName: o(s, "index" === i ? i : o(i, "index"))
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
        }, B = {}, T = g([ ".mjs", ".js" ].map((function(t, s) {
            return {
                output: {
                    exports: "named",
                    format: ".js" === t ? "commonjs" : "esm",
                    dir: M.out,
                    chunkFileNames: "_includes/[name]" + t,
                    generatedCode: W
                },
                external: function(e, t) {
                    return !!e.startsWith("node:") || (t ? /^\.?[/\\]|\\/.test(e) ? void 0 : !!p.length && p.some((t => t.test(e))) : void 0);
                },
                plugins: [ {
                    name: "chunks",
                    buildStart() {
                        j || getChunks(), s || (this.addWatchFile(M.src), this.addWatchFile(w));
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
                }, (M.ie, {
                    name: "babel-custom",
                    async transform(e) {
                        try {
                            e = (await _(e, {
                                sourceMaps: !1,
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
                }), ...M.takeout ? [ v($), v(R), {
                    name: D,
                    resolveId: e => e.startsWith(D) ? {
                        id: e,
                        external: !1
                    } : null,
                    load: e => e.startsWith(D) ? `const v = ${e.slice(14)}; export default v` : null
                } ] : [], h({
                    preferBuiltins: !1,
                    extensions: [ ".mjs", ".js", ".jsx", ".mts", ".ts", ".tsx", ".json" ]
                }), b({
                    sourceMap: !1
                }), (n = M.min, {
                    name: "terser-custom",
                    async renderChunk(e) {
                        try {
                            e = (await x(e, {
                                sourceMap: !1,
                                safari10: !0,
                                mangle: !0,
                                module: !0,
                                toplevel: !0,
                                compress: {
                                    drop_debugger: !1
                                },
                                ...n ? {
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
                    renderChunk(t, n) {
                        if (!s) {
                            var i = n.fileName, a = n.facadeModuleId, l = n.exports;
                            B[i] = {
                                facadeModuleId: a,
                                exports: l
                            };
                            try {
                                a && console.log(e.green("BUILD: " + r(M.src, a) + " => " + r(M.dir, o(M.out, i))));
                            } catch (c) {
                                console.error(c);
                            }
                        }
                        return "/* eslint-disable */\n" + t;
                    }
                } ]
            };
            var n;
        }))).on("change", (function(e, t) {
            e === w && getExternals(), "update" !== t.event && (j = null, console.log(t.event + ": " + e));
        })).on("event", (function(e) {
            if ("ERROR" === e.code) console.error(e); else if ("END" === e.code) {
                M.watch ? console.log("\n...WATCH...\n") : T.close(), console.log("");
                var n = B;
                if (B = {}, J === (J = JSON.stringify(n))) return;
                var p = JSON.parse(a(w, "utf8"));
                delete p.main, delete p.module, delete p.types;
                var u = {};
                if (p.files) for (var m of p.files) m = r(M.dir, o(M.dir, m)), /^\.?[\\/]/.test(m) && printError(m), 
                u[m = m.split(/[\\/]/)[0]] = !0;
                var f, g, b, h, _, y, v, x = {}, k = {};
                for (var j in n) g = null, f = n[j].facadeModuleId, u[(b = r(M.dir, o(M.out, j))).split(/[\\/]/)[0]] = !0, 
                f && ((_ = "./." === (h = "./" + toPosix(s(r(M.dir, j))))) && (h = ".", p.main = b.slice(0, -4), 
                p.module = b, "index.mjs" === b && (u["index.js"] = u["index.mjs"] = !0)), b = toPosix(b), 
                x[h] = {
                    import: "./" + b,
                    require: "./" + b.slice(0, -3) + "js"
                }, k[h] = n[j].exports, d && (g = toPosix((g = r(M.dir, o(M.types, r(M.src, f)))).replace(/\.([mc]?)[tj]s$/, ".d.$1ts")), 
                /\.d\.[mc]?ts$/.test(g) || printError("type: " + g), _ && (p.types = g, u["index.mjs"] && (u["index.d.ts"] = !0)), 
                x[h].types = "./" + g));
                p.exports = {
                    "./package.json": "./package.json"
                };
                for (var O, D = Object.keys(x).sort(), $ = 0; $ < D.length; $++) if (O = D[$], p.exports[O] = x[O], 
                d) {
                    var R = toPosix(r(t(M.dir, s(x[O].import)), t(M.dir, x[O].types))).replace(/(\/index)?\.d\.\w+$/, "");
                    "." !== R[0] && (R = "./" + R);
                    var I = `export * from ${R = JSON.stringify(R)};\n`;
                    for (var E of k[O]) "default" === E ? I += `import { ${E} as __default__ } from ${R};\nexport { __default__ as default };\n` : "*" !== E[0] && (I += `export { ${E} } from ${R};\n`);
                    l(t(M.out, O, "index.d.ts"), I);
                }
                for (var S in p.files = [], d && (u[v = r(M.dir, M.types).split(/[\\/]/)[0]] = !0), 
                u) d && "index.d.ts" === S ? p.files.push(S) : d && v && v === S ? p.files.push(S + "/**/*") : i(y = o(M.dir, S)) && (
                //! FIX FOR NPM
                c(y).isDirectory() && (S += "/**/*"), p.files.push(S));
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
