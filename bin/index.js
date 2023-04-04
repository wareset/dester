/* eslint-disable */
const e = require("kleur"), t = require("path"), n = require("fs"), o = require("module"), s = require("child_process"), r = require("rollup"), i = require("@rollup/plugin-commonjs"), l = require("@rollup/plugin-node-resolve"), c = require("@babel/core"), a = require("@rollup/plugin-inject"), d = require("terser"), p = require("sucrase"), u = require("minimist"), m = RegExp, f = JSON, g = f.parse, h = Object, _ = h.keys, b = f.stringify, {red: y, cyan: x, bold: v} = e, R = x(v(`\n    ___       ${y("__")} _ ${y("_ _ _ /_,_")}  ${y("_______   ____")}\n   / _ \\_${y("(/(/(_(")}/ ${y("(-_)(-/_ _)")} ${y("/ ___/ /  /  _/")}\n  / _/ / -_/_ —/ __/ -_/ __/ ${y("/ /__/ /___/ /")}\n  \\___/\\__/___/\\__/\\__/_/    ${y("\\___/____/___/")}\n\n`)), j = [].concat([ "$schema", "name", "displayName", "version" ], [ "private", "publishConfig" ], [ "description", "categories", "keywords", "license", "qna" ], [ "homepage", "bugs", "repository", "funding" ], [ "author", "maintainers", "contributors", "publisher" ], "sideEffects", "type", [ "proxy", "homepage" ], [ "flat", "resolutions", "workspaces" ], "bolt", "jsdelivr", "unpkg", [ "source", "umd:main" ], "jsnext:main", "main", "module", [ "types", "typesVersions", "typings" ], "files", "assets", [ "imports", "exports", "bin", "man", "directories" ], [ "browser", "esnext", "es2015", "esm", "module-browser", "modules.root" ], [ "engines", "engineStrict", "languageName", "os", "cpu" ], "preferGlobal", "example", "examplestyle", [ "binary", "scripts", "betterScripts", "capabilities", "activationEvents", "contributes", "husky", "simple-git-hooks", "commitlint", "lint-staged", "config", "nodemonConfig" ], [ "applypatch-msg", "pre-applypatch", "post-applypatch", "pre-commit", "pre-merge-commit", "prepare-commit-msg", "commit-msg", "post-commit", "pre-rebase", "post-checkout", "post-merge", "pre-push", "pre-receive", "update", "proc-receive", "post-receive", "post-update", "reference-transaction", "push-to-checkout", "pre-auto-gc", "post-rewrite", "sendemail-validate", "fsmonitor-watchman", "p4-changelist", "p4-prepare-changelist", "p4-post-changelist", "p4-pre-submit", "post-index-change" ], [ "flow", "flow:main" ], [ "browserify", "browserify.transform" ], "browserslist", "babel", "style", "xo", "prettier", [ "eslintConfig", "eslintIgnore" ], "npmpkgjsonlint", "remarkConfig", "stylelint", "ava", "jest", "mocha", "nyc", "tap", [ "react-native" ], [ "@std", "@std/esm" ], [ "jspm", "ignore", "format", "registry", "shim", "map" ], "size-limit", "pwmetrics", [ "peerDependencies", "peerDependenciesMeta", "optionalDependencies", "optionalDependenciesMeta", "bundledDependencies", "bundledDependenciesMeta", "bundleDependencies", "bundleDependenciesMeta", "devDependencies", "devDependenciesMeta", "dependencies", "dependenciesMeta" ], [ "extensionPack", "extensionDependencies", "icon", "badges", "galleryBanner", "preview", "markdown" ]);

const k = Number, w = Math, S = String, D = Array, I = Promise, O = h.getOwnPropertyNames, $ = h.prototype, E = "dester-inject-", q = {}, N = {};

!function(e, t) {
    for (let n = O($), o = n.length; o-- > 0; ) q["Object.prototype." + n[o]] = E + "Object.prototype." + n[o];
    for (let n, o = e.length; o-- > 0; ) {
        n = e[o];
        for (let e = [ "prototype" ].concat(O(n[1])), t = e.length; t-- > 0; ) q[n[0] + "." + e[t]] = E + n[0] + "." + e[t];
        N[n[0]] = E + n[0];
    }
    for (let n, o = t.length; o-- > 0; ) N[n = t[o]] = E + n;
}([ [ "Object", h ], [ "Number", k ], [ "Math", w ], [ "String", S ], [ "Array", D ], [ "JSON", f ], [ "Promise", I ] ], "\nFunction Boolean\nDate\nRegExp\nError\n\nsetTimeout\nclearTimeout\nsetInterval\nclearInterval\n\neval\nisFinite\nisNaN\nparseFloat\nparseInt\ndecodeURI\ndecodeURIComponent\nencodeURI\nencodeURIComponent\n".trim().split(/\W+/));

const F = /^[A-Z][^]*[a-z]/;

const P = "undefined" != typeof require ? require : o.createRequire("undefined" == typeof document ? new (require("url").URL)("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("index.js", document.baseURI).href);

function toPosix(e) {
    return e.replace(/[/\\]+/, "/");
}

function getInputValidFiles(e) {
    const o = [], s = n.readdirSync(e, {
        withFileTypes: !0
    });
    for (let n, r, i = s.length; i-- > 0; ) n = s[i], /^[^._]/.test(n.name) && !/\.tests?($|\.)/i.test(n.name) && (r = t.join(e, n.name), 
    n.isDirectory() ? o.push(...getInputValidFiles(r)) : /\.[mc]?[jt]s$/.test(n.name) && o.push(r));
    return o;
}

function ERROR(t) {
    throw console.log(e.bgRed(e.black("ERROR: " + t))), process.kill(0), t;
}

const M = u(process.argv.slice(2), {
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
    if (console.log(R), M.help) console.log("help"); else {
        if (M.watch && console.clear(), console.log("rollup: v" + r.VERSION), console.log("babel:  v" + c.version), 
        console.log(""), M.dir = t.resolve(M.dir), M.src = t.resolve(M.dir, M.src), M.out = t.resolve(M.dir, M.out), 
        console.log(e.bgGreen(e.black(e.bold("dir: ") + M.dir))), console.log(e.bgGreen(e.black(e.bold("src: ") + M.src))), 
        console.log(e.bgGreen(e.black(e.bold("out: ") + M.out))), console.log(""), !M.out.startsWith(M.dir)) return ERROR("dir OUT must be in dir DIR");
        const o = t.resolve(M.dir, "package.json");
        if (!n.existsSync(o)) return ERROR("package.json not found in " + M.dir);
        let u, f, h;
        function getExternals() {
            const e = g(n.readFileSync(o, "utf8")), t = e.dependencies || {}, s = e.peerDependencies || {};
            u = function unique(e) {
                return e.filter(((e, t, n) => e && n.indexOf(e) === t)).sort();
            }([ ..._(process.binding("natives")), ..._(t), ..._(s) ]).map((e => new m(`^${e}($|/|\\\\)`)));
        }
        if (console.log(e.bgMagenta(e.black(e.bold("package.json: ") + o))), console.log(""), 
        getExternals(), M.types) {
            if ("string" != typeof M.types && (M.types = "types"), M.types = t.resolve(M.dir, M.types), 
            console.log(e.bgGreen(e.black(e.bold("types: ") + M.types))), !M.types.startsWith(M.dir)) return console.log(e.bgRed(e.black("ERROR:"))), 
            ERROR("dir TYPES must be in dir DIR");
            if (f = function getTSC() {
                let t;
                const n = e.bgBlue(e.black(e.bold("tsc: ")));
                try {
                    t = P.resolve(".bin/tsc"), console.log(n + e.bgBlue(e.black(t))), s.spawnSync(t, [ "-v" ], {
                        stdio: [ "ignore", "inherit", "inherit" ],
                        shell: !0
                    });
                } catch {
                    console.warn(n + e.bgRed(e.black("not found")));
                }
                return t;
            }()) {
                const w = t.resolve(M.dir, ".dester.tsconfig.json");
                let S = {};
                if (n.existsSync(w)) try {
                    S = g(n.readFileSync(w)).compilerOptions || {};
                } catch {}
                const D = {
                    include: [ toPosix(t.resolve(M.src, "**/*")) ],
                    exclude: [ toPosix(t.resolve(M.src, "**/node_modules")), toPosix(t.resolve(M.src, "**/_*")), toPosix(t.resolve(M.src, "**/*.test.*")), toPosix(t.resolve(M.src, "**/*.tests.*")) ],
                    compilerOptions: {
                        ...S,
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
                        outDir: toPosix(M.types)
                    }
                };
                n.writeFileSync(w, b(D, null, 2));
                const I = s.spawn(f, [ "--build", w, ...M.watch ? [ "--watch" ] : [] ], {
                    cwd: M.src,
                    shell: !0
                });
                I.stdout.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgBlue(e.black("tsc: "))), console.dir(t);
                })), I.stderr.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgRed(e.black("tsc: "))), console.dir(t);
                }));
                const tscExit = function() {
                    I.kill(0);
                };
                process.on("SIGTERM", tscExit), process.on("exit", tscExit);
            }
        }
        function getChunks() {
            if (!h) {
                const e = getInputValidFiles(M.src).map((function(e) {
                    const {dir: n, name: o} = t.parse(t.relative(M.src, e));
                    return {
                        id: e,
                        fileName: t.join(n, "index" === o ? o : t.join(o, "index"))
                    };
                }));
                h = e.sort((function(e, t) {
                    return e.fileName.localeCompare(t.fileName);
                }));
            }
        }
        console.log("");
        const y = {
            preset: "es5",
            arrowFunctions: !1,
            constBindings: !0,
            objectShorthand: !1,
            reservedNamesAsProps: !0,
            symbols: !1
        };
        let x, v = {};
        const k = r.watch([ ".mjs", ".js" ].map((function(n, s) {
            return {
                output: {
                    exports: "named",
                    format: ".js" === n ? "commonjs" : "esm",
                    dir: M.out,
                    chunkFileNames: "_includes/[name]" + n,
                    generatedCode: y
                },
                external: function(e, t) {
                    return !!e.startsWith("node:") || (t ? /^\.?[/\\]|\\/.test(e) ? void 0 : !!u.length && u.some((t => t.test(e))) : void 0);
                },
                plugins: [ {
                    name: "chunks",
                    buildStart() {
                        h || getChunks(), s || (this.addWatchFile(M.src), this.addWatchFile(o));
                        for (let e = h.length; e-- > 0; ) this.emitFile({
                            type: "chunk",
                            id: h[e].id,
                            fileName: h[e].fileName + n,
                            generatedCode: y
                        });
                    }
                }, {
                    name: "sucrase-custom",
                    transform(e, t) {
                        if (/\.[mc]?tsx?$/.test(t)) {
                            try {
                                e = p.transform(e, {
                                    transforms: [ "typescript" ]
                                }).code;
                            } catch (n) {
                                console.error("sucrase-custom"), console.error(n);
                            }
                            return {
                                code: e
                            };
                        }
                        return null;
                    }
                }, ...M.ie ? [ (m = M.ie, {
                    name: "babel-custom",
                    async transform(e) {
                        try {
                            e = (await c.transformAsync(e, {
                                presets: [ [ "@babel/preset-env", {
                                    corejs: 3,
                                    loose: !0,
                                    bugfixes: !0,
                                    modules: !1,
                                    useBuiltIns: "entry",
                                    targets: "> 1%, not dead" + (m ? ", ie " + (+m > 8 ? +m : 11) : "")
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
                }) ] : [], a(q), a(N), {
                    name: E,
                    resolveId: e => e.startsWith(E) ? {
                        id: e,
                        external: !1
                    } : null,
                    load: e => e.startsWith(E) ? `const v = ${e.slice(E.length)}; export default v` : null
                }, l({
                    extensions: [ ".mjs", ".js", ".jsx", ".mts", ".ts", ".tsx", ".json" ]
                }), i(), (r = M.min, {
                    name: "terser-custom",
                    async renderChunk(e) {
                        try {
                            e = (await d.minify(e, {
                                safari10: !0,
                                mangle: !0,
                                module: !0,
                                toplevel: !0,
                                compress: !0,
                                ...r ? {
                                    keep_classnames: F,
                                    keep_fnames: F
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
                    renderChunk(n, o) {
                        if (!s) {
                            const {fileName: n, facadeModuleId: s, exports: i} = o;
                            v[n] = {
                                facadeModuleId: s,
                                exports: i
                            };
                            try {
                                s && console.log(e.green("BUILD: " + t.relative(M.src, s) + " => " + t.relative(M.dir, t.join(M.out, n))));
                            } catch (r) {
                                console.error(r);
                            }
                        }
                        return "/* eslint-disable */\n" + n;
                    }
                } ]
            };
            var r, m;
        }))).on("change", (function(e, t) {
            e === o && getExternals(), "update" !== t.event && (h = null, console.log(t.event + ": " + e));
        })).on("event", (function(e) {
            if ("ERROR" === e.code) console.error(e); else if ("END" === e.code) {
                M.watch ? console.log("\n...WATCH...\n") : k.close(), console.log("");
                const e = v;
                if (v = {}, x === (x = b(e))) return;
                const s = g(n.readFileSync(o, "utf8"));
                delete s.main, delete s.module, delete s.types;
                const r = {};
                if (s.files) for (let n of s.files) n = t.relative(M.dir, t.join(M.dir, n)), /^\.?[\\/]/.test(n) && ERROR(n), 
                n = n.split(/[\\/]/)[0], r[n] = !0;
                const i = {}, l = {};
                let c, a, d, p, u, m, h;
                for (const n in e) a = null, c = e[n].facadeModuleId, d = t.relative(M.dir, t.join(M.out, n)), 
                r[d.split(/[\\/]/)[0]] = !0, c && (p = "./" + toPosix(t.dirname(d)), (u = "index.mjs" === d) && (s.main = "index", 
                s.module = "index.mjs", p = ".", r["index.js"] = r["index.mjs"] = !0), d = toPosix(d), 
                i[p] = {
                    import: "./" + d,
                    require: "./" + d.slice(0, -3) + "js"
                }, l[p] = e[n].exports, f && (a = t.relative(M.dir, t.join(M.types, t.relative(M.src, c))), 
                a = toPosix(a.replace(/\.([mc]?)[tj]s$/, ".d.$1ts")), /\.d\.[mc]?ts$/.test(a) || ERROR("type: " + a), 
                u && (s.types = a, r["index.d.ts"] = !0), i[p].types = "./" + a));
                s.exports = {
                    "./package.json": "./package.json"
                };
                for (let o, g = _(i).sort(), x = 0; x < g.length; x++) if (o = g[x], s.exports[o] = i[o], 
                f) {
                    let e = toPosix(t.relative(t.resolve(M.dir, t.dirname(i[o].import)), t.resolve(M.dir, i[o].types))).replace(/(\/index)?\.d\.\w+$/, "");
                    "." !== e[0] && (e = "./" + e), e = b(e);
                    let s = `export * from ${e};\n`;
                    for (const t of l[o]) "default" === t ? s += `import { ${t} as __default__ } from ${e};\nexport { __default__ as default };\n` : "*" !== t[0] && (s += `export { ${t} } from ${e};\n`);
                    n.writeFileSync(t.resolve(M.dir, o, "index.d.ts"), s);
                }
                s.files = [], f && (r[h = t.relative(M.dir, M.types).split(/[\\/]/)[0]] = !0);
                for (let o in r) f && "index.d.ts" === o ? s.files.push(o) : f && h && h === o ? s.files.push(o + "/**/*") : n.existsSync(m = t.join(M.dir, o)) && (
                //! FIX FOR NPM
                n.lstatSync(m).isDirectory() && (o += "/**/*"), s.files.push(o));
                s.files.sort();
                const y = function sort_pkg_json(e) {
                    const t = {}, n = _(e).sort();
                    return [ ...j, ...n ].filter((function(e, t, o) {
                        return n.indexOf(e) > -1 && t === o.indexOf(e);
                    })).forEach((function(n) {
                        t[n] = e[n];
                    })), t;
                }(s);
                n.writeFileSync(o, b(y, null, 2));
            }
        }));
    }
}();
