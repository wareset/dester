/* eslint-disable */
const e = require("kleur"), t = require("path"), n = require("fs"), o = require("module"), r = require("child_process"), s = require("rollup"), i = require("@rollup/plugin-commonjs"), l = require("@rollup/plugin-node-resolve"), c = require("@babel/core"), a = require("@rollup/plugin-inject"), d = require("terser"), p = require("sucrase"), u = require("minimist"), m = JSON, f = m.parse, g = Object, b = g.keys, h = RegExp, y = m.stringify, {red: _, cyan: v, bold: x} = e, j = v(x(`\n    ___       ${_("__")} _ ${_("_ _ _ /_,_")}  ${_("_______   ____")}\n   / _ \\_${_("(/(/(_(")}/ ${_("(-_)(-/_ _)")} ${_("/ ___/ /  /  _/")}\n  / _/ / -_/_ —/ __/ -_/ __/ ${_("/ /__/ /___/ /")}\n  \\___/\\__/___/\\__/\\__/_/    ${_("\\___/____/___/")}\n\n`)), w = [].concat([ "$schema", "name", "displayName", "version" ], [ "private", "publishConfig" ], [ "description", "categories", "keywords", "license", "qna" ], [ "homepage", "bugs", "repository", "funding" ], [ "author", "maintainers", "contributors", "publisher" ], "sideEffects", "type", [ "proxy", "homepage" ], [ "flat", "resolutions", "workspaces" ], "bolt", "jsdelivr", "unpkg", [ "source", "umd:main" ], "jsnext:main", "main", "module", [ "types", "typesVersions", "typings" ], "files", "assets", [ "imports", "exports", "bin", "man", "directories" ], [ "browser", "esnext", "es2015", "esm", "module-browser", "modules.root" ], [ "engines", "engineStrict", "languageName", "os", "cpu" ], "preferGlobal", "example", "examplestyle", [ "binary", "scripts", "betterScripts", "capabilities", "activationEvents", "contributes", "husky", "simple-git-hooks", "commitlint", "lint-staged", "config", "nodemonConfig" ], [ "applypatch-msg", "pre-applypatch", "post-applypatch", "pre-commit", "pre-merge-commit", "prepare-commit-msg", "commit-msg", "post-commit", "pre-rebase", "post-checkout", "post-merge", "pre-push", "pre-receive", "update", "proc-receive", "post-receive", "post-update", "reference-transaction", "push-to-checkout", "pre-auto-gc", "post-rewrite", "sendemail-validate", "fsmonitor-watchman", "p4-changelist", "p4-prepare-changelist", "p4-post-changelist", "p4-pre-submit", "post-index-change" ], [ "flow", "flow:main" ], [ "browserify", "browserify.transform" ], "browserslist", "babel", "style", "xo", "prettier", [ "eslintConfig", "eslintIgnore" ], "npmpkgjsonlint", "remarkConfig", "stylelint", "ava", "jest", "mocha", "nyc", "tap", [ "react-native" ], [ "@std", "@std/esm" ], [ "jspm", "ignore", "format", "registry", "shim", "map" ], "size-limit", "pwmetrics", [ "peerDependencies", "peerDependenciesMeta", "optionalDependencies", "optionalDependenciesMeta", "bundledDependencies", "bundledDependenciesMeta", "bundleDependencies", "bundleDependenciesMeta", "devDependencies", "devDependenciesMeta", "dependencies", "dependenciesMeta" ], [ "extensionPack", "extensionDependencies", "icon", "badges", "galleryBanner", "preview", "markdown" ]);

const k = g.getOwnPropertyNames, R = g.prototype, S = Math, D = "dester-inject-", $ = function(e, t) {
    const n = {};
    for (let o = k(R), r = o.length; r-- > 0; ) n["Object.prototype." + o[r]] = D + "Object.prototype." + o[r];
    for (let o, r = e.length; r-- > 0; ) {
        o = e[r];
        for (let e = [ "prototype" ].concat(k(o[1])), t = e.length; t-- > 0; ) n[o[0] + "." + e[t]] = D + o[0] + "." + e[t];
        n[o[0]] = D + o[0];
    }
    for (let o, r = t.length; r-- > 0; ) n[o = t[r]] = D + o;
    return n;
}([ [ "Object", g ], [ "Number", Number ], [ "Math", S ], [ "String", String ], [ "Array", Array ], [ "JSON", m ], [ "Promise", Promise ] ], "\nFunction Boolean\nDate\nRegExp\nError\n\nsetTimeout\nclearTimeout\nsetInterval\nclearInterval\n\neval\nisFinite\nisNaN\nparseFloat\nparseInt\ndecodeURI\ndecodeURIComponent\nencodeURI\nencodeURIComponent\n".trim().split(/\W+/));

const I = S.max;

const q = "undefined" != typeof require ? require : o.createRequire("undefined" == typeof document ? new (require("url").URL)("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("index.js", document.baseURI).href);

function N(e) {
    return e.replace(/[/\\]+/, "/");
}

function O(e) {
    const o = [], r = n.readdirSync(e, {
        withFileTypes: !0
    });
    for (let n, s, i = r.length; i-- > 0; ) n = r[i], /^[^._]/.test(n.name) && !/\.tests?($|\.)/i.test(n.name) && (s = t.join(e, n.name), 
    n.isDirectory() ? o.push(...O(s)) : /\.[mc]?[jt]s$/.test(n.name) && o.push(s));
    return o;
}

function M(t) {
    throw console.log(e.bgRed(e.black("ERROR: " + t))), process.kill(0), t;
}

const F = u(process.argv.slice(2), {
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
    if (console.log(j), F.help) console.log("help"); else {
        if (F.watch && console.clear(), console.log("rollup: v" + s.VERSION), console.log("babel:  v" + c.version), 
        console.log(""), F.dir = t.resolve(F.dir), F.src = t.resolve(F.dir, F.src), F.out = t.resolve(F.dir, F.out), 
        console.log(e.bgGreen(e.black(e.bold("dir: ") + F.dir))), console.log(e.bgGreen(e.black(e.bold("src: ") + F.src))), 
        console.log(e.bgGreen(e.black(e.bold("out: ") + F.out))), console.log(""), !F.out.startsWith(F.dir)) return M("dir OUT must be in dir DIR");
        const m = t.resolve(F.dir, "package.json");
        if (!n.existsSync(m)) return M("package.json not found in " + F.dir);
        let g, _, v;
        function o() {
            const e = f(n.readFileSync(m, "utf8")), t = e.dependencies || {}, o = e.peerDependencies || {};
            var r;
            g = (r = [ ...b(process.binding("natives")), ...b(t), ...b(o) ], r.filter(((e, t, n) => e && n.indexOf(e) === t)).sort()).map((e => new h(`^${e}($|/|\\\\)`)));
        }
        if (console.log(e.bgMagenta(e.black(e.bold("package.json: ") + m))), console.log(""), 
        o(), F.types) {
            if ("string" != typeof F.types && (F.types = "types"), F.types = t.resolve(F.dir, F.types), 
            console.log(e.bgGreen(e.black(e.bold("types: ") + F.types))), !F.types.startsWith(F.dir)) return console.log(e.bgRed(e.black("ERROR:"))), 
            M("dir TYPES must be in dir DIR");
            if (_ = function() {
                let t;
                const n = e.bgBlue(e.black(e.bold("tsc: ")));
                try {
                    t = q.resolve(".bin/tsc"), console.log(n + e.bgBlue(e.black(t))), r.spawnSync(t, [ "-v" ], {
                        stdio: [ "ignore", "inherit", "inherit" ],
                        shell: !0
                    });
                } catch {
                    console.warn(n + e.bgRed(e.black("not found")));
                }
                return t;
            }()) {
                const E = t.resolve(F.dir, ".dester.tsconfig.json");
                let C = {};
                if (n.existsSync(E)) try {
                    C = f(n.readFileSync(E)).compilerOptions || {};
                } catch {}
                const U = {
                    include: [ N(t.resolve(F.src, "**/*")) ],
                    exclude: [ N(t.resolve(F.src, "**/node_modules")), N(t.resolve(F.src, "**/_*")), N(t.resolve(F.src, "**/*.test.*")), N(t.resolve(F.src, "**/*.tests.*")) ],
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
                        outDir: N(F.types)
                    }
                };
                n.writeFileSync(E, y(U, null, 2));
                const W = r.spawn(_, [ "--build", E, ...F.watch ? [ "--watch" ] : [] ], {
                    cwd: F.src,
                    shell: !0
                });
                W.stdout.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgBlue(e.black("tsc: "))), console.dir(t);
                })), W.stderr.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgRed(e.black("tsc: "))), console.dir(t);
                }));
                const B = function() {
                    W.kill(0);
                };
                process.on("SIGTERM", B), process.on("exit", B);
            }
        }
        function u() {
            if (!v) {
                const e = O(F.src).map((function(e) {
                    const {dir: n, name: o} = t.parse(t.relative(F.src, e));
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
                    dir: F.out,
                    chunkFileNames: "_includes/[name]" + n,
                    generatedCode: x
                },
                external: function(e, t) {
                    return !!e.startsWith("node:") || (t ? /^\.?[/\\]|\\/.test(e) ? void 0 : !!g.length && g.some((t => t.test(e))) : void 0);
                },
                plugins: [ {
                    name: "chunks",
                    buildStart() {
                        v || u(), o || (this.addWatchFile(F.src), this.addWatchFile(m));
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
                }, ...F.ie ? [ (s = F.ie, {
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
                                    targets: "> 1%, not dead" + (s ? ", ie " + I(9, +s || 11) : "")
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
                }) ] : [], a($), {
                    name: D,
                    resolveId: e => e.startsWith(D) ? {
                        id: e,
                        external: !1
                    } : null,
                    load: e => e.startsWith(D) ? `const v = ${e.slice(D.length)}; export default v` : null
                }, l({
                    extensions: [ ".mjs", ".js", ".jsx", ".mts", ".ts", ".tsx", ".json" ]
                }), i(), (r = F.min, {
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
                                o && console.log(e.green("BUILD: " + t.relative(F.src, o) + " => " + t.relative(F.dir, t.join(F.out, n))));
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
            e === m && o(), "update" !== t.event && (v = null, console.log(t.event + ": " + e));
        })).on("event", (function(e) {
            if ("ERROR" === e.code) console.error(e); else if ("END" === e.code) {
                F.watch ? console.log("\n...WATCH...\n") : S.close(), console.log("");
                const e = R;
                if (R = {}, k === (k = y(e))) return;
                const o = f(n.readFileSync(m, "utf8"));
                delete o.main, delete o.module, delete o.types;
                const r = {};
                if (o.files) for (let n of o.files) n = t.relative(F.dir, t.join(F.dir, n)), /^\.?[\\/]/.test(n) && M(n), 
                n = n.split(/[\\/]/)[0], r[n] = !0;
                const s = {}, i = {};
                let l, c, a, d, p, u, g;
                for (const n in e) c = null, l = e[n].facadeModuleId, a = t.relative(F.dir, t.join(F.out, n)), 
                r[a.split(/[\\/]/)[0]] = !0, l && (d = "./" + N(t.dirname(a)), (p = "index.mjs" === a) && (o.main = "index", 
                o.module = "index.mjs", d = ".", r["index.js"] = r["index.mjs"] = !0), a = N(a), 
                s[d] = {
                    import: "./" + a,
                    require: "./" + a.slice(0, -3) + "js"
                }, i[d] = e[n].exports, _ && (c = t.relative(F.dir, t.join(F.types, t.relative(F.src, l))), 
                c = N(c.replace(/\.([mc]?)[tj]s$/, ".d.$1ts")), /\.d\.[mc]?ts$/.test(c) || M("type: " + c), 
                p && (o.types = c, r["index.d.ts"] = !0), s[d].types = "./" + c));
                o.exports = {
                    "./package.json": "./package.json"
                };
                for (let m, f = b(s).sort(), v = 0; v < f.length; v++) if (m = f[v], o.exports[m] = s[m], 
                _) {
                    let e = N(t.relative(t.resolve(F.dir, t.dirname(s[m].import)), t.resolve(F.dir, s[m].types))).replace(/(\/index)?\.d\.\w+$/, "");
                    "." !== e[0] && (e = "./" + e), e = y(e);
                    let o = `export * from ${e};\n`;
                    for (const t of i[m]) "default" === t ? o += `import { ${t} as __default__ } from ${e};\nexport { __default__ as default };\n` : "*" !== t[0] && (o += `export { ${t} } from ${e};\n`);
                    n.writeFileSync(t.resolve(F.dir, m, "index.d.ts"), o);
                }
                o.files = [], _ && (r[g = t.relative(F.dir, F.types).split(/[\\/]/)[0]] = !0);
                for (let m in r) _ && "index.d.ts" === m ? o.files.push(m) : _ && g && g === m ? o.files.push(m + "/**/*") : n.existsSync(u = t.join(F.dir, m)) && (
                //! FIX FOR NPM
                n.lstatSync(u).isDirectory() && (m += "/**/*"), o.files.push(m));
                o.files.sort();
                const h = function(e) {
                    const t = {}, n = b(e).sort();
                    return [ ...w, ...n ].filter((function(e, t, o) {
                        return n.indexOf(e) > -1 && t === o.indexOf(e);
                    })).forEach((function(n) {
                        t[n] = e[n];
                    })), t;
                }(o);
                n.writeFileSync(m, y(h, null, 2));
            }
        }));
    }
}();
