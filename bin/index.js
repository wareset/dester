/* eslint-disable */
const e = require("kleur"), t = require("path"), s = require("fs"), n = require("module"), r = require("child_process"), o = require("rollup"), i = require("@rollup/plugin-commonjs"), l = require("@rollup/plugin-node-resolve"), c = require("@babel/core"), a = require("terser"), d = require("sucrase"), p = require("minimist"), {red: u, cyan: m, bold: f} = e, g = m(f(`\n    ___       ${u("__")} _ ${u("_ _ _ /_,_")}  ${u("_______   ____")}\n   / _ \\_${u("(/(/(_(")}/ ${u("(-_)(-/_ _)")} ${u("/ ___/ /  /  _/")}\n  / _/ / -_/_ —/ __/ -_/ __/ ${u("/ /__/ /___/ /")}\n  \\___/\\__/___/\\__/\\__/_/    ${u("\\___/____/___/")}\n\n`)), b = [].concat([ "$schema", "name", "displayName", "version" ], [ "private", "publishConfig" ], [ "description", "categories", "keywords", "license", "qna" ], [ "homepage", "bugs", "repository", "funding" ], [ "author", "maintainers", "contributors", "publisher" ], "sideEffects", "type", [ "proxy", "homepage" ], [ "flat", "resolutions", "workspaces" ], "bolt", "jsdelivr", "unpkg", [ "source", "umd:main" ], "jsnext:main", "main", "module", [ "types", "typesVersions", "typings" ], "files", "assets", [ "imports", "exports", "bin", "man", "directories" ], [ "browser", "esnext", "es2015", "esm", "module-browser", "modules.root" ], [ "engines", "engineStrict", "languageName", "os", "cpu" ], "preferGlobal", "example", "examplestyle", [ "binary", "scripts", "betterScripts", "capabilities", "activationEvents", "contributes", "husky", "simple-git-hooks", "commitlint", "lint-staged", "config", "nodemonConfig" ], [ "applypatch-msg", "pre-applypatch", "post-applypatch", "pre-commit", "pre-merge-commit", "prepare-commit-msg", "commit-msg", "post-commit", "pre-rebase", "post-checkout", "post-merge", "pre-push", "pre-receive", "update", "proc-receive", "post-receive", "post-update", "reference-transaction", "push-to-checkout", "pre-auto-gc", "post-rewrite", "sendemail-validate", "fsmonitor-watchman", "p4-changelist", "p4-prepare-changelist", "p4-post-changelist", "p4-pre-submit", "post-index-change" ], [ "flow", "flow:main" ], [ "browserify", "browserify.transform" ], "browserslist", "babel", "style", "xo", "prettier", [ "eslintConfig", "eslintIgnore" ], "npmpkgjsonlint", "remarkConfig", "stylelint", "ava", "jest", "mocha", "nyc", "tap", [ "react-native" ], [ "@std", "@std/esm" ], [ "jspm", "ignore", "format", "registry", "shim", "map" ], "size-limit", "pwmetrics", [ "peerDependencies", "peerDependenciesMeta", "optionalDependencies", "optionalDependenciesMeta", "bundledDependencies", "bundledDependenciesMeta", "bundleDependencies", "bundleDependenciesMeta", "devDependencies", "devDependenciesMeta", "dependencies", "dependenciesMeta" ], [ "extensionPack", "extensionDependencies", "icon", "badges", "galleryBanner", "preview", "markdown" ]);

console.clear();

const y = "undefined" != typeof require ? require : n.createRequire("undefined" == typeof document ? new (require("url").URL)("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("index.js", document.baseURI).href);

function h(e) {
    return e.replace(/[/\\]+/, "/");
}

function _(e) {
    const n = [], r = s.readdirSync(e, {
        withFileTypes: !0
    });
    for (let s, o, i = r.length; i-- > 0; ) s = r[i], /^[^._]/.test(s.name) && !/\.tests?($|\.)/i.test(s.name) && (o = t.join(e, s.name), 
    s.isDirectory() ? n.push(..._(o)) : /\.[mc]?[jt]s$/.test(s.name) && n.push(o));
    return n;
}

function v(t) {
    throw console.log(e.bgRed(e.black("ERROR: " + t))), process.kill(0), t;
}

const x = p(process.argv.slice(2), {
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
    if (console.log(g), x.help) console.log("help"); else {
        if (console.log("rollup: v" + o.VERSION), console.log("babel:  v" + c.version), 
        console.log(""), x.dir = t.resolve(x.dir), x.src = t.resolve(x.dir, x.src), x.out = t.resolve(x.dir, x.out), 
        console.log(e.bgGreen(e.black(e.bold("dir: ") + x.dir))), console.log(e.bgGreen(e.black(e.bold("src: ") + x.src))), 
        console.log(e.bgGreen(e.black(e.bold("out: ") + x.out))), console.log(""), !x.out.startsWith(x.dir)) return v("dir OUT must be in dir DIR");
        const u = t.resolve(x.dir, "package.json");
        if (!s.existsSync(u)) return v("package.json not found in " + x.dir);
        let m, f, j;
        function n() {
            const e = JSON.parse(s.readFileSync(u, "utf8")), t = e.dependencies || {}, n = e.peerDependencies || {};
            var r;
            m = (r = [ ...Object.keys(process.binding("natives")), ...Object.keys(t), ...Object.keys(n) ], 
            r.filter(((e, t, s) => e && s.indexOf(e) === t)).sort()).map((e => new RegExp(`^${e}($|/|\\\\)`)));
        }
        if (console.log(e.bgMagenta(e.black(e.bold("package.json: ") + u))), console.log(""), 
        n(), x.types) {
            if ("string" != typeof x.types && (x.types = "types"), x.types = t.resolve(x.dir, x.types), 
            console.log(e.bgGreen(e.black(e.bold("types: ") + x.types))), !x.types.startsWith(x.dir)) return console.log(e.bgRed(e.black("ERROR:"))), 
            v("dir TYPES must be in dir DIR");
            if (f = function() {
                let t;
                const s = e.bgBlue(e.black(e.bold("tsc: ")));
                try {
                    t = y.resolve(".bin/tsc"), console.log(s + e.bgBlue(e.black(t))), r.spawnSync(t, [ "-v" ], {
                        stdio: [ "ignore", "inherit", "inherit" ],
                        shell: !0
                    });
                } catch {
                    console.warn(s + e.bgRed(e.black("not found")));
                }
                return t;
            }()) {
                const O = t.resolve(x.dir, ".dester.tsconfig.json");
                let R = {};
                if (s.existsSync(O)) try {
                    R = JSON.parse(s.readFileSync(O)).compilerOptions || {};
                } catch {}
                const N = {
                    include: [ h(t.resolve(x.src, "**/*")) ],
                    exclude: [ h(t.resolve(x.src, "**/node_modules")), h(t.resolve(x.src, "**/_*")), h(t.resolve(x.src, "**/*.test.*")), h(t.resolve(x.src, "**/*.tests.*")) ],
                    compilerOptions: {
                        ...R,
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
                        outDir: h(x.types)
                    }
                };
                s.writeFileSync(O, JSON.stringify(N, null, 2));
                const $ = r.spawn(f, [ "--build", O, ...x.watch ? [ "--watch" ] : [] ], {
                    cwd: x.src,
                    shell: !0
                });
                $.stdout.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgBlue(e.black("tsc: "))), console.dir(t);
                })), $.stderr.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgRed(e.black("tsc: "))), console.dir(t);
                }));
                const q = function() {
                    $.kill(0);
                };
                process.on("SIGTERM", q), process.on("exit", q);
            }
        }
        function p() {
            if (!j) {
                const e = _(x.src).map((function(e) {
                    const {dir: s, name: n} = t.parse(t.relative(x.src, e));
                    return {
                        id: e,
                        fileName: t.join(s, "index" === n ? n : t.join(n, "index"))
                    };
                }));
                j = e.sort((function(e, t) {
                    return e.fileName.localeCompare(t.fileName);
                }));
            }
        }
        console.log("");
        const k = {
            preset: "es5",
            arrowFunctions: !1,
            constBindings: !0,
            objectShorthand: !1,
            reservedNamesAsProps: !0,
            symbols: !1
        };
        let w, S = {};
        const D = o.watch([ ".mjs", ".js" ].map((function(s, n) {
            return {
                output: {
                    exports: "named",
                    format: ".js" === s ? "commonjs" : "esm",
                    dir: x.out,
                    chunkFileNames: "_includes/[name]" + s,
                    generatedCode: k
                },
                external: function(e, t) {
                    return !!e.startsWith("node:") || (t ? /^\.?[/\\]|\\/.test(e) ? void 0 : !!m.length && m.some((t => t.test(e))) : void 0);
                },
                plugins: [ {
                    name: "chunks",
                    buildStart() {
                        j || p(), n || (this.addWatchFile(x.src), this.addWatchFile(u));
                        for (let e = j.length; e-- > 0; ) this.emitFile({
                            type: "chunk",
                            id: j[e].id,
                            fileName: j[e].fileName + s,
                            generatedCode: k
                        });
                    }
                }, {
                    name: "sucrase-custom",
                    transform(e, t) {
                        if (/\.[mc]?tsx?$/.test(t)) {
                            try {
                                e = d.transform(e, {
                                    transforms: [ "typescript" ]
                                }).code;
                            } catch (s) {
                                console.error("sucrase-custom"), console.error(s);
                            }
                            return {
                                code: e
                            };
                        }
                        return null;
                    }
                }, ...x.ie ? [ (o = x.ie, {
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
                                    targets: "> 1%, not dead" + (o ? ", ie " + Math.max(9, +o || 11) : "")
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
                }) ] : [], l({
                    extensions: [ ".mjs", ".js", ".jsx", ".mts", ".ts", ".tsx", ".json" ]
                }), i(), (r = x.min, {
                    name: "terser-custom",
                    async renderChunk(e) {
                        try {
                            e = (await a.minify(e, {
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
                    renderChunk(s, r) {
                        if (!n) {
                            const {fileName: s, facadeModuleId: n, exports: i} = r;
                            S[s] = {
                                facadeModuleId: n,
                                exports: i
                            };
                            try {
                                n && console.log(e.green("BUILD: " + t.relative(x.src, n) + " => " + t.relative(x.dir, t.join(x.out, s))));
                            } catch (o) {
                                console.error(o);
                            }
                        }
                        return "/* eslint-disable */\n" + s;
                    }
                } ]
            };
            var r, o;
        }))).on("change", (function(e, t) {
            e === u && n(), "update" !== t.event && (j = null, console.log(t.event + ": " + e));
        })).on("event", (function(e) {
            if ("ERROR" === e.code) console.error(e); else if ("END" === e.code) {
                x.watch ? console.log("\n...WATCH...\n") : D.close(), console.log("");
                const e = S;
                if (S = {}, w === (w = JSON.stringify(e))) return;
                const n = JSON.parse(s.readFileSync(u, "utf8"));
                delete n.main, delete n.module, delete n.types;
                const r = {};
                if (n.files) for (let s of n.files) s = t.relative(x.dir, t.join(x.dir, s)), /^\.?[\\/]/.test(s) && v(s), 
                s = s.split(/[\\/]/)[0], r[s] = !0;
                const o = {};
                let i, l, c, a, d, p, m;
                for (const s in e) l = null, i = e[s].facadeModuleId, c = t.relative(x.dir, t.join(x.out, s)), 
                r[c.split(/[\\/]/)[0]] = !0, i && (a = "./" + h(t.dirname(c)), (d = "index.mjs" === c) && (n.main = "index", 
                n.module = "index.mjs", a = ".", r["index.js"] = r["index.mjs"] = !0), c = h(c), 
                o[a] = {
                    import: "./" + c,
                    require: "./" + c.slice(0, -3) + "js"
                }, e[s].exports, f && (l = t.relative(x.dir, t.join(x.types, t.relative(x.src, i))), 
                l = h(l.replace(/\.([mc]?)[tj]s$/, ".d.$1ts")), /\.d\.[mc]?ts$/.test(l) || v("type: " + l), 
                d && (n.types = "index.d.ts", r["index.d.ts"] = !0), o[a].types = "./" + l));
                n.exports = {
                    "./package.json": "./package.json"
                };
                for (let u, b = Object.keys(o).sort(), y = 0; y < b.length; y++) if (u = b[y], n.exports[u] = o[u], 
                f) {
                    let e = h(t.relative(t.resolve(x.dir, t.dirname(o[u].import)), t.resolve(x.dir, o[u].types))).replace(/(\/index)?\.d\.\w+$/, "");
                    "." !== e[0] && (e = "./" + e), e = JSON.stringify(e);
                    const n = `export * from ${e};\n`;
                    s.writeFileSync(t.resolve(x.dir, u, "index.d.ts"), n);
                }
                n.files = [], f && (r[m = t.relative(x.dir, x.types).split(/[\\/]/)[0]] = !0);
                for (let u in r) f && "index.d.ts" === u ? n.files.push(u) : f && m && m === u ? n.files.push(u + "/**/*") : s.existsSync(p = t.join(x.dir, u)) && (
                //! FIX FOR NPM
                s.lstatSync(p).isDirectory() && (u += "/**/*"), n.files.push(u));
                n.files.sort();
                const g = function(e) {
                    const t = {}, s = Object.keys(e).sort();
                    return [ ...b, ...s ].filter((function(e, t, n) {
                        return s.indexOf(e) > -1 && t === n.indexOf(e);
                    })).forEach((function(s) {
                        t[s] = e[s];
                    })), t;
                }(n);
                s.writeFileSync(u, JSON.stringify(g, null, 2));
            }
        }));
    }
}();
