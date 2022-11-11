import { LIB } from './lib'
import { _HIDDEN } from './_hidden'

import { qqq } from './sssssss'

// import { fscale } from 'math-safe'
// console.log(fscale)

import { resolve } from 'path'
import { normalize } from 'node:path'

export const index = (): void => {
  console.log('index', LIB, _HIDDEN, resolve, normalize, qqq)
  console.log(Object.keys, Object.values)
}

export { LIB }

export default class Reeeee {
  constructor(public a: any) {}

  get A(): any {
    return { ...this.a, ...{ q: 12112122 } }
  }
}
