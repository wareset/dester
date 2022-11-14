import { transform as sucrase } from 'sucrase'

/** @return {import('rollup').Plugin} */
export default function sucrasePlugin() {
  return {
    name: 'sucrase-custom',
    transform(code, id) {
      if (/\.[mc]?tsx?$/.test(id)) {
        try {
          code = sucrase(code, { transforms: ['typescript'] }).code
        } catch (e) {
          console.error('sucrase-custom')
          console.error(e)
        }
        return { code }
      }
      return null
    }
  }
}
