import repeat from '@wareset-utilites/string/repeat'
import trycatch from '@wareset-utilites/trycatch'

import { red, bold, cyan, bgBlack } from 'kleur'

import { x1bLen } from './messages'

// prettier-ignore
const LOGO = bgBlack(cyan(bold(`
    ___       ${red('__')} _ ${red('_ _ _ /_,_')}  ${red('_______   ____')}
   / _ \\_${red('(/(/(_(')}/ ${red('(-_)(-/_ _)')} ${red('/ ___/ /  /  _/')}
  / _/ / -_/_ —/ __/ -_/ __/ ${red('/ /__/ /___/ /')}
  \\___/\\__/___/\\__/\\__/_/    ${red('\\___/____/___/')}

`)))

// prettier-ignore
const viewLogo = (): void => {
  let l = LOGO
  trycatch(() => {
    const qs = +process.stdout.columns
    if (qs) {
      const r = repeat(' ', qs)
      l = LOGO.split('\n').map((v) => (v + r).slice(0, qs + x1bLen(v))).join('\n')
    }
  })
  console.log(l)
}

export default viewLogo
