# dester

A simple CLI js/ts lib-builder that uses [Rollup](https://www.npmjs.com/package/rollup), [@babel/core](https://www.npmjs.com/package/@babel/core) and [TypeScript](https://www.npmjs.com/package/typescript)/[Sucrase](https://www.npmjs.com/package/sucrase)

```bash
   ___       __ _ _ _ _ /_,_  _______   ____
  / _ \_(/(/(_(/ (-_)(-/_ _) / ___/ /  /  _/
 / _/ / -_/_ —/ __/ -_/ __/ / /__/ /___/ /
/____/\__/___/\__/\__/_/    \___/____/___/
```

## Note

- `Dester` is needed to easily and quickly compile `js/ts` scripts into the final library.
- For correct compilation, you must adhere to the established requirements for directory structures (below is an example). Examples can be found [here](https://github.com/wareset/dester/tree/main/examples).
- The files `package.json` and `tsconfig.json` are found automatically by going up the directory tree.
- When building, `dependencies` from the `package.json` are taken into account.
- Files and directories that with `.test(s)` or start with a sign `_` are ignored.
- Powered on Linux, Mac, Windows. But if something is wrong, [write](https://github.com/wareset/dester/issues) to us)))

## Example

This is an example of the package files:

### Example of a structure:

```bash
project-folder
│
├── src
│   ├── index.ts      /* Used by `typescript` or `sucrase` */
│   │
│   ├── some-folder
│   │   ├── _excluded-file.js
│   │   ├── some-file-1.js
│   │   ├── some-file-1.test.js
│   │   └── some-file-2.js
│   │
│   ├── _excluded-folder
│   │   └── index.js
│   │
│   └── other-folder
│       ├── other-file-1.js
│       ├── other-file-2.js
│       └── index.js
│
├── dist
│
...
│
├── babel.config.json /* Not necessary */
├── package.json      /* Not necessary */
├── README.md
└── tsconfig.json     /* Not necessary */
```

#### running the dester:

```bash
cd ./project-folder
dester ./src ./dist
```

or run use babel:

```bash
dester ./src ./dist --babel
```

##### `babel.config.json`:

```json
{
  "plugins": [["@babel/plugin-proposal-class-properties"]]
}
```

#### result:

```bash
project-folder
│
├── src
│   └── ...
│
├── dist
│   ├── __types__  /* Need `typescript` */
│   │   ├── index.d.ts
│   │   ...
│   │   └── other-folder
│   │
│   ├── index.d.ts /* Need `typescript` */
│   ├── index.js
│   ├── index.mjs
│   ├── package.json
│   │
│   ├── some-folder
│   │   ├── some-file-1
│   │   │   ├── index.d.ts
│   │   │   ├── index.mjs
│   │   │   ├── index.js
│   │   │   └── package.json
│   │   │
│   │   └── some-file-2
│   │       ├── index.d.ts
│   │       ├── index.mjs
│   │       ├── index.js
│   │       └── package.json
│   │
│   └── other-folder
│       ├── other-file-1
│       │   ├── index.d.ts
│       │   ├── index.mjs
│       │   ├── index.js
│       │   └── package.json
│       │
│       ├── other-file-2
│       │   ├── index.d.ts
│       │   ├── index.mjs
│       │   ├── index.js
│       │   └── package.json
│       │
│       ├── index.d.ts
│       ├── index.mjs
│       ├── index.js
│       └── package.json
│
...
│
├── babel.config.json
├── package.json
├── README.md
└── tsconfig.json
```

#### interpretation:

- The file `package.json` was found automatically;
- The file `tsconfig.json` was found automatically;
- In a folder `some-folder` not a file `index.js`. Therefore, all files were created in separate folders;
- The file `index.d.ts` and folder `__types__` will be created if you have the `typescript` (`tsc`) installed.
- `_excluded-folder` and `_excluded-file.js` were ignored because they start with the `_`.
- `some-file-1.test.js` were ignored because they with the `.test.`.

#### Generated `dist/package.json` file structure:

```json
{
  "main": "index",
  "module": "index.mjs",
  "types": "index.d.ts",
  "files": [
    "__types__",
    "index.d.ts",
    "index.js",
    "index.mjs",
    "some-folder",
    "other-folder"
  ]
}
```

More examples can be found [here](https://github.com/wareset/dester/tree/main/examples).

## Installation

```bash
npm install -D dester # yarn add -D dester
npm install -D typescript # if needed
```

or globally:

```bash
npm install -g dester
npm install -g typescript # if needed
```

## Use

Example of work in a project's `package.json`:

```json
{
  "name": "project-name",
  "version": "0.0.1",
  "scripts": {
    "dester": "dester ./src ./dist --babel",
    "build": "npm run dester -- --remove ./dist",
    "dev": "npm run dester -- -w --no-remove"
  }
}
```

## Command List

```bash
  Arguments:
    dester [input] [output]
    -i, --input  -  Input folder. Default: "src"
    -o, --output -  Output folder. Default: "dist"

    -r, --remove -  Remove or autoremove folders. Default: true
    -t, --types  -  Folder for declarations. Default: "__types__"
    -w, --watch  -  Watch changes in files and configs. Default: false
    -s, --silent -  Show only error messages. Default: false
    -f, --force  -  Will ignore some errors. Default: false
    --pkgbeauty  -  The 'package.json' will be slightly combed. Default: true

    --pkg        -  Path to package.json. Default: true
    --tsc        -  Path to tsconfig.json. Default: true
    --babel      -  Path to babel.config.json. Default: false

    -h, --help   -  This help
```

- If the path for `types` doesn't start with a `./` or `../`, they the will be created in the `dist` folder.

## Command examples

```bash
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
    dester  --r
    dester  --remove
  - Remove folder "DIST_FOLDER_NAME" before build ("DIST_FOLDER_NAME" will be cleared only if it does not contain "Input"):
    dester  --r DIST_FOLDER_NAME
    dester  --remove DIST_FOLDER_NAME

  Types:
  - Not create types:
    dester  --no-t
    dester  --no-types
  - Create types (DEFAULT):
    dester  --t __types__
    dester  --types __types__
  - Create types in "TYPES_FOLDER_NAME":
    dester  --t TYPES_FOLDER_NAME
    dester  --types TYPES_FOLDER_NAME

  Watch:
    dester  --w
    dester  --watch

  Silent mode:
    dester  --s
    dester  --silent

  Force:
    dester  --f
    dester  --force

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
```

## Lisence

MIT
