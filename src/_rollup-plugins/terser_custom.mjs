import { minify as terser } from 'terser'

/** @return {import('rollup').Plugin} */
export default function terserPlugin(minify) {
  return {
    name: 'terser-custom',
    async renderChunk(code) {
      code = (await terser(code, {
        safari10: true,
        mangle  : true,
        ...minify
          ? {
            toplevel       : true,
            compress       : true,
            keep_classnames: false,
          }
          : {
            toplevel       : false,
            compress       : false,
            keep_classnames: true,
            format         : { beautify: true },
          }
      })).code
      return { code }
    }
  }
}
