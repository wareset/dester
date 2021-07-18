import jsonStringify from '@wareset-utilites/lang/jsonStringify'
import includes from '@wareset-utilites/array/includes'
import isObject from '@wareset-utilites/is/isObject'
import repeat from '@wareset-utilites/string/repeat'
// import { throwError } from '@wareset-utilites/error'
import trycatch from '@wareset-utilites/trycatch'
import nearly from '@wareset-utilites/nearly'

import { bgRed, bgYellow, bgGreen, bgBlue, black, bold, white } from 'kleur'

export const x1bLen = (str: string): number => {
  let res = 0
  // eslint-disable-next-line security/detect-unsafe-regex
  str.replace(/\x1b(?:\[\d+m)?/g, (_full) => {
    res += _full.length
    return ''
  })
  return res
}

const __fixBG__ = (str: string): string => {
  let res = str
  let s: number
  trycatch(() => {
    const q = +process.stdout.columns
    // prettier-ignore
    if (q)
      res = res
        .split(/\r?\n|\r/)
        .map((v) =>
          (v + repeat(' ', (s = nearly(v.length, q, 1)))).slice(0, s + x1bLen(v))
        )
        .join('\n')
  })
  return res
}

const __normalize__ = (a: any[]): string =>
  a
    .map((v: any) => (isObject(v) ? jsonStringify(v, undefined, 2) : v))
    .join('\n')
    .split('\n')
    .map((v: string) => '  ' + v + '  ')
    .join('\n')

const messageFactory = (
  title: string,
  bg = bgRed,
  kill = false,
  color1 = white,
  color2 = black
) => (...a: any): void => {
  const msg = bg(__normalize__(a))
  const v = bg('\n  ' + bold(color1(title)) + '  \n' + color2(msg) + '\n\n')
  console.log('')
  console.log(__fixBG__(v))
  if (kill) process.exit()
  // console.log('')
}

export const messageError = messageFactory('FATAL ERROR:', bgRed, true) as (
  ...a: any
) => never
export const messageCompileError = messageFactory('ERROR:', bgRed)
export const messageWarn = messageFactory('WARNING:', bgYellow)
export const messageSuccess = messageFactory('SUCCESS:', bgGreen)
export const messageInfo = messageFactory('INFO:', bgBlue)

export const log = (...a: any): void => {
  console.log(__normalize__(a))
}

export const logColoredFactory = (bgColor = bgGreen, color = black) => (
  ...a: any
): void => {
  let s = __normalize__(a)
  const is = includes(s, '\n')
  if (is) s = '\n' + __fixBG__(s)
  console.log(bgColor(color(s)))
  if (is) console.log('')
}

export const logError = logColoredFactory(bgRed)
export const logInfo = logColoredFactory(bgBlue)
export const logWarn = logColoredFactory(bgYellow)
export const logSuccess = logColoredFactory(bgGreen)
