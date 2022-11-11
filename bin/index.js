/* eslint-disable */
const e = require("kleur"), t = require("module"), s = require("child_process"), n = require("path"), o = require("fs"), r = require("rollup"), i = require("@rollup/plugin-commonjs"), l = require("@rollup/plugin-node-resolve"), c = require("@babel/core"), a = require("terser"), p = require("sucrase"), d = require("minimist"), {red: u, cyan: m, bold: f} = e, g = m(f(`\n    ___       ${u("__")} _ ${u("_ _ _ /_,_")}  ${u("_______   ____")}\n   / _ \\_${u("(/(/(_(")}/ ${u("(-_)(-/_ _)")} ${u("/ ___/ /  /  _/")}\n  / _/ / -_/_ —/ __/ -_/ __/ ${u("/ /__/ /___/ /")}\n  \\___/\\__/___/\\__/\\__/_/    ${u("\\___/____/___/")}\n\n`)), b = "undefined" != typeof require ? require : t.createRequire("undefined" == typeof document ? new (require("url").URL)("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("index.js", document.baseURI).href), y = e.bgBlue(e.black(e.bold("tsc: ")));

const _ = [].concat([ "$schema", "name", "displayName", "version" ], [ "private", "publishConfig" ], [ "description", "categories", "keywords", "license", "qna" ], [ "homepage", "bugs", "repository", "funding" ], [ "author", "maintainers", "contributors", "publisher" ], "sideEffects", "type", [ "proxy", "homepage" ], [ "flat", "resolutions", "workspaces" ], "bolt", "jsdelivr", "unpkg", [ "source", "umd:main" ], "jsnext:main", "main", "module", [ "types", "typesVersions", "typings" ], "files", "assets", [ "imports", "exports", "bin", "man", "directories" ], [ "browser", "esnext", "es2015", "esm", "module-browser", "modules.root" ], [ "engines", "engineStrict", "languageName", "os", "cpu" ], "preferGlobal", "example", "examplestyle", [ "binary", "scripts", "betterScripts", "capabilities", "activationEvents", "contributes", "husky", "simple-git-hooks", "commitlint", "lint-staged", "config", "nodemonConfig" ], [ "applypatch-msg", "pre-applypatch", "post-applypatch", "pre-commit", "pre-merge-commit", "prepare-commit-msg", "commit-msg", "post-commit", "pre-rebase", "post-checkout", "post-merge", "pre-push", "pre-receive", "update", "proc-receive", "post-receive", "post-update", "reference-transaction", "push-to-checkout", "pre-auto-gc", "post-rewrite", "sendemail-validate", "fsmonitor-watchman", "p4-changelist", "p4-prepare-changelist", "p4-post-changelist", "p4-pre-submit", "post-index-change" ], [ "flow", "flow:main" ], [ "browserify", "browserify.transform" ], "browserslist", "babel", "style", "xo", "prettier", [ "eslintConfig", "eslintIgnore" ], "npmpkgjsonlint", "remarkConfig", "stylelint", "ava", "jest", "mocha", "nyc", "tap", [ "react-native" ], [ "@std", "@std/esm" ], [ "jspm", "ignore", "format", "registry", "shim", "map" ], "size-limit", "pwmetrics", [ "peerDependencies", "peerDependenciesMeta", "optionalDependencies", "optionalDependenciesMeta", "bundledDependencies", "bundledDependenciesMeta", "bundleDependencies", "bundleDependenciesMeta", "devDependencies", "devDependenciesMeta", "dependencies", "dependenciesMeta" ], [ "extensionPack", "extensionDependencies", "icon", "badges", "galleryBanner", "preview", "markdown" ]);

function h(e) {
    return e.replace(/\\+/, "/");
}

function v(e) {
    const t = [], s = o.readdirSync(e, {
        withFileTypes: !0
    });
    for (let o, r, i = s.length; i-- > 0; ) o = s[i], /^[^._]/.test(o.name) && !/\.tests?($|\.)/i.test(o.name) && (r = n.join(e, o.name), 
    o.isDirectory() ? t.push(...v(r)) : /\.[mc]?[jt]s$/.test(o.name) && t.push(r));
    return t;
}

function k(t) {
    throw console.log(e.bgRed(e.black("ERROR: " + t))), process.kill(0), t;
}

console.clear();

const j = d(process.argv.slice(2), {
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
    if (console.log(g), j.help) console.log("help"); else {
        if (console.log("rollup: v" + r.VERSION), console.log("babel:  v" + c.version), 
        console.log(""), j.dir = n.resolve(j.dir), j.src = n.resolve(j.dir, j.src), j.out = n.resolve(j.dir, j.out), 
        console.log(e.bgGreen(e.black(e.bold("dir: ") + j.dir))), console.log(e.bgGreen(e.black(e.bold("src: ") + j.src))), 
        console.log(e.bgGreen(e.black(e.bold("out: ") + j.out))), console.log(""), !j.out.startsWith(j.dir)) return k("dir OUT must be in dir DIR");
        const u = n.resolve(j.dir, "package.json");
        if (!o.existsSync(u)) return k("package.json not found in " + j.dir);
        let m, f, w;
        function t() {
            const e = JSON.parse(o.readFileSync(u, "utf8")), t = e.dependencies || {}, s = e.peerDependencies || {};
            var n;
            m = (n = [ ...Object.keys(t), ...Object.keys(s) ], n.filter(((e, t, s) => e && s.indexOf(e) === t)).sort()).map((e => new RegExp(`^${e}($|/|\\\\)`)));
        }
        if (console.log(e.bgMagenta(e.black(e.bold("package.json: ") + u))), console.log(""), 
        t(), j.types) {
            if ("string" != typeof j.types && (j.types = "types"), j.types = n.resolve(j.dir, j.types), 
            console.log(e.bgGreen(e.black(e.bold("types: ") + j.types))), !j.types.startsWith(j.dir)) return console.log(e.bgRed(e.black("ERROR:"))), 
            k("dir TYPES must be in dir DIR");
            if (f = function() {
                let t;
                try {
                    t = b.resolve(".bin/tsc"), console.log(y + e.bgBlue(e.black(t))), s.spawnSync(t, [ "-v" ], {
                        stdio: [ "ignore", "inherit", "inherit" ],
                        shell: !0
                    });
                } catch {
                    console.warn(y + e.bgRed(e.black("not found")));
                }
                return t;
            }()) {
                const q = s.spawn(f, [ ...j.watch ? [ "--watch" ] : [], "--target", "esnext", "--module", "esnext", "--moduleResolution", "node", "--allowJs", "--declaration", "--emitDeclarationOnly", "--esModuleInterop", "--resolveJsonModule", "--emitDecoratorMetadata", "--experimentalDecorators", "--allowSyntheticDefaultImports", "--rootDir", j.src, "--baseUrl", j.src, "--outDir", j.types, "--declarationDir", j.types ], {
                    cwd: j.src,
                    shell: !0
                });
                q.stdout.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgBlue(e.black("tsc: "))), console.dir(t);
                })), q.stderr.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgRed(e.black("tsc: "))), console.dir(t);
                }));
                const $ = function() {
                    q.kill(0);
                };
                process.on("SIGTERM", $), process.on("exit", $);
            }
        }
        function d() {
            if (!w) {
                const e = v(j.src).map((function(e) {
                    const {dir: t, name: s} = n.parse(n.relative(j.src, e));
                    return {
                        id: e,
                        fileName: n.join(t, "index" === s ? s : n.join(s, "index"))
                    };
                }));
                w = e.sort((function(e, t) {
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
        let D, S = {};
        const R = r.watch([ ".mjs", ".js" ].map((function(e, t) {
            return {
                output: {
                    exports: "named",
                    format: ".js" === e ? "commonjs" : "esm",
                    dir: j.out,
                    chunkFileNames: "_includes/[name]-[hash]" + e,
                    generatedCode: x
                },
                external: function(e, t) {
                    if (t) return /^\.?[/\\]|\\/.test(e) ? void 0 : m.some((t => t.test(e)));
                },
                plugins: [ {
                    name: "chunks",
                    buildStart() {
                        w || d(), t || (this.addWatchFile(j.src), this.addWatchFile(u));
                        for (let t = w.length; t-- > 0; ) this.emitFile({
                            type: "chunk",
                            id: w[t].id,
                            fileName: w[t].fileName + e,
                            preserveSignature: "strict",
                            generatedCode: x
                        });
                    }
                }, {
                    name: "sucrase-custom",
                    transform: (e, t) => /\.tsx?$/.test(t) ? p.transform(e, {
                        transforms: [ "typescript" ]
                    }).code : null
                }, j.ie && (n = j.ie, {
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
                }), i(), (s = j.min, {
                    name: "terser-custom",
                    renderChunk: async e => ({
                        code: e = (await a.minify(e, {
                            safari10: !0,
                            mangle: !0,
                            module: !0,
                            toplevel: !0,
                            compress: !0,
                            ...s ? {
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
                    renderChunk(e, s) {
                        if (!t) {
                            const {fileName: e, facadeModuleId: t} = s;
                            S[e] = t;
                        }
                        return "/* eslint-disable */\n" + e;
                    }
                } ]
            };
            var s, n;
        }))).on("change", (function(e, s) {
            e === u && t(), "update" !== s.event && (w = null, console.log(s.event + ": " + e));
        })).on("event", (function(t) {
            if ("END" === t.code) {
                j.watch ? console.log("\n...WATCH...\n") : R.close(), console.log("");
                const t = S;
                if (S = {}, D === (D = JSON.stringify(t))) return;
                const s = JSON.parse(o.readFileSync(u, "utf8"));
                delete s.main, delete s.module, delete s.types;
                const r = {};
                if (s.files) for (let e of s.files) e = n.relative(j.dir, n.join(j.dir, e)), /^\.?[\\/]/.test(e) && k(e), 
                e = e.split(/[\\/]/)[0], r[e] = !0;
                const i = {};
                let l, c, a, p, d, m, g;
                for (const o in t) c = null, l = t[o], a = n.relative(j.dir, n.join(j.out, o)), 
                r[a.split(/[\\/]/)[0]] = !0, l && (p = "./" + h(n.dirname(a)), (d = "index.mjs" === a) && (s.main = "index", 
                s.module = "index.mjs", p = "."), a = h(a), console.log(e.green("BUILD: " + n.relative(j.src, l) + " => " + a)), 
                i[p] = {
                    import: "./" + a,
                    require: "./" + a.slice(0, -3) + "js"
                }, f && (c = n.relative(j.dir, n.join(j.types, n.relative(j.src, l))), c = h(c.replace(/\.([mc]?)[tj]s$/, ".d.$1ts")), 
                /\.d\.[mc]?ts$/.test(c) || k("type: " + c), d && (s.types = c), i[p].types = "./" + c));
                s.exports = {
                    "./package.json": "./package.json"
                };
                for (let e = Object.keys(i).sort(), n = 0; n < e.length; n++) s.exports[e[n]] = i[e[n]];
                s.files = [], f && (r[g = n.relative(j.dir, j.types).split(/[\\/]/)[0]] = !0);
                for (let e in r) g && g === e ? s.files.push(e + "/**/*") : o.existsSync(m = n.join(j.dir, e)) && (
                //! FIX FOR NPM
                o.lstatSync(m).isDirectory() && (e += "/**/*"), s.files.push(e));
                s.files.sort();
                const b = function(e) {
                    const t = {}, s = Object.keys(e).sort();
                    return [ ..._, ...s ].filter((function(e, t, n) {
                        return s.indexOf(e) > -1 && t === n.indexOf(e);
                    })).forEach((function(s) {
                        t[s] = e[s];
                    })), t;
                }(s);
                o.writeFileSync(u, JSON.stringify(b, null, 2));
            }
        }));
    }
}();
