export const isArray = Array.isArray
export const isString = (v: any): v is string => typeof v === 'string'
export const isNumber = (v: any): v is number => typeof v === 'number'
export const isBoolean = (v: any): v is boolean => typeof v === 'boolean'
export const isObject = (v: any): v is object => v != null && typeof v === 'object'

export const jsonStringify = JSON.stringify
export const jsonParse = JSON.parse

export const keys = Object.keys

export const concat =
  <T>(...lists: (T | T[])[]): T[] => [].concat(...lists as any)

export const trycatch = <T, B>(
  tryFn: () => T,
  catchFn?: ((error?: Error, ...a: any[]) => B) | B,
  errorMsg?: boolean
): T | B => {
  let res
  try {
    res = tryFn()
  } catch (e: any) {
    if (errorMsg) console.error(e)
    res = typeof catchFn === 'function' ? (catchFn as any)(e) : catchFn
  }
  return res as T | B
}

export const filterUnique =
  <T>(arr: T[]): T[] => arr.filter((v, k, a) => k === a.indexOf(v))

export const hash = (str: any, salt?: string): string => {
  str = ((salt || '') + str).replace(/\r/g, '')
  let h = 0
  let i = str.length
  while (i--) h = (256 * h + str.charCodeAt(i)) % 2147483642 // 0x7ffffffa
  return (-h >>> 0).toString(36)
}

const { abs, floor, round, ceil } = Math

export const nearly = ((): {
  (value: number, pattern: number | number[], method?: -1 | 0 | 1): number
} => {
  const METHODS_FOR_NUM = { '-1': floor, '0': round, '1': ceil }

  const METHODS_FOR_ARR = {
    '-1': (a = 0, b = 0, c = 0): boolean => abs(a - c) <= abs(b - c),
    '0' : (a = 0, b = 0, c = 0): boolean => abs(a - c) < abs(b - c),
    '1' : null
  }

  return (
    value: number,
    pattern: number | number[],
    method: -1 | 0 | 1 = 0
  ): number => {
    let res: any
    if (isArray(pattern)) {
      if (!pattern.length) res = value
      else {
        const f = METHODS_FOR_ARR[method] || METHODS_FOR_ARR[0]
        res = pattern.reduce((prev, curr) =>
          f(prev, curr, value) ? prev : curr)
      }
    } else if (pattern && isNumber(pattern)) {
      pattern = abs(pattern)

      const coef = abs(value % pattern)
      let fin = value - coef
      fin = +method > 0 || !method && coef > pattern / 2 ? fin + pattern : fin

      const str = `${pattern}`
      const index = str.indexOf('.')
      res = index === -1 ? fin : +fin.toFixed(str.length - index - 1)
    } else res = (METHODS_FOR_NUM[method] || METHODS_FOR_NUM[0])(value)

    return res
  }
})()
