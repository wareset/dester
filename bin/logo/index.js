'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var repeat = require('@wareset-utilites/string/repeat');
var trycatch = require('@wareset-utilites/trycatch');
var kleur = require('kleur');
var messages = require('../messages');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var repeat__default = /*#__PURE__*/_interopDefaultLegacy(repeat);
var trycatch__default = /*#__PURE__*/_interopDefaultLegacy(trycatch);

// prettier-ignore
const LOGO = kleur.bgBlack(kleur.cyan(kleur.bold(`
    ___       ${kleur.red('__')} _ ${kleur.red('_ _ _ /_,_')}  ${kleur.red('_______   ____')}
   / _ \\_${kleur.red('(/(/(_(')}/ ${kleur.red('(-_)(-/_ _)')} ${kleur.red('/ ___/ /  /  _/')}
  / _/ / -_/_ —/ __/ -_/ __/ ${kleur.red('/ /__/ /___/ /')}
  \\___/\\__/___/\\__/\\__/_/    ${kleur.red('\\___/____/___/')}

`)));
// prettier-ignore
const viewLogo = () => {
    let l = LOGO;
    trycatch__default['default'](() => {
        const qs = +process.stdout.columns;
        if (qs) {
            const r = repeat__default['default'](' ', qs);
            l = LOGO.split('\n').map((v) => (v + r).slice(0, qs + messages.x1bLen(v))).join('\n');
        }
    });
    console.log(l);
};

exports.default = viewLogo;
