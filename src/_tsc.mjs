import { createRequire } from 'module'

import { spawnSync as child_process_spawnSync } from 'child_process'

import kleur from 'kleur'

const REQUIRE = typeof require !== 'undefined'
  ? require
  : createRequire(import.meta.url)

const title = kleur.bgBlue(kleur.black(kleur.bold('tsc: ')))

export function getTSC() {
  let tsc
  try {
    tsc = REQUIRE.resolve('.bin/tsc')
    console.log(title + kleur.bgBlue(kleur.black(tsc)))

    child_process_spawnSync(tsc, ['-v'], {
      stdio: ['ignore', 'inherit', 'inherit'],
      shell: true
    })
  } catch {
    console.warn(title + kleur.bgRed(kleur.black('not found')))
  }
  return tsc
}
