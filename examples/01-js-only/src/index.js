// import { CONSTANT } from './lib.js'
const { CONSTANT } = require('./lib')
import util1 from './util/util-1'
import { util2 } from './util/util-2'
import util3 from './util/__aaa'

import json from './qwe.json'
console.log(json)
let a = 12

// import json2 from '../package.json'
// console.log(json2)

import { isFunction } from '@wareset-utilites/is/isFunction'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function test() {
  console.log('test', CONSTANT, isFunction)
  util1()
  util2()
  util3()
}

// ;(async (): Promise<void> => {
//   const q = import('@wareset-utilites/array')
//   console.log(q)
// })()
