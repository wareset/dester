/* eslint-disable */
const e = require("kleur"), r = require("path"), t = require("fs"), n = require("module"), o = require("child_process"), s = require("rollup"), i = require("@rollup/plugin-commonjs"), a = require("@rollup/plugin-node-resolve"), l = require("@babel/core"), c = require("@rollup/plugin-inject"), p = require("terser"), d = require("sucrase"), u = require("minimist");

var m = "undefined" != typeof document ? document.currentScript : null, f = e.red, g = (0, 
e.cyan)((0, e.bold)(`\n    ___       ${f("__")} _ ${f("_ _ _ /_,_")}  ${f("_______   ____")}\n   / _ \\_${f("(/(/(_(")}/ ${f("(-_)(-/_ _)")} ${f("/ ___/ /  /  _/")}\n  / _/ / -_/_ —/ __/ -_/ __/ ${f("/ /__/ /___/ /")}\n  \\___/\\__/___/\\__/\\__/_/    ${f("\\___/____/___/")}\n\n`)), b = [].concat([ "$schema", "name", "displayName", "version" ], [ "private", "publishConfig" ], [ "description", "categories", "keywords", "license", "qna" ], [ "homepage", "bugs", "repository", "funding" ], [ "author", "maintainers", "contributors", "publisher" ], "sideEffects", "type", [ "proxy", "homepage" ], [ "flat", "resolutions", "workspaces" ], "bolt", "jsdelivr", "unpkg", [ "source", "umd:main" ], "jsnext:main", "main", "module", [ "types", "typesVersions", "typings" ], "files", "assets", [ "imports", "exports", "bin", "man", "directories" ], [ "browser", "esnext", "es2015", "esm", "module-browser", "modules.root" ], [ "engines", "engineStrict", "languageName", "os", "cpu" ], "preferGlobal", "example", "examplestyle", [ "binary", "scripts", "betterScripts", "capabilities", "activationEvents", "contributes", "husky", "simple-git-hooks", "commitlint", "lint-staged", "config", "nodemonConfig" ], [ "applypatch-msg", "pre-applypatch", "post-applypatch", "pre-commit", "pre-merge-commit", "prepare-commit-msg", "commit-msg", "post-commit", "pre-rebase", "post-checkout", "post-merge", "pre-push", "pre-receive", "update", "proc-receive", "post-receive", "post-update", "reference-transaction", "push-to-checkout", "pre-auto-gc", "post-rewrite", "sendemail-validate", "fsmonitor-watchman", "p4-changelist", "p4-prepare-changelist", "p4-post-changelist", "p4-pre-submit", "post-index-change" ], [ "flow", "flow:main" ], [ "browserify", "browserify.transform" ], "browserslist", "babel", "style", "xo", "prettier", [ "eslintConfig", "eslintIgnore" ], "npmpkgjsonlint", "remarkConfig", "stylelint", "ava", "jest", "mocha", "nyc", "tap", [ "react-native" ], [ "@std", "@std/esm" ], [ "jspm", "ignore", "format", "registry", "shim", "map" ], "size-limit", "pwmetrics", [ "peerDependencies", "peerDependenciesMeta", "optionalDependencies", "optionalDependenciesMeta", "bundledDependencies", "bundledDependenciesMeta", "bundleDependencies", "bundleDependenciesMeta", "devDependencies", "devDependenciesMeta", "dependencies", "dependenciesMeta" ], [ "extensionPack", "extensionDependencies", "icon", "badges", "galleryBanner", "preview", "markdown" ]);

var v = "dester-inject-", y = {}, h = {};

!function(e, r) {
    for (var t = Object.getOwnPropertyNames(Object.prototype), n = t.length; n-- > 0; ) y["Object.prototype." + t[n]] = v + "Object.prototype." + t[n];
    for (var o, s = e.length; s-- > 0; ) {
        o = e[s];
        for (var i = [ "prototype" ].concat(Object.getOwnPropertyNames(o[1])), a = i.length; a-- > 0; ) y[o[0] + "." + i[a]] = v + o[0] + "." + i[a];
        h[o[0]] = v + o[0];
    }
    for (var l, c = r.length; c-- > 0; ) h[l = r[c]] = v + l;
}([ [ "Object", Object ], [ "Number", Number ], [ "Math", Math ], [ "String", String ], [ "Array", Array ], [ "JSON", JSON ], [ "Promise", Promise ] ], "\nFunction\nBoolean\n\nDate\nRegExp\nError\n\nsetTimeout\nclearTimeout\nsetInterval\nclearInterval\n\neval\nisFinite\nisNaN\nparseFloat\nparseInt\ndecodeURI\ndecodeURIComponent\nencodeURI\nencodeURIComponent\n".trim().split(/\W+/));

var _ = /^[A-Z][^]*[a-z]/;

var x = "undefined" != typeof require ? require : n.createRequire("undefined" == typeof document ? require("url").pathToFileURL(__filename).href : m && m.src || new URL("index.js", document.baseURI).href);

function toPosix(e) {
    return e.replace(/[/\\]+/, "/");
}

function getInputValidFiles(e) {
    for (var n, o, s = [], i = t.readdirSync(e, {
        withFileTypes: !0
    }), a = i.length; a-- > 0; ) n = i[a], /^[^._]/.test(n.name) && !/\.tests?($|\.)/i.test(n.name) && (o = r.join(e, n.name), 
    n.isDirectory() ? s.push(...getInputValidFiles(o)) : /\.[mc]?[jt]s$/.test(n.name) && s.push(o));
    return s;
}

function printError(r) {
    throw console.log(e.bgRed(e.black("ERROR: " + r))), process.kill(0), r;
}

var j = u(process.argv.slice(2), {
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
    if (console.log(g), j.help) console.log("help"); else {
        if (j.watch && console.clear(), console.log("rollup: v" + s.VERSION), console.log("babel:  v" + l.version), 
        console.log(""), j.dir = r.resolve(j.dir), j.src = r.resolve(j.dir, j.src), j.out = r.resolve(j.dir, j.out), 
        console.log(e.bgGreen(e.black(e.bold("dir: ") + j.dir))), console.log(e.bgGreen(e.black(e.bold("src: ") + j.src))), 
        console.log(e.bgGreen(e.black(e.bold("out: ") + j.out))), console.log(""), !j.out.startsWith(j.dir)) return printError("dir OUT must be in dir DIR");
        var n, u, m, f = r.resolve(j.dir, "package.json");
        if (!t.existsSync(f)) return printError("package.json not found in " + j.dir);
        function getExternals() {
            var e = JSON.parse(t.readFileSync(f, "utf8")), r = e.dependencies || {}, o = e.peerDependencies || {};
            n = function unique(e) {
                return e.filter(((e, r, t) => e && t.indexOf(e) === r)).sort();
            }([ ...Object.keys(process.binding("natives")), ...Object.keys(r), ...Object.keys(o) ]).map((e => new RegExp(`^${e}($|/|\\\\)`)));
        }
        if (console.log(e.bgMagenta(e.black(e.bold("package.json: ") + f))), console.log(""), 
        getExternals(), j.types) {
            if ("string" != typeof j.types && (j.types = "types"), j.types = r.resolve(j.dir, j.types), 
            console.log(e.bgGreen(e.black(e.bold("types: ") + j.types))), !j.types.startsWith(j.dir)) return console.log(e.bgRed(e.black("ERROR:"))), 
            printError("dir TYPES must be in dir DIR");
            if (u = function getTSC() {
                var r, t = e.bgBlue(e.black(e.bold("tsc: ")));
                try {
                    r = x.resolve(".bin/tsc"), console.log(t + e.bgBlue(e.black(r))), o.spawnSync(r, [ "-v" ], {
                        stdio: [ "ignore", "inherit", "inherit" ],
                        shell: !0
                    });
                } catch {
                    console.warn(t + e.bgRed(e.black("not found")));
                }
                return r;
            }()) {
                var k = r.resolve(j.dir, ".dester.tsconfig.json"), w = {};
                if (t.existsSync(k)) try {
                    w = JSON.parse(t.readFileSync(k)).compilerOptions || {};
                } catch {}
                var S = {
                    include: [ toPosix(r.resolve(j.src, "**/*")) ],
                    exclude: [ toPosix(r.resolve(j.src, "**/node_modules")), toPosix(r.resolve(j.src, "**/_*")), toPosix(r.resolve(j.src, "**/*.test.*")), toPosix(r.resolve(j.src, "**/*.tests.*")) ],
                    compilerOptions: {
                        ...w,
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
                        outDir: toPosix(j.types)
                    }
                };
                t.writeFileSync(k, JSON.stringify(S, null, 2));
                var O = o.spawn(u, [ "--build", k, ...j.watch ? [ "--watch" ] : [] ], {
                    cwd: j.src,
                    shell: !0
                });
                O.stdout.on("data", (function(r) {
                    r = r.toString().trim(), console.log("\n" + e.bgBlue(e.black("tsc: "))), console.dir(r);
                })), O.stderr.on("data", (function(r) {
                    r = r.toString().trim(), console.log("\n" + e.bgRed(e.black("tsc: "))), console.dir(r);
                }));
                var tscExit = function() {
                    O.kill(0);
                };
                process.on("SIGTERM", tscExit), process.on("exit", tscExit);
            }
        }
        function getChunks() {
            if (!m) {
                var e = getInputValidFiles(j.src).map((function(e) {
                    var t = r.parse(r.relative(j.src, e)), n = t.dir, o = t.name;
                    return {
                        id: e,
                        fileName: r.join(n, "index" === o ? o : r.join(o, "index"))
                    };
                }));
                m = e.sort((function(e, r) {
                    return e.fileName.localeCompare(r.fileName);
                }));
            }
        }
        console.log("");
        var R, N = {
            preset: "es5",
            arrowFunctions: !1,
            constBindings: !0,
            objectShorthand: !1,
            reservedNamesAsProps: !0,
            symbols: !1
        }, D = {}, I = s.watch([ ".mjs", ".js" ].map((function(t, o) {
            return {
                output: {
                    exports: "named",
                    format: ".js" === t ? "commonjs" : "esm",
                    dir: j.out,
                    chunkFileNames: "_includes/[name]" + t,
                    generatedCode: N
                },
                external: function(e, r) {
                    return !!e.startsWith("node:") || (r ? /^\.?[/\\]|\\/.test(e) ? void 0 : !!n.length && n.some((r => r.test(e))) : void 0);
                },
                plugins: [ {
                    name: "chunks",
                    buildStart() {
                        m || getChunks(), o || (this.addWatchFile(j.src), this.addWatchFile(f));
                        for (var e = m.length; e-- > 0; ) this.emitFile({
                            type: "chunk",
                            id: m[e].id,
                            fileName: m[e].fileName + t,
                            generatedCode: N
                        });
                    }
                }, {
                    name: "sucrase-custom",
                    transform(e, r) {
                        if (/\.[mc]?tsx?$/.test(r)) {
                            try {
                                e = d.transform(e, {
                                    transforms: [ "typescript" ]
                                }).code;
                            } catch (t) {
                                console.error("sucrase-custom"), console.error(t);
                            }
                            return {
                                code: e
                            };
                        }
                        return null;
                    }
                }, (j.ie, {
                    name: "babel-custom",
                    async transform(e) {
                        try {
                            e = (await l.transformAsync(e, {
                                plugins: [ "@babel/plugin-transform-runtime", [ "@babel/plugin-transform-block-scoping", {
                                    throwIfClosureRequired: !0
                                } ], [ "@babel/plugin-transform-destructuring" ] ]
                            })).code;
                        } catch (r) {
                            console.error("babel-custom"), console.error(r);
                        }
                        return {
                            code: e
                        };
                    }
                }), ...j.takeout ? [ c(y), c(h), {
                    name: v,
                    resolveId: e => e.startsWith(v) ? {
                        id: e,
                        external: !1
                    } : null,
                    load: e => e.startsWith(v) ? `const v = ${e.slice(14)}; export default v` : null
                } ] : [], a({
                    extensions: [ ".mjs", ".js", ".jsx", ".mts", ".ts", ".tsx", ".json" ]
                }), i(), (s = j.min, {
                    name: "terser-custom",
                    async renderChunk(e) {
                        try {
                            e = (await p.minify(e, {
                                safari10: !0,
                                mangle: !0,
                                module: !0,
                                toplevel: !0,
                                compress: !0,
                                ...s ? {
                                    keep_classnames: _,
                                    keep_fnames: _
                                } : {
                                    keep_classnames: !0,
                                    keep_fnames: !0,
                                    format: {
                                        beautify: !0
                                    }
                                }
                            })).code;
                        } catch (r) {
                            console.error("terser-custom"), console.error(r);
                        }
                        return {
                            code: e
                        };
                    }
                }), {
                    renderChunk(t, n) {
                        if (!o) {
                            var s = n.fileName, i = n.facadeModuleId, a = n.exports;
                            D[s] = {
                                facadeModuleId: i,
                                exports: a
                            };
                            try {
                                i && console.log(e.green("BUILD: " + r.relative(j.src, i) + " => " + r.relative(j.dir, r.join(j.out, s))));
                            } catch (l) {
                                console.error(l);
                            }
                        }
                        return "/* eslint-disable */\n" + t;
                    }
                } ]
            };
            var s;
        }))).on("change", (function(e, r) {
            e === f && getExternals(), "update" !== r.event && (m = null, console.log(r.event + ": " + e));
        })).on("event", (function(e) {
            if ("ERROR" === e.code) console.error(e); else if ("END" === e.code) {
                j.watch ? console.log("\n...WATCH...\n") : I.close(), console.log("");
                var n = D;
                if (D = {}, R === (R = JSON.stringify(n))) return;
                var o = JSON.parse(t.readFileSync(f, "utf8"));
                delete o.main, delete o.module, delete o.types;
                var s = {};
                if (o.files) for (var i of o.files) i = r.relative(j.dir, r.join(j.dir, i)), /^\.?[\\/]/.test(i) && printError(i), 
                s[i = i.split(/[\\/]/)[0]] = !0;
                var a, l, c, p, d, m, g, v = {}, y = {};
                for (var h in n) l = null, a = n[h].facadeModuleId, s[(c = r.relative(j.dir, r.join(j.out, h))).split(/[\\/]/)[0]] = !0, 
                a && (p = "./" + toPosix(r.dirname(c)), (d = "index.mjs" === c) && (o.main = "index", 
                o.module = "index.mjs", p = ".", s["index.js"] = s["index.mjs"] = !0), c = toPosix(c), 
                v[p] = {
                    import: "./" + c,
                    require: "./" + c.slice(0, -3) + "js"
                }, y[p] = n[h].exports, u && (l = toPosix((l = r.relative(j.dir, r.join(j.types, r.relative(j.src, a)))).replace(/\.([mc]?)[tj]s$/, ".d.$1ts")), 
                /\.d\.[mc]?ts$/.test(l) || printError("type: " + l), d && (o.types = l, s["index.d.ts"] = !0), 
                v[p].types = "./" + l));
                o.exports = {
                    "./package.json": "./package.json"
                };
                for (var _, x = Object.keys(v).sort(), k = 0; k < x.length; k++) if (_ = x[k], o.exports[_] = v[_], 
                u) {
                    var w = toPosix(r.relative(r.resolve(j.dir, r.dirname(v[_].import)), r.resolve(j.dir, v[_].types))).replace(/(\/index)?\.d\.\w+$/, "");
                    "." !== w[0] && (w = "./" + w);
                    var S = `export * from ${w = JSON.stringify(w)};\n`;
                    for (var O of y[_]) "default" === O ? S += `import { ${O} as __default__ } from ${w};\nexport { __default__ as default };\n` : "*" !== O[0] && (S += `export { ${O} } from ${w};\n`);
                    t.writeFileSync(r.resolve(j.dir, _, "index.d.ts"), S);
                }
                for (var N in o.files = [], u && (s[g = r.relative(j.dir, j.types).split(/[\\/]/)[0]] = !0), 
                s) u && "index.d.ts" === N ? o.files.push(N) : u && g && g === N ? o.files.push(N + "/**/*") : t.existsSync(m = r.join(j.dir, N)) && (
                //! FIX FOR NPM
                t.lstatSync(m).isDirectory() && (N += "/**/*"), o.files.push(N));
                o.files.sort();
                var $ = function sort_pkg_json(e) {
                    var r = {}, t = Object.keys(e).sort();
                    return [ ...b, ...t ].filter((function(e, r, n) {
                        return t.indexOf(e) > -1 && r === n.indexOf(e);
                    })).forEach((function(t) {
                        r[t] = e[t];
                    })), r;
                }(o);
                t.writeFileSync(f, JSON.stringify($, null, 2));
            }
        }));
    }
}();
