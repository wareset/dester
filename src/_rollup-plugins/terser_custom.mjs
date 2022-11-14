import { minify as terser } from 'terser'

/** @return {import('rollup').Plugin} */
export default function terserPlugin(minify) {
  return {
    name: 'terser-custom',
    async renderChunk(code) {
      try {
        code = (await terser(code, {
          safari10: true,
          mangle  : true,
          module  : true,
          toplevel: true,
          compress: true,
          ...minify
            ? { keep_classnames: false }
            : {
              keep_classnames: true,
              format         : { beautify: true },
            }
        })).code
      } catch (e) {
        console.error('terser-custom')
        console.error(e)
      }
      return { code }
    }
  }
}
