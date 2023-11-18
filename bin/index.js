/* eslint-disable */
const e = require("kleur"), r = require("path"), t = require("fs"), n = require("module"), o = require("child_process"), s = require("rollup"), i = require("@rollup/plugin-commonjs"), a = require("@rollup/plugin-node-resolve"), l = require("@babel/core"), c = require("@rollup/plugin-inject"), p = require("terser"), d = require("sucrase"), u = require("minimist");

var m = "undefined" != typeof document ? document.currentScript : null, {red: f, cyan: g, bold: b} = e, v = g(b(`\n    ___       ${f("__")} _ ${f("_ _ _ /_,_")}  ${f("_______   ____")}\n   / _ \\_${f("(/(/(_(")}/ ${f("(-_)(-/_ _)")} ${f("/ ___/ /  /  _/")}\n  / _/ / -_/_ —/ __/ -_/ __/ ${f("/ /__/ /___/ /")}\n  \\___/\\__/___/\\__/\\__/_/    ${f("\\___/____/___/")}\n\n`)), y = [].concat([ "$schema", "name", "displayName", "version" ], [ "private", "publishConfig" ], [ "description", "categories", "keywords", "license", "qna" ], [ "homepage", "bugs", "repository", "funding" ], [ "author", "maintainers", "contributors", "publisher" ], "sideEffects", "type", [ "proxy", "homepage" ], [ "flat", "resolutions", "workspaces" ], "bolt", "jsdelivr", "unpkg", [ "source", "umd:main" ], "jsnext:main", "main", "module", [ "types", "typesVersions", "typings" ], "files", "assets", [ "imports", "exports", "bin", "man", "directories" ], [ "browser", "esnext", "es2015", "esm", "module-browser", "modules.root" ], [ "engines", "engineStrict", "languageName", "os", "cpu" ], "preferGlobal", "example", "examplestyle", [ "binary", "scripts", "betterScripts", "capabilities", "activationEvents", "contributes", "husky", "simple-git-hooks", "commitlint", "lint-staged", "config", "nodemonConfig" ], [ "applypatch-msg", "pre-applypatch", "post-applypatch", "pre-commit", "pre-merge-commit", "prepare-commit-msg", "commit-msg", "post-commit", "pre-rebase", "post-checkout", "post-merge", "pre-push", "pre-receive", "update", "proc-receive", "post-receive", "post-update", "reference-transaction", "push-to-checkout", "pre-auto-gc", "post-rewrite", "sendemail-validate", "fsmonitor-watchman", "p4-changelist", "p4-prepare-changelist", "p4-post-changelist", "p4-pre-submit", "post-index-change" ], [ "flow", "flow:main" ], [ "browserify", "browserify.transform" ], "browserslist", "babel", "style", "xo", "prettier", [ "eslintConfig", "eslintIgnore" ], "npmpkgjsonlint", "remarkConfig", "stylelint", "ava", "jest", "mocha", "nyc", "tap", [ "react-native" ], [ "@std", "@std/esm" ], [ "jspm", "ignore", "format", "registry", "shim", "map" ], "size-limit", "pwmetrics", [ "peerDependencies", "peerDependenciesMeta", "optionalDependencies", "optionalDependenciesMeta", "bundledDependencies", "bundledDependenciesMeta", "bundleDependencies", "bundleDependenciesMeta", "devDependencies", "devDependenciesMeta", "dependencies", "dependenciesMeta" ], [ "extensionPack", "extensionDependencies", "icon", "badges", "galleryBanner", "preview", "markdown" ]);

var h = "dester-inject-", _ = {}, x = {};

!function(e, r) {
    for (var t = Object.getOwnPropertyNames(Object.prototype), n = t.length; n-- > 0; ) _["Object.prototype." + t[n]] = h + "Object.prototype." + t[n];
    for (var o, s = e.length; s-- > 0; ) {
        o = e[s];
        for (var i = [ "prototype" ].concat(Object.getOwnPropertyNames(o[1])), a = i.length; a-- > 0; ) _[o[0] + "." + i[a]] = h + o[0] + "." + i[a];
        x[o[0]] = h + o[0];
    }
    for (var l, c = r.length; c-- > 0; ) x[l = r[c]] = h + l;
}([ [ "Object", Object ], [ "Number", Number ], [ "Math", Math ], [ "String", String ], [ "Array", Array ], [ "JSON", JSON ], [ "Promise", Promise ] ], "\nFunction\nBoolean\n\nDate\nRegExp\nError\n\nsetTimeout\nclearTimeout\nsetInterval\nclearInterval\n\neval\nisFinite\nisNaN\nparseFloat\nparseInt\ndecodeURI\ndecodeURIComponent\nencodeURI\nencodeURIComponent\n".trim().split(/\W+/));

var j = /^[A-Z][^]*[a-z]/;

var k = "undefined" != typeof require ? require : n.createRequire("undefined" == typeof document ? require("url").pathToFileURL(__filename).href : m && m.src || new URL("index.js", document.baseURI).href);

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

var w = u(process.argv.slice(2), {
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
    if (console.log(v), w.help) console.log("help"); else {
        if (w.watch && console.clear(), console.log("rollup: v" + s.VERSION), console.log("babel:  v" + l.version), 
        console.log(""), w.dir = r.resolve(w.dir), w.src = r.resolve(w.dir, w.src), w.out = r.resolve(w.dir, w.out), 
        console.log(e.bgGreen(e.black(e.bold("dir: ") + w.dir))), console.log(e.bgGreen(e.black(e.bold("src: ") + w.src))), 
        console.log(e.bgGreen(e.black(e.bold("out: ") + w.out))), console.log(""), !w.out.startsWith(w.dir)) return printError("dir OUT must be in dir DIR");
        var n, u, m, f = r.resolve(w.dir, "package.json");
        if (!t.existsSync(f)) return printError("package.json not found in " + w.dir);
        function getExternals() {
            var e = JSON.parse(t.readFileSync(f, "utf8")), r = e.dependencies || {}, o = e.peerDependencies || {};
            n = function unique(e) {
                return e.filter(((e, r, t) => e && t.indexOf(e) === r)).sort();
            }([ ...Object.keys(process.binding("natives")), ...Object.keys(r), ...Object.keys(o) ]).map((e => new RegExp(`^${e}($|/|\\\\)`)));
        }
        if (console.log(e.bgMagenta(e.black(e.bold("package.json: ") + f))), console.log(""), 
        getExternals(), w.types) {
            if ("string" != typeof w.types && (w.types = "types"), w.types = r.resolve(w.dir, w.types), 
            console.log(e.bgGreen(e.black(e.bold("types: ") + w.types))), !w.types.startsWith(w.dir)) return console.log(e.bgRed(e.black("ERROR:"))), 
            printError("dir TYPES must be in dir DIR");
            if (u = function getTSC() {
                var r, t = e.bgBlue(e.black(e.bold("tsc: ")));
                try {
                    r = k.resolve(".bin/tsc"), console.log(t + e.bgBlue(e.black(r))), o.spawnSync(r, [ "-v" ], {
                        stdio: [ "ignore", "inherit", "inherit" ],
                        shell: !0
                    });
                } catch {
                    console.warn(t + e.bgRed(e.black("not found")));
                }
                return r;
            }()) {
                var g = r.resolve(w.dir, ".dester.tsconfig.json"), b = {};
                if (t.existsSync(g)) try {
                    b = JSON.parse(t.readFileSync(g)).compilerOptions || {};
                } catch {}
                var S = {
                    include: [ toPosix(r.resolve(w.src, "**/*")) ],
                    exclude: [ toPosix(r.resolve(w.src, "**/node_modules")), toPosix(r.resolve(w.src, "**/_*")), toPosix(r.resolve(w.src, "**/*.test.*")), toPosix(r.resolve(w.src, "**/*.tests.*")) ],
                    compilerOptions: {
                        ...b,
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
                        outDir: toPosix(w.types)
                    }
                };
                t.writeFileSync(g, JSON.stringify(S, null, 2));
                var O = o.spawn(u, [ "--build", g, ...w.watch ? [ "--watch" ] : [] ], {
                    cwd: w.src,
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
                var e = getInputValidFiles(w.src).map((function(e) {
                    var {dir: t, name: n} = r.parse(r.relative(w.src, e));
                    return {
                        id: e,
                        fileName: r.join(t, "index" === n ? n : r.join(n, "index"))
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
        }, I = {}, D = s.watch([ ".mjs", ".js" ].map((function(t, o) {
            return {
                output: {
                    exports: "named",
                    format: ".js" === t ? "commonjs" : "esm",
                    dir: w.out,
                    chunkFileNames: "_includes/[name]" + t,
                    generatedCode: N
                },
                external: function(e, r) {
                    return !!e.startsWith("node:") || (r ? /^\.?[/\\]|\\/.test(e) ? void 0 : !!n.length && n.some((r => r.test(e))) : void 0);
                },
                plugins: [ {
                    name: "chunks",
                    buildStart() {
                        m || getChunks(), o || (this.addWatchFile(w.src), this.addWatchFile(f));
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
                }, (u = w.ie, {
                    name: "babel-custom",
                    async transform(e) {
                        try {
                            e = (await l.transformAsync(e, {
                                presets: [ [ "@babel/preset-env", {
                                    corejs: 3,
                                    loose: !0,
                                    bugfixes: !0,
                                    modules: !1,
                                    useBuiltIns: "entry",
                                    targets: "> 1%, not dead" + (u ? ", ie " + (+u > 8 ? +u : 11) : "")
                                } ] ],
                                plugins: [ "@babel/plugin-transform-runtime", [ "@babel/plugin-transform-block-scoping", {
                                    throwIfClosureRequired: !0
                                } ] ]
                            })).code;
                        } catch (r) {
                            console.error("babel-custom"), console.error(r);
                        }
                        return {
                            code: e
                        };
                    }
                }), ...w.takeout ? [ c(_), c(x), {
                    name: h,
                    resolveId: e => e.startsWith(h) ? {
                        id: e,
                        external: !1
                    } : null,
                    load: e => e.startsWith(h) ? `const v = ${e.slice(14)}; export default v` : null
                } ] : [], a({
                    extensions: [ ".mjs", ".js", ".jsx", ".mts", ".ts", ".tsx", ".json" ]
                }), i(), (s = w.min, {
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
                                    keep_classnames: j,
                                    keep_fnames: j
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
                            var {fileName: s, facadeModuleId: i, exports: a} = n;
                            I[s] = {
                                facadeModuleId: i,
                                exports: a
                            };
                            try {
                                i && console.log(e.green("BUILD: " + r.relative(w.src, i) + " => " + r.relative(w.dir, r.join(w.out, s))));
                            } catch (l) {
                                console.error(l);
                            }
                        }
                        return "/* eslint-disable */\n" + t;
                    }
                } ]
            };
            var s, u;
        }))).on("change", (function(e, r) {
            e === f && getExternals(), "update" !== r.event && (m = null, console.log(r.event + ": " + e));
        })).on("event", (function(e) {
            if ("ERROR" === e.code) console.error(e); else if ("END" === e.code) {
                w.watch ? console.log("\n...WATCH...\n") : D.close(), console.log("");
                var n = I;
                if (I = {}, R === (R = JSON.stringify(n))) return;
                var o = JSON.parse(t.readFileSync(f, "utf8"));
                delete o.main, delete o.module, delete o.types;
                var s = {};
                if (o.files) for (var i of o.files) i = r.relative(w.dir, r.join(w.dir, i)), /^\.?[\\/]/.test(i) && printError(i), 
                s[i = i.split(/[\\/]/)[0]] = !0;
                var a, l, c, p, d, m, g, b = {}, v = {};
                for (var h in n) l = null, a = n[h].facadeModuleId, s[(c = r.relative(w.dir, r.join(w.out, h))).split(/[\\/]/)[0]] = !0, 
                a && (p = "./" + toPosix(r.dirname(c)), (d = "index.mjs" === c) && (o.main = "index", 
                o.module = "index.mjs", p = ".", s["index.js"] = s["index.mjs"] = !0), c = toPosix(c), 
                b[p] = {
                    import: "./" + c,
                    require: "./" + c.slice(0, -3) + "js"
                }, v[p] = n[h].exports, u && (l = toPosix((l = r.relative(w.dir, r.join(w.types, r.relative(w.src, a)))).replace(/\.([mc]?)[tj]s$/, ".d.$1ts")), 
                /\.d\.[mc]?ts$/.test(l) || printError("type: " + l), d && (o.types = l, s["index.d.ts"] = !0), 
                b[p].types = "./" + l));
                o.exports = {
                    "./package.json": "./package.json"
                };
                for (var _, x = Object.keys(b).sort(), j = 0; j < x.length; j++) if (_ = x[j], o.exports[_] = b[_], 
                u) {
                    var k = toPosix(r.relative(r.resolve(w.dir, r.dirname(b[_].import)), r.resolve(w.dir, b[_].types))).replace(/(\/index)?\.d\.\w+$/, "");
                    "." !== k[0] && (k = "./" + k);
                    var S = `export * from ${k = JSON.stringify(k)};\n`;
                    for (var O of v[_]) "default" === O ? S += `import { ${O} as __default__ } from ${k};\nexport { __default__ as default };\n` : "*" !== O[0] && (S += `export { ${O} } from ${k};\n`);
                    t.writeFileSync(r.resolve(w.dir, _, "index.d.ts"), S);
                }
                for (var N in o.files = [], u && (s[g = r.relative(w.dir, w.types).split(/[\\/]/)[0]] = !0), 
                s) u && "index.d.ts" === N ? o.files.push(N) : u && g && g === N ? o.files.push(N + "/**/*") : t.existsSync(m = r.join(w.dir, N)) && (
                //! FIX FOR NPM
                t.lstatSync(m).isDirectory() && (N += "/**/*"), o.files.push(N));
                o.files.sort();
                var $ = function sort_pkg_json(e) {
                    var r = {}, t = Object.keys(e).sort();
                    return [ ...y, ...t ].filter((function(e, r, n) {
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
