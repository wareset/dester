'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var kleur = require('kleur');

const colorizeHelp = (source) => {
    const sourceArr = source.split('\n').map((v) => {
        let opts;
        if (/^\s\s\w/.test(v)) {
            v = kleur.bold(kleur.bgBlack(kleur.red(v + '  ')));
        }
        else if (/^\s\s-/.test(v)) {
            v = kleur.bold(kleur.bgBlue(kleur.white(v + '  ')));
        }
        else if (/^\s\s\(/.test(v)) {
            v = kleur.bold(kleur.bgRed(kleur.white(v + '  ')));
        }
        else if (/^\s\s\s\s-/.test(v) && (opts = v.split(/\s-\s/)).length === 2) {
            v =
                opts[0]
                    .split(/\s\s/)
                    .map((v) => v.trim() ? kleur.bold(kleur.bgWhite(kleur.black(' ' + v + ' '))) : v)
                    .join('  ') +
                    ' - ' +
                    opts[1];
        }
        return v;
    });
    return sourceArr.join('\n');
};
// prettier-ignore
const __help__ = `
  Arguments:
    dester [input] [output]
    -i, --input  -  Input folder. Default: "src"
    -o, --output -  Output folder. Default: "dist"

    -r, --remove -  Remove or autoremove folders. Default: true
    -t, --types  -  Folder for declarations. Default: "__types__"
    -w, --watch  -  Watch changes in files and configs. Default: false
    -s, --silent -  Show only error messages. Default: false
    -f, --force  -  Will ignore some errors. Default: false
    -m, --minify -  Use the "terser" for minify js files. Default: false
    --pkgbeauty  -  The 'package.json' will be slightly combed. Default: true

    --pkg        -  Path to package.json. Default: true
    --tsc        -  Path to tsconfig.json. Default: true
    --babel      -  Path to babel.config.json. Default: false

    -h, --help   -  This help

  Examples:
    dester ./src
    dester ./src ./dist
    dester ./dist -i ./src
    dester -o ./dist ./src

  Remove folders:
  - Not remove (nothing will be deleted):
    dester  --no-r
    dester  --no-remove
  - Remove only created subfolders (DEFAULT) (the subdirectories that will be found based on the "Input" will be cleared):
    dester  -r
    dester  --remove
  - Remove folder "DIST_FOLDER_NAME" before build ("DIST_FOLDER_NAME" will be cleared only if it does not contain "Input"):
    dester  -r DIST_FOLDER_NAME
    dester  --remove DIST_FOLDER_NAME

  Types:
  - Not create types:
    dester  --no-t
    dester  --no-types
  - Create types (DEFAULT):
    dester  -t __types__
    dester  --types __types__
  - Create types in "TYPES_FOLDER_NAME":
    dester  -t TYPES_FOLDER_NAME
    dester  --types TYPES_FOLDER_NAME

  Watch:
    dester  -w
    dester  --watch

  Silent mode:
    dester  -s
    dester  --silent

  Force:
    dester  -f
    dester  --force

  Minify:
    dester  -m
    dester  --minify

  Beauty package.json files (default: true):
    dester  --pkgbeauty
    dester  --no-pkgbeauty

  Set package.json:
  - Not find package.json:
    dester  --no-pkg
  - Auto-find package.json (DEFAULT):
    dester  --pkg
  - Find or auto-find package.json in dir:
    dester  --pkg ./some-dir
    dester  --pkg ./some-dir/custom-name-package.json

  Set tsconfig.json:
  (need dependency "typescript")
  - Not find tsconfig.json:
    dester  --no-tsc
  - Auto-find tsconfig.json (DEFAULT):
    dester  --tsc
  - Find or auto-find tsconfig.json in dir:
    dester  --pkg ./some-dir
    dester  --pkg ./some-dir/custom-name-tsconfig.json

  Set babel.config.json (.babelrc.json):
  (need dependency "@babel/core")
  - Not find babel.config.json (DEFAULT):
    dester  --no-babel
  - Auto-find babel.config.json:
    dester  --babel
  - Find or auto-find babel.config.json in dir:
    dester  --pkg ./some-dir
    dester  --pkg ./some-dir/babel.config.js
`;
var help = colorizeHelp(__help__);

exports["default"] = help;
