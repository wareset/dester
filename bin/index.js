/* eslint-disable */
const e = require("kleur"), t = require("path"), s = require("fs"), n = require("os"), o = require("module"), r = require("child_process"), i = require("rollup"), l = require("@rollup/plugin-commonjs"), c = require("@rollup/plugin-node-resolve"), a = require("@babel/core"), p = require("terser"), d = require("sucrase"), u = require("minimist"), {red: m, cyan: f, bold: g} = e, b = f(g(`\n    ___       ${m("__")} _ ${m("_ _ _ /_,_")}  ${m("_______   ____")}\n   / _ \\_${m("(/(/(_(")}/ ${m("(-_)(-/_ _)")} ${m("/ ___/ /  /  _/")}\n  / _/ / -_/_ —/ __/ -_/ __/ ${m("/ /__/ /___/ /")}\n  \\___/\\__/___/\\__/\\__/_/    ${m("\\___/____/___/")}\n\n`)), y = [].concat([ "$schema", "name", "displayName", "version" ], [ "private", "publishConfig" ], [ "description", "categories", "keywords", "license", "qna" ], [ "homepage", "bugs", "repository", "funding" ], [ "author", "maintainers", "contributors", "publisher" ], "sideEffects", "type", [ "proxy", "homepage" ], [ "flat", "resolutions", "workspaces" ], "bolt", "jsdelivr", "unpkg", [ "source", "umd:main" ], "jsnext:main", "main", "module", [ "types", "typesVersions", "typings" ], "files", "assets", [ "imports", "exports", "bin", "man", "directories" ], [ "browser", "esnext", "es2015", "esm", "module-browser", "modules.root" ], [ "engines", "engineStrict", "languageName", "os", "cpu" ], "preferGlobal", "example", "examplestyle", [ "binary", "scripts", "betterScripts", "capabilities", "activationEvents", "contributes", "husky", "simple-git-hooks", "commitlint", "lint-staged", "config", "nodemonConfig" ], [ "applypatch-msg", "pre-applypatch", "post-applypatch", "pre-commit", "pre-merge-commit", "prepare-commit-msg", "commit-msg", "post-commit", "pre-rebase", "post-checkout", "post-merge", "pre-push", "pre-receive", "update", "proc-receive", "post-receive", "post-update", "reference-transaction", "push-to-checkout", "pre-auto-gc", "post-rewrite", "sendemail-validate", "fsmonitor-watchman", "p4-changelist", "p4-prepare-changelist", "p4-post-changelist", "p4-pre-submit", "post-index-change" ], [ "flow", "flow:main" ], [ "browserify", "browserify.transform" ], "browserslist", "babel", "style", "xo", "prettier", [ "eslintConfig", "eslintIgnore" ], "npmpkgjsonlint", "remarkConfig", "stylelint", "ava", "jest", "mocha", "nyc", "tap", [ "react-native" ], [ "@std", "@std/esm" ], [ "jspm", "ignore", "format", "registry", "shim", "map" ], "size-limit", "pwmetrics", [ "peerDependencies", "peerDependenciesMeta", "optionalDependencies", "optionalDependenciesMeta", "bundledDependencies", "bundledDependenciesMeta", "bundleDependencies", "bundleDependenciesMeta", "devDependencies", "devDependenciesMeta", "dependencies", "dependenciesMeta" ], [ "extensionPack", "extensionDependencies", "icon", "badges", "galleryBanner", "preview", "markdown" ]);

console.clear();

const _ = "undefined" != typeof require ? require : o.createRequire("undefined" == typeof document ? new (require("url").URL)("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("index.js", document.baseURI).href);

function h() {
    let t;
    const s = e.bgBlue(e.black(e.bold("tsc: ")));
    try {
        t = _.resolve(".bin/tsc"), console.log(s + e.bgBlue(e.black(t))), r.spawnSync(t, [ "-v" ], {
            stdio: [ "ignore", "inherit", "inherit" ],
            shell: !0
        });
    } catch {
        console.warn(s + e.bgRed(e.black("not found")));
    }
    return t;
}

function v(e) {
    return e.replace(/\\+/, "/");
}

function k(e) {
    const n = [], o = s.readdirSync(e, {
        withFileTypes: !0
    });
    for (let s, r, i = o.length; i-- > 0; ) s = o[i], /^[^._]/.test(s.name) && !/\.tests?($|\.)/i.test(s.name) && (r = t.join(e, s.name), 
    s.isDirectory() ? n.push(...k(r)) : /\.[mc]?[jt]s$/.test(s.name) && n.push(r));
    return n;
}

function j(t) {
    throw console.log(e.bgRed(e.black("ERROR: " + t))), process.kill(0), t;
}

const w = u(process.argv.slice(2), {
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
    if (console.log(b), w.help) console.log("help"); else {
        if (console.log("rollup: v" + i.VERSION), console.log("babel:  v" + a.version), 
        console.log(""), w.dir = t.resolve(w.dir), w.src = t.resolve(w.dir, w.src), w.out = t.resolve(w.dir, w.out), 
        console.log(e.bgGreen(e.black(e.bold("dir: ") + w.dir))), console.log(e.bgGreen(e.black(e.bold("src: ") + w.src))), 
        console.log(e.bgGreen(e.black(e.bold("out: ") + w.out))), console.log(""), !w.out.startsWith(w.dir)) return j("dir OUT must be in dir DIR");
        const m = t.resolve(w.dir, "package.json");
        if (!s.existsSync(m)) return j("package.json not found in " + w.dir);
        let f, g, _;
        function o() {
            const e = JSON.parse(s.readFileSync(m, "utf8")), t = e.dependencies || {}, n = e.peerDependencies || {};
            var o;
            f = (o = [ ...Object.keys(t), ...Object.keys(n) ], o.filter(((e, t, s) => e && s.indexOf(e) === t)).sort()).map((e => new RegExp(`^${e}($|/|\\\\)`)));
        }
        if (console.log(e.bgMagenta(e.black(e.bold("package.json: ") + m))), console.log(""), 
        o(), w.types) {
            if ("string" != typeof w.types && (w.types = "types"), w.types = t.resolve(w.dir, w.types), 
            console.log(e.bgGreen(e.black(e.bold("types: ") + w.types))), !w.types.startsWith(w.dir)) return console.log(e.bgRed(e.black("ERROR:"))), 
            j("dir TYPES must be in dir DIR");
            if (g = h()) {
                const q = t.resolve(n.tmpdir(), "dester-tsconfig.json"), N = {
                    include: [ v(t.resolve(w.src, "**/*")) ],
                    exclude: [ "**/node_modules", "**/_*", "**/*.test.*", "**/*.tests.*" ],
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
                        rootDir: v(w.src),
                        baseUrl: v(w.src),
                        outDir: v(w.types),
                        declarationDir: v(w.types)
                    }
                };
                s.writeFileSync(q, JSON.stringify(N));
                const O = r.spawn(g, [ "--build", q, ...w.watch ? [ "--watch" ] : [] ], {
                    cwd: w.src,
                    shell: !0
                });
                O.stdout.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgBlue(e.black("tsc: "))), console.dir(t);
                })), O.stderr.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgRed(e.black("tsc: "))), console.dir(t);
                }));
                const $ = function() {
                    O.kill(0);
                };
                process.on("SIGTERM", $), process.on("exit", $);
            }
        }
        function u() {
            if (!_) {
                const e = k(w.src).map((function(e) {
                    const {dir: s, name: n} = t.parse(t.relative(w.src, e));
                    return {
                        id: e,
                        fileName: t.join(s, "index" === n ? n : t.join(n, "index"))
                    };
                }));
                _ = e.sort((function(e, t) {
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
        let S, D = {};
        const R = i.watch([ ".mjs", ".js" ].map((function(e, t) {
            return {
                output: {
                    exports: "named",
                    format: ".js" === e ? "commonjs" : "esm",
                    dir: w.out,
                    chunkFileNames: "_includes/[name]-[hash]" + e,
                    generatedCode: x
                },
                external: function(e, t) {
                    if (t) return /^\.?[/\\]|\\/.test(e) ? void 0 : f.some((t => t.test(e)));
                },
                plugins: [ {
                    name: "chunks",
                    buildStart() {
                        _ || u(), t || (this.addWatchFile(w.src), this.addWatchFile(m));
                        for (let t = _.length; t-- > 0; ) this.emitFile({
                            type: "chunk",
                            id: _[t].id,
                            fileName: _[t].fileName + e,
                            preserveSignature: "strict",
                            generatedCode: x
                        });
                    }
                }, {
                    name: "sucrase-custom",
                    transform: (e, t) => /\.tsx?$/.test(t) ? d.transform(e, {
                        transforms: [ "typescript" ]
                    }).code : null
                }, w.ie && (n = w.ie, {
                    name: "babel-custom",
                    transform: async e => ({
                        code: (await a.transformAsync(e, {
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
                }), c({
                    extensions: [ ".mjs", ".js", ".jsx", ".mts", ".ts", ".tsx", ".json" ]
                }), l(), (s = w.min, {
                    name: "terser-custom",
                    renderChunk: async e => ({
                        code: e = (await p.minify(e, {
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
                            D[e] = t;
                        }
                        return "/* eslint-disable */\n" + e;
                    }
                } ]
            };
            var s, n;
        }))).on("change", (function(e, t) {
            e === m && o(), "update" !== t.event && (_ = null, console.log(t.event + ": " + e));
        })).on("event", (function(n) {
            if ("END" === n.code) {
                w.watch ? console.log("\n...WATCH...\n") : R.close(), console.log("");
                const n = D;
                if (D = {}, S === (S = JSON.stringify(n))) return;
                const o = JSON.parse(s.readFileSync(m, "utf8"));
                delete o.main, delete o.module, delete o.types;
                const r = {};
                if (o.files) for (let e of o.files) e = t.relative(w.dir, t.join(w.dir, e)), /^\.?[\\/]/.test(e) && j(e), 
                e = e.split(/[\\/]/)[0], r[e] = !0;
                const i = {};
                let l, c, a, p, d, u, f;
                for (const s in n) c = null, l = n[s], a = t.relative(w.dir, t.join(w.out, s)), 
                r[a.split(/[\\/]/)[0]] = !0, l && (p = "./" + v(t.dirname(a)), (d = "index.mjs" === a) && (o.main = "index", 
                o.module = "index.mjs", p = "."), a = v(a), console.log(e.green("BUILD: " + t.relative(w.src, l) + " => " + a)), 
                i[p] = {
                    import: "./" + a,
                    require: "./" + a.slice(0, -3) + "js"
                }, g && (c = t.relative(w.dir, t.join(w.types, t.relative(w.src, l))), c = v(c.replace(/\.([mc]?)[tj]s$/, ".d.$1ts")), 
                /\.d\.[mc]?ts$/.test(c) || j("type: " + c), d && (o.types = c), i[p].types = "./" + c));
                o.exports = {
                    "./package.json": "./package.json"
                };
                for (let e = Object.keys(i).sort(), t = 0; t < e.length; t++) o.exports[e[t]] = i[e[t]];
                o.files = [], g && (r[f = t.relative(w.dir, w.types).split(/[\\/]/)[0]] = !0);
                for (let e in r) f && f === e ? o.files.push(e + "/**/*") : s.existsSync(u = t.join(w.dir, e)) && (
                //! FIX FOR NPM
                s.lstatSync(u).isDirectory() && (e += "/**/*"), o.files.push(e));
                o.files.sort();
                const b = function(e) {
                    const t = {}, s = Object.keys(e).sort();
                    return [ ...y, ...s ].filter((function(e, t, n) {
                        return s.indexOf(e) > -1 && t === n.indexOf(e);
                    })).forEach((function(s) {
                        t[s] = e[s];
                    })), t;
                }(o);
                s.writeFileSync(m, JSON.stringify(b, null, 2));
            }
        }));
    }
}(), exports.getTSC = h;
