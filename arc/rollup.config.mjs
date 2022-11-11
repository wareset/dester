import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

import babel_custom from './src/rollup-plugins/babel_custom.mjs'
// import terser_custom from './src/rollup-plugins/terser_custom.mjs'
import sucrase_custom from './src/rollup-plugins/sucrase_custom.mjs'

// import { watch } from 'rollup'

const generatedCode = {
  preset              : 'es5',
  arrowFunctions      : false,
  constBindings       : true,
  objectShorthand     : false,
  reservedNamesAsProps: true,
  symbols             : false
}

const config =
[
  '.js',
  '.mjs',
].map(function(extension) {
  /** @type {import('rollup').RollupOptions[]} */
  return {
    output: {
      format        : extension === '.js' ? 'commonjs' : 'esm',
      dir           : 'test/dist',
      chunkFileNames: '_includes/[name]-[hash]' + extension,
      generatedCode,
    },
    external: function(id, importree) {
      // console.log(id)
      if (importree) {
        if (/^([/\\]|\w:|\.)/.test(id)) {
        // not package
        } else {
          return true
        }
      }
      return null
    },
    plugins: [
      (function() {
        return {
          name: 'chunks',
          buildStart() {
            console.log(11111111111111, [extension])
            this.emitFile({
              type             : 'chunk',
              id               : './test/src/index.ts',
              fileName         : 'index' + extension,
              preserveSignature: 'strict',
              generatedCode
            })
  
            this.emitFile({
              type             : 'chunk',
              id               : './test/src/other.ts',
              fileName         : 'other' + extension,
              preserveSignature: 'strict',
              generatedCode
            })
          }
        }
      })(),
      // {
      //   resolveId(id) {
      //     console.log(id)
      //   }
      // },
      sucrase_custom(),
      babel_custom(9),
      resolve({ extensions: ['.mjs', '.js', '.jsx', '.mts', '.ts', '.tsx', '.json'] }),
      commonjs(),
      // terser_custom()
    ]
  }
})

export default config
