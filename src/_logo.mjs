import kleur from 'kleur'
const { red, cyan, bold } = kleur

// prettier-ignore
const LOGO = cyan(bold(`
    ___       ${red('__')} _ ${red('_ _ _ /_,_')}  ${red('_______   ____')}
   / _ \\_${red('(/(/(_(')}/ ${red('(-_)(-/_ _)')} ${red('/ ___/ /  /  _/')}
  / _/ / -_/_ —/ __/ -_/ __/ ${red('/ /__/ /___/ /')}
  \\___/\\__/___/\\__/\\__/_/    ${red('\\___/____/___/')}

`))

export { LOGO }
