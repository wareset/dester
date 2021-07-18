import { green, red } from 'kleur';
import { readdirSync } from 'fs';
import { resolve, parse } from 'path';
import startsWith from '@wareset-utilites/string/startsWith';
import isString from '@wareset-utilites/is/isString';
import { messageWarn, log } from '../messages';
import { isAllowedFile, isJTSX, removeSync } from '../utils';

const __removeAndMessage__ = (removeDir, silent, prefix = 'auto', warn) => {
    if (removeSync(removeDir))
        silent || log(green(prefix + 'remove: ') + removeDir);
    else if (warn)
        silent || log(red(prefix + 'remove: file not found ') + removeDir);
};
const autoremove = (remove, input, output, types, silent) => {
    if (remove) {
        if (isString(remove)) {
            const removeDir = remove.split(',').map((v) => resolve(v));
            removeDir.forEach((removeDir) => {
                if (startsWith(input, removeDir))
                    silent ||
                        messageWarn('"Input" and "RemoveDir" should be different and separate:', { input, removeDir });
                else
                    __removeAndMessage__(removeDir, silent, '', true);
            });
        }
        else if (output) {
            readdirSync(input, { withFileTypes: true }).forEach((Dirent) => {
                let name = Dirent.name;
                if (isAllowedFile(name)) {
                    let isDir;
                    if (!Dirent.isDirectory())
                        (isDir = true), (name = isJTSX(name) ? parse(name).name : '');
                    if (!isDir && name === 'index') {
                        // __removeAndMessage__(pathResolve(output, name + '.js'), silent)
                        // __removeAndMessage__(pathResolve(output, name + '.mjs'), silent)
                        types ||
                            __removeAndMessage__(resolve(output, name + '.d.ts'), silent);
                    }
                    else if (name)
                        __removeAndMessage__(resolve(output, name), silent);
                }
            });
        }
    }
};

export default autoremove;
