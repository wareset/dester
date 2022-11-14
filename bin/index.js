/* eslint-disable */
const e = require("kleur"), s = require("path"), t = require("fs"), n = require("module"), o = require("child_process"), r = require("rollup"), i = require("@rollup/plugin-commonjs"), l = require("@rollup/plugin-node-resolve"), c = require("@babel/core"), a = require("terser"), p = require("sucrase"), d = require("minimist"), {red: u, cyan: m, bold: f} = e, g = m(f(`\n    ___       ${u("__")} _ ${u("_ _ _ /_,_")}  ${u("_______   ____")}\n   / _ \\_${u("(/(/(_(")}/ ${u("(-_)(-/_ _)")} ${u("/ ___/ /  /  _/")}\n  / _/ / -_/_ —/ __/ -_/ __/ ${u("/ /__/ /___/ /")}\n  \\___/\\__/___/\\__/\\__/_/    ${u("\\___/____/___/")}\n\n`)), b = [].concat([ "$schema", "name", "displayName", "version" ], [ "private", "publishConfig" ], [ "description", "categories", "keywords", "license", "qna" ], [ "homepage", "bugs", "repository", "funding" ], [ "author", "maintainers", "contributors", "publisher" ], "sideEffects", "type", [ "proxy", "homepage" ], [ "flat", "resolutions", "workspaces" ], "bolt", "jsdelivr", "unpkg", [ "source", "umd:main" ], "jsnext:main", "main", "module", [ "types", "typesVersions", "typings" ], "files", "assets", [ "imports", "exports", "bin", "man", "directories" ], [ "browser", "esnext", "es2015", "esm", "module-browser", "modules.root" ], [ "engines", "engineStrict", "languageName", "os", "cpu" ], "preferGlobal", "example", "examplestyle", [ "binary", "scripts", "betterScripts", "capabilities", "activationEvents", "contributes", "husky", "simple-git-hooks", "commitlint", "lint-staged", "config", "nodemonConfig" ], [ "applypatch-msg", "pre-applypatch", "post-applypatch", "pre-commit", "pre-merge-commit", "prepare-commit-msg", "commit-msg", "post-commit", "pre-rebase", "post-checkout", "post-merge", "pre-push", "pre-receive", "update", "proc-receive", "post-receive", "post-update", "reference-transaction", "push-to-checkout", "pre-auto-gc", "post-rewrite", "sendemail-validate", "fsmonitor-watchman", "p4-changelist", "p4-prepare-changelist", "p4-post-changelist", "p4-pre-submit", "post-index-change" ], [ "flow", "flow:main" ], [ "browserify", "browserify.transform" ], "browserslist", "babel", "style", "xo", "prettier", [ "eslintConfig", "eslintIgnore" ], "npmpkgjsonlint", "remarkConfig", "stylelint", "ava", "jest", "mocha", "nyc", "tap", [ "react-native" ], [ "@std", "@std/esm" ], [ "jspm", "ignore", "format", "registry", "shim", "map" ], "size-limit", "pwmetrics", [ "peerDependencies", "peerDependenciesMeta", "optionalDependencies", "optionalDependenciesMeta", "bundledDependencies", "bundledDependenciesMeta", "bundleDependencies", "bundleDependenciesMeta", "devDependencies", "devDependenciesMeta", "dependencies", "dependenciesMeta" ], [ "extensionPack", "extensionDependencies", "icon", "badges", "galleryBanner", "preview", "markdown" ]);

console.clear();

const y = "undefined" != typeof require ? require : n.createRequire("undefined" == typeof document ? new (require("url").URL)("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("index.js", document.baseURI).href);

function _(e) {
    return e.replace(/\\+/, "/");
}

function h(e) {
    const n = [], o = t.readdirSync(e, {
        withFileTypes: !0
    });
    for (let t, r, i = o.length; i-- > 0; ) t = o[i], /^[^._]/.test(t.name) && !/\.tests?($|\.)/i.test(t.name) && (r = s.join(e, t.name), 
    t.isDirectory() ? n.push(...h(r)) : /\.[mc]?[jt]s$/.test(t.name) && n.push(r));
    return n;
}

function v(s) {
    throw console.log(e.bgRed(e.black("ERROR: " + s))), process.kill(0), s;
}

const k = d(process.argv.slice(2), {
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
    if (console.log(g), k.help) console.log("help"); else {
        if (console.log("rollup: v" + r.VERSION), console.log("babel:  v" + c.version), 
        console.log(""), k.dir = s.resolve(k.dir), k.src = s.resolve(k.dir, k.src), k.out = s.resolve(k.dir, k.out), 
        console.log(e.bgGreen(e.black(e.bold("dir: ") + k.dir))), console.log(e.bgGreen(e.black(e.bold("src: ") + k.src))), 
        console.log(e.bgGreen(e.black(e.bold("out: ") + k.out))), console.log(""), !k.out.startsWith(k.dir)) return v("dir OUT must be in dir DIR");
        const u = s.resolve(k.dir, "package.json");
        if (!t.existsSync(u)) return v("package.json not found in " + k.dir);
        let m, f, j;
        function n() {
            const e = JSON.parse(t.readFileSync(u, "utf8")), s = e.dependencies || {}, n = e.peerDependencies || {};
            var o;
            m = (o = [ ...Object.keys(s), ...Object.keys(n) ], o.filter(((e, s, t) => e && t.indexOf(e) === s)).sort()).map((e => new RegExp(`^${e}($|/|\\\\)`)));
        }
        if (console.log(e.bgMagenta(e.black(e.bold("package.json: ") + u))), console.log(""), 
        n(), k.types) {
            if ("string" != typeof k.types && (k.types = "types"), k.types = s.resolve(k.dir, k.types), 
            console.log(e.bgGreen(e.black(e.bold("types: ") + k.types))), !k.types.startsWith(k.dir)) return console.log(e.bgRed(e.black("ERROR:"))), 
            v("dir TYPES must be in dir DIR");
            if (f = function() {
                let s;
                const t = e.bgBlue(e.black(e.bold("tsc: ")));
                try {
                    s = y.resolve(".bin/tsc"), console.log(t + e.bgBlue(e.black(s))), o.spawnSync(s, [ "-v" ], {
                        stdio: [ "ignore", "inherit", "inherit" ],
                        shell: !0
                    });
                } catch {
                    console.warn(t + e.bgRed(e.black("not found")));
                }
                return s;
            }()) {
                const R = s.resolve(k.dir, ".dester.tsconfig.json"), q = {
                    include: [ _(s.resolve(k.src, "**/*")) ],
                    exclude: [ _(s.resolve(k.src, "**/node_modules")), _(s.resolve(k.src, "**/_*")), _(s.resolve(k.src, "**/*.test.*")), _(s.resolve(k.src, "**/*.tests.*")) ],
                    compilerOptions: {
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
                        forceConsistentCasingInFileNames: !0,
                        rootDir: _(k.src),
                        baseUrl: _(k.src),
                        outDir: _(k.types),
                        declarationDir: _(k.types)
                    }
                };
                t.writeFileSync(R, JSON.stringify(q, null, 2));
                const N = o.spawn(f, [ "--build", R, ...k.watch ? [ "--watch" ] : [] ], {
                    cwd: k.src,
                    shell: !0
                });
                N.stdout.on("data", (function(s) {
                    s = s.toString().trim(), console.log("\n" + e.bgBlue(e.black("tsc: "))), console.dir(s);
                })), N.stderr.on("data", (function(s) {
                    s = s.toString().trim(), console.log("\n" + e.bgRed(e.black("tsc: "))), console.dir(s);
                }));
                const O = function() {
                    N.kill(0);
                };
                process.on("SIGTERM", O), process.on("exit", O);
            }
        }
        function d() {
            if (!j) {
                const e = h(k.src).map((function(e) {
                    const {dir: t, name: n} = s.parse(s.relative(k.src, e));
                    return {
                        id: e,
                        fileName: s.join(t, "index" === n ? n : s.join(n, "index"))
                    };
                }));
                j = e.sort((function(e, s) {
                    return e.fileName.localeCompare(s.fileName);
                }));
            }
        }
        console.log("");
        const w = {
            preset: "es5",
            arrowFunctions: !1,
            constBindings: !0,
            objectShorthand: !1,
            reservedNamesAsProps: !0,
            symbols: !1
        };
        let x, S = {};
        const D = r.watch([ ".mjs", ".js" ].map((function(e, s) {
            return {
                output: {
                    exports: "named",
                    format: ".js" === e ? "commonjs" : "esm",
                    dir: k.out,
                    chunkFileNames: "_includes/[name]-[hash]" + e,
                    generatedCode: w
                },
                external: function(e, s) {
                    if (s) return /^\.?[/\\]|\\/.test(e) ? void 0 : m.some((s => s.test(e)));
                },
                plugins: [ {
                    name: "chunks",
                    buildStart() {
                        j || d(), s || (this.addWatchFile(k.src), this.addWatchFile(u));
                        for (let s = j.length; s-- > 0; ) this.emitFile({
                            type: "chunk",
                            id: j[s].id,
                            fileName: j[s].fileName + e,
                            preserveSignature: "strict",
                            generatedCode: w
                        });
                    }
                }, {
                    name: "sucrase-custom",
                    transform: (e, s) => /\.tsx?$/.test(s) ? p.transform(e, {
                        transforms: [ "typescript" ]
                    }).code : null
                }, k.ie && (n = k.ie, {
                    name: "babel-custom",
                    transform: async e => ({
                        code: (await c.transformAsync(e, {
                            presets: [ [ "@babel/preset-env", {
                                corejs: 3,
                                loose: !0,
                                bugfixes: !0,
                                modules: !1,
                                useBuiltIns: "entry",
                                targets: "> 1%, not dead" + (n ? ", ie " + Math.max(9, +n || 11) : "")
                            } ] ],
                            plugins: [ "@babel/plugin-transform-runtime" ]
                        })).code
                    })
                }), l({
                    extensions: [ ".mjs", ".js", ".jsx", ".mts", ".ts", ".tsx", ".json" ]
                }), i(), (t = k.min, {
                    name: "terser-custom",
                    renderChunk: async e => ({
                        code: e = (await a.minify(e, {
                            safari10: !0,
                            mangle: !0,
                            module: !0,
                            toplevel: !0,
                            compress: !0,
                            ...t ? {
                                keep_classnames: !1
                            } : {
                                keep_classnames: !0,
                                format: {
                                    beautify: !0
                                }
                            }
                        })).code
                    })
                }), {
                    renderChunk(e, t) {
                        if (!s) {
                            const {fileName: e, facadeModuleId: s} = t;
                            S[e] = s;
                        }
                        return "/* eslint-disable */\n" + e;
                    }
                } ]
            };
            var t, n;
        }))).on("change", (function(e, s) {
            e === u && n(), "update" !== s.event && (j = null, console.log(s.event + ": " + e));
        })).on("event", (function(n) {
            if ("END" === n.code) {
                k.watch ? console.log("\n...WATCH...\n") : D.close(), console.log("");
                const n = S;
                if (S = {}, x === (x = JSON.stringify(n))) return;
                const o = JSON.parse(t.readFileSync(u, "utf8"));
                delete o.main, delete o.module, delete o.types;
                const r = {};
                if (o.files) for (let e of o.files) e = s.relative(k.dir, s.join(k.dir, e)), /^\.?[\\/]/.test(e) && v(e), 
                e = e.split(/[\\/]/)[0], r[e] = !0;
                const i = {};
                let l, c, a, p, d, m, g;
                for (const t in n) c = null, l = n[t], a = s.relative(k.dir, s.join(k.out, t)), 
                r[a.split(/[\\/]/)[0]] = !0, l && (p = "./" + _(s.dirname(a)), (d = "index.mjs" === a) && (o.main = "index", 
                o.module = "index.mjs", p = "."), a = _(a), console.log(e.green("BUILD: " + s.relative(k.src, l) + " => " + a)), 
                i[p] = {
                    import: "./" + a,
                    require: "./" + a.slice(0, -3) + "js"
                }, f && (c = s.relative(k.dir, s.join(k.types, s.relative(k.src, l))), c = _(c.replace(/\.([mc]?)[tj]s$/, ".d.$1ts")), 
                /\.d\.[mc]?ts$/.test(c) || v("type: " + c), d && (o.types = c), i[p].types = "./" + c));
                o.exports = {
                    "./package.json": "./package.json"
                };
                for (let e = Object.keys(i).sort(), s = 0; s < e.length; s++) o.exports[e[s]] = i[e[s]];
                o.files = [], f && (r[g = s.relative(k.dir, k.types).split(/[\\/]/)[0]] = !0);
                for (let e in r) g && g === e ? o.files.push(e + "/**/*") : t.existsSync(m = s.join(k.dir, e)) && (
                //! FIX FOR NPM
                t.lstatSync(m).isDirectory() && (e += "/**/*"), o.files.push(e));
                o.files.sort();
                const y = function(e) {
                    const s = {}, t = Object.keys(e).sort();
                    return [ ...b, ...t ].filter((function(e, s, n) {
                        return t.indexOf(e) > -1 && s === n.indexOf(e);
                    })).forEach((function(t) {
                        s[t] = e[t];
                    })), s;
                }(o);
                t.writeFileSync(u, JSON.stringify(y, null, 2));
            }
        }));
    }
}();
