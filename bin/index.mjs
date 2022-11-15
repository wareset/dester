/* eslint-disable */
import e from "kleur";

import { resolve as t, relative as o, join as n, dirname as s, parse as r } from "path";

import { existsSync as i, readFileSync as l, writeFileSync as c, lstatSync as a, readdirSync as p } from "fs";

import { createRequire as d } from "module";

import { spawn as m, spawnSync as u } from "child_process";

import { VERSION as f, watch as g } from "rollup";

import b from "@rollup/plugin-commonjs";

import h from "@rollup/plugin-node-resolve";

import { transformAsync as _, version as y } from "@babel/core";

import x from "@rollup/plugin-inject";

import { minify as k } from "terser";

import { transform as v } from "sucrase";

import j from "minimist";

const w = JSON, D = w.parse, $ = Object, R = $.keys, I = RegExp, N = w.stringify, {red: O, cyan: M, bold: S} = e, C = M(S(`\n    ___       ${O("__")} _ ${O("_ _ _ /_,_")}  ${O("_______   ____")}\n   / _ \\_${O("(/(/(_(")}/ ${O("(-_)(-/_ _)")} ${O("/ ___/ /  /  _/")}\n  / _/ / -_/_ —/ __/ -_/ __/ ${O("/ /__/ /___/ /")}\n  \\___/\\__/___/\\__/\\__/_/    ${O("\\___/____/___/")}\n\n`)), E = [].concat([ "$schema", "name", "displayName", "version" ], [ "private", "publishConfig" ], [ "description", "categories", "keywords", "license", "qna" ], [ "homepage", "bugs", "repository", "funding" ], [ "author", "maintainers", "contributors", "publisher" ], "sideEffects", "type", [ "proxy", "homepage" ], [ "flat", "resolutions", "workspaces" ], "bolt", "jsdelivr", "unpkg", [ "source", "umd:main" ], "jsnext:main", "main", "module", [ "types", "typesVersions", "typings" ], "files", "assets", [ "imports", "exports", "bin", "man", "directories" ], [ "browser", "esnext", "es2015", "esm", "module-browser", "modules.root" ], [ "engines", "engineStrict", "languageName", "os", "cpu" ], "preferGlobal", "example", "examplestyle", [ "binary", "scripts", "betterScripts", "capabilities", "activationEvents", "contributes", "husky", "simple-git-hooks", "commitlint", "lint-staged", "config", "nodemonConfig" ], [ "applypatch-msg", "pre-applypatch", "post-applypatch", "pre-commit", "pre-merge-commit", "prepare-commit-msg", "commit-msg", "post-commit", "pre-rebase", "post-checkout", "post-merge", "pre-push", "pre-receive", "update", "proc-receive", "post-receive", "post-update", "reference-transaction", "push-to-checkout", "pre-auto-gc", "post-rewrite", "sendemail-validate", "fsmonitor-watchman", "p4-changelist", "p4-prepare-changelist", "p4-post-changelist", "p4-pre-submit", "post-index-change" ], [ "flow", "flow:main" ], [ "browserify", "browserify.transform" ], "browserslist", "babel", "style", "xo", "prettier", [ "eslintConfig", "eslintIgnore" ], "npmpkgjsonlint", "remarkConfig", "stylelint", "ava", "jest", "mocha", "nyc", "tap", [ "react-native" ], [ "@std", "@std/esm" ], [ "jspm", "ignore", "format", "registry", "shim", "map" ], "size-limit", "pwmetrics", [ "peerDependencies", "peerDependenciesMeta", "optionalDependencies", "optionalDependenciesMeta", "bundledDependencies", "bundledDependenciesMeta", "bundleDependencies", "bundleDependenciesMeta", "devDependencies", "devDependenciesMeta", "dependencies", "dependenciesMeta" ], [ "extensionPack", "extensionDependencies", "icon", "badges", "galleryBanner", "preview", "markdown" ]);

const F = $.getOwnPropertyNames, W = $.prototype, B = Math, T = "dester-inject-", G = function(e, t) {
    const o = {};
    for (let n = F(W), s = n.length; s-- > 0; ) o["Object.prototype." + n[s]] = T + "Object.prototype." + n[s];
    for (let n, s = e.length; s-- > 0; ) {
        n = e[s];
        for (let e = [ "prototype" ].concat(F(n[1])), t = e.length; t-- > 0; ) o[n[0] + "." + e[t]] = T + n[0] + "." + e[t];
        o[n[0]] = T + n[0];
    }
    for (let n, s = t.length; s-- > 0; ) o[n = t[s]] = T + n;
    return o;
}([ [ "Object", $ ], [ "Number", Number ], [ "Math", B ], [ "String", String ], [ "Array", Array ], [ "JSON", w ], [ "Promise", Promise ] ], "\nFunction Boolean\nDate\nRegExp\nError\n\nsetTimeout\nclearTimeout\nsetInterval\nclearInterval\n\neval\nisFinite\nisNaN\nparseFloat\nparseInt\ndecodeURI\ndecodeURIComponent\nencodeURI\nencodeURIComponent\n".trim().split(/\W+/));

const P = B.max;

const U = "undefined" != typeof require ? require : d(import.meta.url);

function q(e) {
    return e.replace(/[/\\]+/, "/");
}

function A(e) {
    const t = [], o = p(e, {
        withFileTypes: !0
    });
    for (let s, r, i = o.length; i-- > 0; ) s = o[i], /^[^._]/.test(s.name) && !/\.tests?($|\.)/i.test(s.name) && (r = n(e, s.name), 
    s.isDirectory() ? t.push(...A(r)) : /\.[mc]?[jt]s$/.test(s.name) && t.push(r));
    return t;
}

function J(t) {
    throw console.log(e.bgRed(e.black("ERROR: " + t))), process.kill(0), t;
}

const z = j(process.argv.slice(2), {
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
    if (console.log(C), z.help) console.log("help"); else {
        if (z.watch && console.clear(), console.log("rollup: v" + f), console.log("babel:  v" + y), 
        console.log(""), z.dir = t(z.dir), z.src = t(z.dir, z.src), z.out = t(z.dir, z.out), 
        console.log(e.bgGreen(e.black(e.bold("dir: ") + z.dir))), console.log(e.bgGreen(e.black(e.bold("src: ") + z.src))), 
        console.log(e.bgGreen(e.black(e.bold("out: ") + z.out))), console.log(""), !z.out.startsWith(z.dir)) return J("dir OUT must be in dir DIR");
        const j = t(z.dir, "package.json");
        if (!i(j)) return J("package.json not found in " + z.dir);
        let w, $, O;
        function p() {
            const e = D(l(j, "utf8")), t = e.dependencies || {}, o = e.peerDependencies || {};
            var n;
            w = (n = [ ...R(process.binding("natives")), ...R(t), ...R(o) ], n.filter(((e, t, o) => e && o.indexOf(e) === t)).sort()).map((e => new I(`^${e}($|/|\\\\)`)));
        }
        if (console.log(e.bgMagenta(e.black(e.bold("package.json: ") + j))), console.log(""), 
        p(), z.types) {
            if ("string" != typeof z.types && (z.types = "types"), z.types = t(z.dir, z.types), 
            console.log(e.bgGreen(e.black(e.bold("types: ") + z.types))), !z.types.startsWith(z.dir)) return console.log(e.bgRed(e.black("ERROR:"))), 
            J("dir TYPES must be in dir DIR");
            if ($ = function() {
                let t;
                const o = e.bgBlue(e.black(e.bold("tsc: ")));
                try {
                    t = U.resolve(".bin/tsc"), console.log(o + e.bgBlue(e.black(t))), u(t, [ "-v" ], {
                        stdio: [ "ignore", "inherit", "inherit" ],
                        shell: !0
                    });
                } catch {
                    console.warn(o + e.bgRed(e.black("not found")));
                }
                return t;
            }()) {
                const B = t(z.dir, ".dester.tsconfig.json");
                let H = {};
                if (i(B)) try {
                    H = D(l(B)).compilerOptions || {};
                } catch {}
                const L = {
                    include: [ q(t(z.src, "**/*")) ],
                    exclude: [ q(t(z.src, "**/node_modules")), q(t(z.src, "**/_*")), q(t(z.src, "**/*.test.*")), q(t(z.src, "**/*.tests.*")) ],
                    compilerOptions: {
                        ...H,
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
                        outDir: q(z.types)
                    }
                };
                c(B, N(L, null, 2));
                const V = m($, [ "--build", B, ...z.watch ? [ "--watch" ] : [] ], {
                    cwd: z.src,
                    shell: !0
                });
                V.stdout.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgBlue(e.black("tsc: "))), console.dir(t);
                })), V.stderr.on("data", (function(t) {
                    t = t.toString().trim(), console.log("\n" + e.bgRed(e.black("tsc: "))), console.dir(t);
                }));
                const Y = function() {
                    V.kill(0);
                };
                process.on("SIGTERM", Y), process.on("exit", Y);
            }
        }
        function d() {
            if (!O) {
                const e = A(z.src).map((function(e) {
                    const {dir: t, name: s} = r(o(z.src, e));
                    return {
                        id: e,
                        fileName: n(t, "index" === s ? s : n(s, "index"))
                    };
                }));
                O = e.sort((function(e, t) {
                    return e.fileName.localeCompare(t.fileName);
                }));
            }
        }
        console.log("");
        const M = {
            preset: "es5",
            arrowFunctions: !1,
            constBindings: !0,
            objectShorthand: !1,
            reservedNamesAsProps: !0,
            symbols: !1
        };
        let S, F = {};
        const W = g([ ".mjs", ".js" ].map((function(t, s) {
            return {
                output: {
                    exports: "named",
                    format: ".js" === t ? "commonjs" : "esm",
                    dir: z.out,
                    chunkFileNames: "_includes/[name]" + t,
                    generatedCode: M
                },
                external: function(e, t) {
                    return !!e.startsWith("node:") || (t ? /^\.?[/\\]|\\/.test(e) ? void 0 : !!w.length && w.some((t => t.test(e))) : void 0);
                },
                plugins: [ {
                    name: "chunks",
                    buildStart() {
                        O || d(), s || (this.addWatchFile(z.src), this.addWatchFile(j));
                        for (let e = O.length; e-- > 0; ) this.emitFile({
                            type: "chunk",
                            id: O[e].id,
                            fileName: O[e].fileName + t,
                            generatedCode: M
                        });
                    }
                }, {
                    name: "sucrase-custom",
                    transform(e, t) {
                        if (/\.[mc]?tsx?$/.test(t)) {
                            try {
                                e = v(e, {
                                    transforms: [ "typescript" ]
                                }).code;
                            } catch (o) {
                                console.error("sucrase-custom"), console.error(o);
                            }
                            return {
                                code: e
                            };
                        }
                        return null;
                    }
                }, ...z.ie ? [ (i = z.ie, {
                    name: "babel-custom",
                    async transform(e) {
                        try {
                            e = (await _(e, {
                                presets: [ [ "@babel/preset-env", {
                                    corejs: 3,
                                    loose: !0,
                                    bugfixes: !0,
                                    modules: !1,
                                    useBuiltIns: "entry",
                                    targets: "> 1%, not dead" + (i ? ", ie " + P(9, +i || 11) : "")
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
                }) ] : [], x(G), {
                    name: T,
                    resolveId: e => e.startsWith(T) ? {
                        id: e,
                        external: !1
                    } : null,
                    load: e => e.startsWith(T) ? `const v = ${e.slice(T.length)}; export default v` : null
                }, h({
                    extensions: [ ".mjs", ".js", ".jsx", ".mts", ".ts", ".tsx", ".json" ]
                }), b(), (r = z.min, {
                    name: "terser-custom",
                    async renderChunk(e) {
                        try {
                            e = (await k(e, {
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
                    renderChunk(t, r) {
                        if (!s) {
                            const {fileName: t, facadeModuleId: s, exports: l} = r;
                            F[t] = {
                                facadeModuleId: s,
                                exports: l
                            };
                            try {
                                s && console.log(e.green("BUILD: " + o(z.src, s) + " => " + o(z.dir, n(z.out, t))));
                            } catch (i) {
                                console.error(i);
                            }
                        }
                        return "/* eslint-disable */\n" + t;
                    }
                } ]
            };
            var r, i;
        }))).on("change", (function(e, t) {
            e === j && p(), "update" !== t.event && (O = null, console.log(t.event + ": " + e));
        })).on("event", (function(e) {
            if ("ERROR" === e.code) console.error(e); else if ("END" === e.code) {
                z.watch ? console.log("\n...WATCH...\n") : W.close(), console.log("");
                const e = F;
                if (F = {}, S === (S = N(e))) return;
                const r = D(l(j, "utf8"));
                delete r.main, delete r.module, delete r.types;
                const p = {};
                if (r.files) for (let t of r.files) t = o(z.dir, n(z.dir, t)), /^\.?[\\/]/.test(t) && J(t), 
                t = t.split(/[\\/]/)[0], p[t] = !0;
                const d = {}, m = {};
                let u, f, g, b, h, _, y;
                for (const t in e) f = null, u = e[t].facadeModuleId, g = o(z.dir, n(z.out, t)), 
                p[g.split(/[\\/]/)[0]] = !0, u && (b = "./" + q(s(g)), (h = "index.mjs" === g) && (r.main = "index", 
                r.module = "index.mjs", b = ".", p["index.js"] = p["index.mjs"] = !0), g = q(g), 
                d[b] = {
                    import: "./" + g,
                    require: "./" + g.slice(0, -3) + "js"
                }, m[b] = e[t].exports, $ && (f = o(z.dir, n(z.types, o(z.src, u))), f = q(f.replace(/\.([mc]?)[tj]s$/, ".d.$1ts")), 
                /\.d\.[mc]?ts$/.test(f) || J("type: " + f), h && (r.types = f, p["index.d.ts"] = !0), 
                d[b].types = "./" + f));
                r.exports = {
                    "./package.json": "./package.json"
                };
                for (let n, i = R(d).sort(), l = 0; l < i.length; l++) if (n = i[l], r.exports[n] = d[n], 
                $) {
                    let e = q(o(t(z.dir, s(d[n].import)), t(z.dir, d[n].types))).replace(/(\/index)?\.d\.\w+$/, "");
                    "." !== e[0] && (e = "./" + e), e = N(e);
                    let r = `export * from ${e};\n`;
                    for (const t of m[n]) "default" === t ? r += `import { ${t} as __default__ } from ${e};\nexport { __default__ as default };\n` : "*" !== t[0] && (r += `export { ${t} } from ${e};\n`);
                    c(t(z.dir, n, "index.d.ts"), r);
                }
                r.files = [], $ && (p[y = o(z.dir, z.types).split(/[\\/]/)[0]] = !0);
                for (let t in p) $ && "index.d.ts" === t ? r.files.push(t) : $ && y && y === t ? r.files.push(t + "/**/*") : i(_ = n(z.dir, t)) && (
                //! FIX FOR NPM
                a(_).isDirectory() && (t += "/**/*"), r.files.push(t));
                r.files.sort();
                const x = function(e) {
                    const t = {}, o = R(e).sort();
                    return [ ...E, ...o ].filter((function(e, t, n) {
                        return o.indexOf(e) > -1 && t === n.indexOf(e);
                    })).forEach((function(o) {
                        t[o] = e[o];
                    })), t;
                }(r);
                c(j, N(x, null, 2));
            }
        }));
    }
}();
