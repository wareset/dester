# 03-build-in-root

#### package.json:

before starting the `Dester`:

```json
{
  "files": ["README.md", "a-non-existent-file"],
  "scripts": {
    "build": "dester ./src ./ -s",
    "dev": "npm run build -- -w"
  },
  "devDependencies": {
    "dester": "0.x"
  }
}
```

after starting the `Dester`:

```json
{
  "files": [
    "README.md",
    "__types__",
    "index.d.ts",
    "index.js",
    "index.mjs",
    "lib-1",
    "lib-2"
  ],
  "scripts": {
    "build": "dester ./src ./ -s",
    "dev": "npm run build -- -w"
  },
  "devDependencies": {
    "dester": "0.x"
  },
  "main": "index",
  "module": "index.mjs",
  "types": "index.d.ts"
}
```
