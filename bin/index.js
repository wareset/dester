/* eslint-disable */
const e = require("kleur"), t = require("path"), n = require("fs"), o = require("module"), r = require("child_process"), s = require("rollup"), i = require("@rollup/plugin-commonjs"), l = require("@rollup/plugin-node-resolve"), c = require("@babel/core"), a = require("@rollup/plugin-inject"), d = require("terser"), p = require("sucrase"), u = require("minimist"), m = RegExp, f = JSON, g = f.parse, b = Object, h = b.keys, y = f.stringify, {red: _, cyan: v, bold: x} = e, j = v(x(`\n    ___       ${_("__")} _ ${_("_ _ _ /_,_")}  ${_("_______   ____")}\n   / _ \\_${_("(/(/(_(")}/ ${_("(-_)(-/_ _)")} ${_("/ ___/ /  /  _/")}\n  / _/ / -_/_ —/ __/ -_/ __/ ${_("/ /__/ /___/ /")}\n  \\___/\\__/___/\\__/\\__/_/    ${_("\\___/____/___/")}\n\n`)), w = [].concat([ "$schema", "name", "displayName", "version" ], [ "private", "publishConfig" ], [ "description", "categories", "keywords", "license", "qna" ], [ "homepage", "bugs", "repository", "funding" ], [ "author", "maintainers", "contributors", "publisher" ], "sideEffects", "type", [ "proxy", "homepage" ], [ "flat", "resolutions", "workspaces" ], "bolt", "jsdelivr", "unpkg", [ "source", "umd:main" ], "jsnext:main", "main", "module", [ "types", "typesVersions", "typings" ], "files", "assets", [ "imports", "exports", "bin", "man", "directories" ], [ "browser", "esnext", "es2015", "esm", "module-browser", "modules.root" ], [ "engines", "engineStrict", "languageName", "os", "cpu" ], "preferGlobal", "example", "examplestyle", [ "binary", "scripts", "betterScripts", "capabilities", "activationEvents", "contributes", "husky", "simple-git-hooks", "commitlint", "lint-staged", "config", "nodemonConfig" ], [ "applypatch-msg", "pre-applypatch", "post-applypatch", "pre-commit", "pre-merge-commit", "prepare-commit-msg", "commit-msg", "post-commit", "pre-rebase", "post-checkout", "post-merge", "pre-push", "pre-receive", "update", "proc-receive", "post-receive", "post-update", "reference-transaction", "push-to-checkout", "pre-auto-gc", "post-rewrite", "sendemail-validate", "fsmonitor-watchman", "p4-changelist", "p4-prepare-changelist", "p4-post-changelist", "p4-pre-submit", "post-index-change" ], [ "flow", "flow:main" ], [ "browserify", "browserify.transform" ], "browserslist", "babel", "style", "xo", "prettier", [ "eslintConfig", "eslintIgnore" ], "npmpkgjsonlint", "remarkConfig", "stylelint", "ava", "jest", "mocha", "nyc", "tap", [ "react-native" ], [ "@std", "@std/esm" ], [ "jspm", "ignore", "format", "registry", "shim", "map" ], "size-limit", "pwmetrics", [ "peerDependencies", "peerDependenciesMeta", "optionalDependencies", "optionalDependenciesMeta", "bundledDependencies", "bundledDependenciesMeta", "bundleDependencies", "bundleDependenciesMeta", "devDependencies", "devDependenciesMeta", "dependencies", "dependenciesMeta" ], [ "extensionPack", "extensionDependencies", "icon", "badges", "galleryBanner", "preview", "markdown" ]);

const k = Number, R = Math, S = String, D = Array, $ = Promise, I = b.getOwnPropertyNames, q = b.prototype, N = "dester-inject-", O = {}, M = {};

!function(e, t) {
    for (let n = I(q), o = n.length; o-- > 0; ) O["Object.prototype." + n[o]] = N + "Object.prototype." + n[o];
    for (let n, o = e.length; o-- > 0; ) {
        n = e[o];
        for (let e = [ "prototype" ].concat(I(n[1])), t = e.length; t-- > 0; ) O[n[0] + "." + e[t]] = N + n[0] + "." + e[t];
        M[n[0]] = N + n[0];
    }
    for (let n, o = t.length; o-- > 0; ) M[n = t[o]] = N + n;
}([ [ "Object", b ], [ "Number", k ], [ "Math", R ], [ "String", S ], [ "Array", D ], [ "JSON", f ], [ "Promise", $ ] ], "\nFunction Boolean\nDate\nRegExp\nError\n\nsetTimeout\nclearTimeout\nsetInterval\nclearInterval\n\neval\nisFinite\nisNaN\nparseFloat\nparseInt\ndecodeURI\ndecodeURIComponent\nencodeURI\nencodeURIComponent\n".trim().split(/\W+/));

const F = R.max;

const E = "undefined" != typeof require ? require : o.createRequire("undefined" == typeof document ? new (require("url").URL)("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("index.js", document.baseURI).href);

function C(e) {
    return e.replace(/[/\\]+/, "/");
}

function U(e) {
    const o = [], r = n.readdirSync(e, {
        withFileTypes: !0
    });
    for (let n, s, i = r.length; i-- > 0; ) n = r[i], /^[^._]/.test(n.name) && !/\.tests?($|\.)/i.test(n.name) && (s = t.join(e, n.name), 
    n.isDirectory() ? o.push(...U(s)) : /\.[mc]?[jt]s$/.test(n.name) && o.push(s));
    return o;
}

function W(t) {
    throw console.log(e.bgRed(e.black("ERROR: " + t))), process.kill(0), t;
}

const B = u(process.argv.slice(2), {
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
    if (console.log(j), B.help) console.log("help"); else {
        if (B.watch && console.clear(), console.log("rollup: v" + s.VERSION), console.log("babel:  v" + c.version), 
        console.log(""), B.dir = t.resolve(B.dir), B.src = t.resolve(B.dir, B.src), B.out = t.resolve(B.dir, B.out), 
        console.log(e.bgGreen(e.black(e.bold("dir: ") + B.dir))), console.log(e.bgGreen(e.black(e.bold("src: ") + B.src))), 
        console.log(e.bgGreen(e.black(e.bold("out: ") + B.out))), console.log(""), !B.out.startsWith(B.dir)) return W("dir OUT must be in dir DIR");
        const f = t.resolve(B.dir, "package.json");
        if (!n.existsSync(f)) return W("package.json not found in " + B.dir);
        let b, _, v;
        function o() {
            const e = g(n.readFileSync(f, "utf8")), t = e.dependencies || {}, o = e.peerDependencies || {};
            var r;
            b = (r = [ ...h(process.binding("natives")), ...h(t), ...h(o) ], r.filter(((e, t, n) => e && n.indexOf(e) === t)).sort()).map((e => new m(`^${e}($|/|\\\\)`)));
        }
        if (console.log(e.bgMagenta(e.black(e.bold("package.json: ") + f))), console.log(""), 
        o(), B.types) {
            if ("string" != typeof B.types && (B.types = "types"), B.types = t.resolve(B.dir, B.types), 
            console.log(e.bgGreen(e.black(e.bold("types: ") + B.types))), !B.types.startsWith(B.dir)) return console.log(e.bgRed(e.black("ERROR:"))), 
            W("dir TYPES must be in dir DIR");
            if (_ = function() {
                let t;
                const n = e.bgBlue(e.black(e.bold("tsc: ")));
                try {
                    t = E.resolve(".bin/tsc"), console.log(n + e.bgBlue(e.black(t))), r.spawnSync(t, [ "-v" ], {
                        stdio: [ "ignore", "inherit", "inherit" ],
                        shell: !0
                    });
                } catch {
                    console.warn(n + e.bgRed(e.black("not found")));
                }
                return t;
            }()) {
                const D = t.resolve(B.dir, ".dester.tsconfig.json");
                let $ = {};
                if (n.existsSync(D)) try {
                    $ = g(n.readFileSync(D)).compilerOptions || {};
                } catch {}
                const I = {
                    include: [ C(t.resolve(B.src, "**/*")) ],
                    exclude: [ C(t.resolve(B.src, "**/node_modules")), C(t.resolve(B.src, "**/_*")), C(t.resolve(B.src, "**/*.test.*")), C(t.resolve(B.src, "**/*.tests.*")) ],
                    compilerOptions: {
                        ...$,
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
                        outDir: C(B.types)
                    }
                };
                n.writeFileSync(D, y(I, null, 2));
                const q = r.spawn(_, [ "--build", D, ...B.watch ? [ "--watch" ] : [] ], {
                    cwd: B.src,
                    shell: !0
                });
                q.stdout.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgBlue(e.black("tsc: "))), console.dir(t);
                })), q.stderr.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgRed(e.black("tsc: "))), console.dir(t);
                }));
                const T = function() {
                    q.kill(0);
                };
                process.on("SIGTERM", T), process.on("exit", T);
            }
        }
        function u() {
            if (!v) {
                const e = U(B.src).map((function(e) {
                    const {dir: n, name: o} = t.parse(t.relative(B.src, e));
                    return {
                        id: e,
                        fileName: t.join(n, "index" === o ? o : t.join(o, "index"))
                    };
                }));
                v = e.sort((function(e, t) {
                    return e.fileName.localeCompare(t.fileName);
                }));
            }
        }
        console.log("");
        const x = {
            preset: "es5",
            arrowFunctions: !1,
            constBindings: !0,
            objectShorthand: !1,
            reservedNamesAsProps: !0,
            symbols: !1
        };
        let k, R = {};
        const S = s.watch([ ".mjs", ".js" ].map((function(n, o) {
            return {
                output: {
                    exports: "named",
                    format: ".js" === n ? "commonjs" : "esm",
                    dir: B.out,
                    chunkFileNames: "_includes/[name]" + n,
                    generatedCode: x
                },
                external: function(e, t) {
                    return !!e.startsWith("node:") || (t ? /^\.?[/\\]|\\/.test(e) ? void 0 : !!b.length && b.some((t => t.test(e))) : void 0);
                },
                plugins: [ {
                    name: "chunks",
                    buildStart() {
                        v || u(), o || (this.addWatchFile(B.src), this.addWatchFile(f));
                        for (let e = v.length; e-- > 0; ) this.emitFile({
                            type: "chunk",
                            id: v[e].id,
                            fileName: v[e].fileName + n,
                            generatedCode: x
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
                }, ...B.ie ? [ (s = B.ie, {
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
                                    targets: "> 1%, not dead" + (s ? ", ie " + F(9, +s || 11) : "")
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
                }) ] : [], a(O), a(M), {
                    name: N,
                    resolveId: e => e.startsWith(N) ? {
                        id: e,
                        external: !1
                    } : null,
                    load: e => e.startsWith(N) ? `const v = ${e.slice(N.length)}; export default v` : null
                }, l({
                    extensions: [ ".mjs", ".js", ".jsx", ".mts", ".ts", ".tsx", ".json" ]
                }), i(), (r = B.min, {
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
                    renderChunk(n, r) {
                        if (!o) {
                            const {fileName: n, facadeModuleId: o, exports: i} = r;
                            R[n] = {
                                facadeModuleId: o,
                                exports: i
                            };
                            try {
                                o && console.log(e.green("BUILD: " + t.relative(B.src, o) + " => " + t.relative(B.dir, t.join(B.out, n))));
                            } catch (s) {
                                console.error(s);
                            }
                        }
                        return "/* eslint-disable */\n" + n;
                    }
                } ]
            };
            var r, s;
        }))).on("change", (function(e, t) {
            e === f && o(), "update" !== t.event && (v = null, console.log(t.event + ": " + e));
        })).on("event", (function(e) {
            if ("ERROR" === e.code) console.error(e); else if ("END" === e.code) {
                B.watch ? console.log("\n...WATCH...\n") : S.close(), console.log("");
                const e = R;
                if (R = {}, k === (k = y(e))) return;
                const o = g(n.readFileSync(f, "utf8"));
                delete o.main, delete o.module, delete o.types;
                const r = {};
                if (o.files) for (let n of o.files) n = t.relative(B.dir, t.join(B.dir, n)), /^\.?[\\/]/.test(n) && W(n), 
                n = n.split(/[\\/]/)[0], r[n] = !0;
                const s = {}, i = {};
                let l, c, a, d, p, u, m;
                for (const n in e) c = null, l = e[n].facadeModuleId, a = t.relative(B.dir, t.join(B.out, n)), 
                r[a.split(/[\\/]/)[0]] = !0, l && (d = "./" + C(t.dirname(a)), (p = "index.mjs" === a) && (o.main = "index", 
                o.module = "index.mjs", d = ".", r["index.js"] = r["index.mjs"] = !0), a = C(a), 
                s[d] = {
                    import: "./" + a,
                    require: "./" + a.slice(0, -3) + "js"
                }, i[d] = e[n].exports, _ && (c = t.relative(B.dir, t.join(B.types, t.relative(B.src, l))), 
                c = C(c.replace(/\.([mc]?)[tj]s$/, ".d.$1ts")), /\.d\.[mc]?ts$/.test(c) || W("type: " + c), 
                p && (o.types = c, r["index.d.ts"] = !0), s[d].types = "./" + c));
                o.exports = {
                    "./package.json": "./package.json"
                };
                for (let f, g = h(s).sort(), v = 0; v < g.length; v++) if (f = g[v], o.exports[f] = s[f], 
                _) {
                    let e = C(t.relative(t.resolve(B.dir, t.dirname(s[f].import)), t.resolve(B.dir, s[f].types))).replace(/(\/index)?\.d\.\w+$/, "");
                    "." !== e[0] && (e = "./" + e), e = y(e);
                    let o = `export * from ${e};\n`;
                    for (const t of i[f]) "default" === t ? o += `import { ${t} as __default__ } from ${e};\nexport { __default__ as default };\n` : "*" !== t[0] && (o += `export { ${t} } from ${e};\n`);
                    n.writeFileSync(t.resolve(B.dir, f, "index.d.ts"), o);
                }
                o.files = [], _ && (r[m = t.relative(B.dir, B.types).split(/[\\/]/)[0]] = !0);
                for (let f in r) _ && "index.d.ts" === f ? o.files.push(f) : _ && m && m === f ? o.files.push(f + "/**/*") : n.existsSync(u = t.join(B.dir, f)) && (
                //! FIX FOR NPM
                n.lstatSync(u).isDirectory() && (f += "/**/*"), o.files.push(f));
                o.files.sort();
                const b = function(e) {
                    const t = {}, n = h(e).sort();
                    return [ ...w, ...n ].filter((function(e, t, o) {
                        return n.indexOf(e) > -1 && t === o.indexOf(e);
                    })).forEach((function(n) {
                        t[n] = e[n];
                    })), t;
                }(o);
                n.writeFileSync(f, y(b, null, 2));
            }
        }));
    }
}();
