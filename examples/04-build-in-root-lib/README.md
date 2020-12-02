# 04-build-in-root-lib

#### package.json:

before starting the `Dester`:

```json
{
  "files": ["README.md", "a-non-existent-file"],
  "scripts": {
    "build": "dester ./src ./ -s --no-tsc -t types",
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
  "files": ["README.md", "lib-1", "lib-2", "lib-4", "types"],
  "scripts": {
    "build": "dester ./src ./ -s --no-tsc -t types",
    "dev": "npm run build -- -w"
  },
  "devDependencies": {
    "dester": "0.x"
  }
}
```
