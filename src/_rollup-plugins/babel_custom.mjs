import { transformAsync as babel } from '@babel/core'

/** @return {import('rollup').Plugin} */
export default function babelPlugin(ie) {
  return {
    name: 'babel-custom',
    async transform(code) {
      try {
        code = (await babel(code, {
          presets: [
            [
              '@babel/preset-env',
              {
                corejs     : 3,
                loose      : true,
                bugfixes   : true,
                modules    : false,
                useBuiltIns: 'entry', // 'entry', 'usage'
                targets    : '> 1%, not dead' + (ie ? ', ie ' + Math.max(9, +ie || 11) : ''),
              }
            ]
          ],
          plugins: ['@babel/plugin-transform-runtime']
        })).code
      } catch (e) {
        console.error('babel-custom')
        console.error(e)
      }
      return { code }
    }
  }
}
