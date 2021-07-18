import jsonStringify from '@wareset-utilites/lang/jsonStringify';
import includes from '@wareset-utilites/array/includes';
import isObject from '@wareset-utilites/is/isObject';
import repeat from '@wareset-utilites/string/repeat';
import trycatch from '@wareset-utilites/trycatch';
import nearly from '@wareset-utilites/nearly';
import { bold, bgRed, bgYellow, bgGreen, bgBlue, black, white } from 'kleur';

const x1bLen = (str) => {
    let res = 0;
    // eslint-disable-next-line security/detect-unsafe-regex
    str.replace(/\x1b(?:\[\d+m)?/g, (_full) => {
        res += _full.length;
        return '';
    });
    return res;
};
const __fixBG__ = (str) => {
    let res = str;
    let s;
    trycatch(() => {
        const q = +process.stdout.columns;
        // prettier-ignore
        if (q)
            res = res
                .split(/\r?\n|\r/)
                .map((v) => (v + repeat(' ', (s = nearly(v.length, q, 1)))).slice(0, s + x1bLen(v)))
                .join('\n');
    });
    return res;
};
const __normalize__ = (a) => a
    .map((v) => (isObject(v) ? jsonStringify(v, undefined, 2) : v))
    .join('\n')
    .split('\n')
    .map((v) => '  ' + v + '  ')
    .join('\n');
const messageFactory = (title, bg = bgRed, kill = false, color1 = white, color2 = black) => (...a) => {
    const msg = bg(__normalize__(a));
    const v = bg('\n  ' + bold(color1(title)) + '  \n' + color2(msg) + '\n\n');
    console.log('');
    console.log(__fixBG__(v));
    if (kill)
        process.exit();
    // console.log('')
};
const messageError = messageFactory('FATAL ERROR:', bgRed, true);
const messageCompileError = messageFactory('ERROR:', bgRed);
const messageWarn = messageFactory('WARNING:', bgYellow);
const messageSuccess = messageFactory('SUCCESS:', bgGreen);
const messageInfo = messageFactory('INFO:', bgBlue);
const log = (...a) => {
    console.log(__normalize__(a));
};
const logColoredFactory = (bgColor = bgGreen, color = black) => (...a) => {
    let s = __normalize__(a);
    const is = includes(s, '\n');
    if (is)
        s = '\n' + __fixBG__(s);
    console.log(bgColor(color(s)));
    if (is)
        console.log('');
};
const logError = logColoredFactory(bgRed);
const logInfo = logColoredFactory(bgBlue);
const logWarn = logColoredFactory(bgYellow);
const logSuccess = logColoredFactory(bgGreen);

export { log, logColoredFactory, logError, logInfo, logSuccess, logWarn, messageCompileError, messageError, messageInfo, messageSuccess, messageWarn, x1bLen };
