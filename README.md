# dester

A simple CLI js/ts lib-builder that uses [Rollup](https://www.npmjs.com/package/rollup) and [TypeScript](https://www.npmjs.com/package/typescript)/[Sucrase](https://www.npmjs.com/package/sucrase)

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
- Files and directories that start with a sign `_` are ignored.
- Powered on Linux, Mac, Windows. But if something is wrong, [write](https://github.com/wareset/dester/issues) to us)))

## Example

This is an example of the package files:

### Example of a structure:

```bash
project-folder
│
├── src
│   ├── any-file-1.ts
│   ├── any-file-2.ts
│   ├── index.ts      /* Used by `typescript` or `sucrase` */
│   │
│   ├── some-folder
│   │   ├── some-file-1.js
│   │   └── some-file-2.js
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
├── package.json  /* Not necessary */
├── README.md
└── tsconfig.json /* Not necessary */
```

#### running the dester:

```bash
cd ./project-folder
dester ./src ./dist
```

#### result:

```bash
project-folder
│
├── src
│   └── ...
│
├── dist
│   ├── __types__  /* Need a global or local `typescript` */
│   │   ├── any-file-1.d.ts
│   │   ...
│   │   └── other-folder
│   │
│   ├── index.d.ts /* Need a global or local `typescript` */
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
│       ├── index.d.ts
│       ├── index.mjs
│       ├── index.js
│       └── package.json
│
...
│
├── package.json
├── README.md
└── tsconfig.json
```

#### interpretation:

- The file `package.json` was found automatically;
- The file `tsconfig.json` was found automatically;
- The files `any-file-1.ts` and `any-file-2.ts` are missing in the folder because there is a file `index.ts` next to them. But directories always remain;
- In a folder `some-folder` not a file `index.js`. Therefore, all files were created in separate folders;
- The file `index.d.ts` and folder `__types__` will be created if you have the `typescript` (`tsc`) installed.

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
    "dester": "dester ./src ./dist",
    "build": "rm -rf ./dist && npm run dester",
    "dev": "npm run dester -- -w"
  }
}
```

## Command List

```bash
Arguments:
  dester [input] [output]
  -i, --input  -  Input folder. Default: "src"
  -o, --output -  Output folder. Default: "dist"
  -t, --types  -  Folder for declarations. Default: "__types__"
  -w, --watch  -  Watch changes in files and configs. Default: false
  -s, --silent -  Do not display messages. Default: false
  --sourcemap  -  Create SourceMap. Default: false
  --pkg        -  Path to package.json. Default: "auto"
  --tsc        -  Path to tsconfig.json. Default: "auto"
```
- If the path for `types` doesn't start with a `./` or `../`, they the will be created in the `dist` folder.
## Command examples

```bash
Examples:
  dester
  dester ./src
  dester ./src ./dist

Types:
- Not create types:
  dester ./src ./dist --no-t
  dester ./src ./dist --no-types
- Create types in "TYPES_FOLDER_NAME":
  dester ./src ./dist --types TYPES_FOLDER_NAME
  dester ./src ./dist -t ./dist/TYPES_FOLDER_NAME

Watch:
  dester ./src ./dist -w
  dester ./src ./dist --watch

Silent mode:
  dester ./src ./dist -s
  dester ./src ./dist --silent

Create source maps:
  dester ./src ./dist --sourcemap

Set package.json:
- Not find package.json:
  dester ./src ./dist --no-pkg
- Find package.json:
  dester ./src ./dist --pkg ./some-dir
  dester ./src ./dist --pkg ./some-dir/package.json
  dester ./src ./dist --pkg ./some-dir/custom-package.json

Set tsconfig.json:
- Not find tsconfig.json:
  dester ./src ./dist --no-tsc
- Find tsconfig.json:
  dester ./src ./dist --tsc ./some-dir
  dester ./src ./dist --tsc ./some-dir/tsconfig.json
```

## Lisence

MIT
