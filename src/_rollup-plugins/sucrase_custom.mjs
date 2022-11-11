import { transform as sucrase } from 'sucrase'

/** @return {import('rollup').Plugin} */
export default function sucrasePlugin() {
  return {
    name: 'sucrase-custom',
    transform(code, id) {
      return /\.tsx?$/.test(id)
        ? sucrase(code, { transforms: ['typescript'] }).code : null
    }
  }
}
