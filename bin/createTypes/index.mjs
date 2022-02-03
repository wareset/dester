import { green } from 'kleur';
import { resolve, join, dirname, parse } from 'path';
import { writeFileSync, readFileSync } from 'fs';
import { spawn } from 'child_process';
import { trycatch, hash, jsonStringify, jsonParse, filterUnique } from '../ws-utils';
import sortPackageJson from '../sortPackageJson';
import { messageInfo, messageError, logError, log } from '../messages';
import { processExit, removeSync, toPosix, existsStatSync, createDirSync } from '../utils';

const createCacheDir = () => {
    const res = resolve(require.main.paths[0] || resolve(), '.cache', 'dester');
    createDirSync(res);
    return res;
};
const createTypes = (types, input, output, pkgbeauty, watch, silent) => {
    let tsc = '';
    if (types) {
        silent ||
            messageInfo('Creating types. Trying to start a "tsc". TypesDir:', types);
        trycatch(() => {
            tsc = require.resolve('.bin/tsc');
            // silent ||
            //   messageSuccess('Module "tsc" ("typescript") has been found:', tsc)
        }, () => {
            messageError('Unable to start creating types. "typescript" not found.', 'Use argument "--no-types" or install "typescript" (npm i typescript)');
        });
        // createDirSync(types)
        const configfile = resolve(createCacheDir(), hash(input + output) + '.json');
        processExit(() => {
            removeSync(configfile);
        });
        const config = {
            // Change this to match your project
            include: [toPosix(join(input, '/**/*'))],
            exclude: [
                // toPosix(pathJoin(input, '/**/(_*|tests?|*.tests?.*|tests?.*|*.tests?)'))
                toPosix(join(input, '/**/_*')),
                toPosix(join(input, '/**/test')),
                toPosix(join(input, '/**/tests')),
                toPosix(join(input, '/**/*.test.*')),
                toPosix(join(input, '/**/*.tests.*')),
                toPosix(join(input, '/**/*.test')),
                toPosix(join(input, '/**/*.tests')),
                toPosix(join(input, '/**/test.*')),
                toPosix(join(input, '/**/tests.*'))
            ],
            compilerOptions: {
                // Tells TypeScript to read JS files, as
                // normally they are ignored as source files
                allowJs: true,
                // Generate d.ts files
                declaration: true,
                // This compiler run should
                // only output d.ts files
                emitDeclarationOnly: true,
                // Types should go into this directory.
                // Removing this would place the .d.ts files
                // next to the .js files
                outDir: toPosix(types),
                // declarationDir: DIR_TYPES,
                experimentalDecorators: true,
                emitDecoratorMetadata: true,
                resolveJsonModule: true,
                allowSyntheticDefaultImports: true,
                esModuleInterop: true,
                target: 'esnext',
                moduleResolution: 'node',
                module: 'esnext'
            }
        };
        trycatch(() => writeFileSync(configfile, jsonStringify(config, void 0, 2)), (e) => messageError(e));
        trycatch(() => {
            let childProcess = spawn(tsc, ['--build', configfile, ...watch ? ['--watch'] : []], { shell: true }
            // { stdio: ['ignore', 'inherit', 'inherit'], shell: true })
            );
            const exit = () => {
                childProcess && childProcess.kill(0), childProcess = null;
            };
            processExit(exit);
            childProcess.stdout.on('data', (data) => {
                // eslint-disable-next-line no-control-regex
                data = (data + '').replace(/[\u001bc]/g, '').trim();
                if (data) {
                    const isErr = /error([^s]|$)/i.test(data);
                    const mes = isErr ? logError : log;
                    if (!silent || isErr) {
                        mes((isErr ? 'ERROR: ' : green('TYPES: ')) + data);
                    }
                }
            });
            childProcess.stderr.on('data', (data) => {
                exit(), messageError('' + data);
            });
        }, () => {
            messageError('"Types" child_process not work');
        });
        const parentDir = dirname(types);
        const pkgjsonfile = resolve(parentDir, 'package.json');
        if (existsStatSync(pkgjsonfile)) {
            const typesFoldername = parse(types).name;
            const pkgJsonStrOld = readFileSync(pkgjsonfile, 'utf8').toString();
            let pkgJson = jsonParse(pkgJsonStrOld);
            if (pkgJson.files) {
                pkgJson.files = filterUnique([...pkgJson.files, typesFoldername]).sort();
            }
            if (pkgbeauty)
                pkgJson = sortPackageJson(pkgJson);
            const pkgJsonStrNew = jsonStringify(pkgJson, void 0, 2);
            pkgJsonStrOld.trim() === pkgJsonStrNew.trim() ||
                writeFileSync(pkgjsonfile, pkgJsonStrNew);
        }
    }
    return !!tsc;
};

export { createTypes as default };
