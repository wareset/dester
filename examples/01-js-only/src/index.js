import { CONSTANT } from './lib'
import util1 from './util/util-1'
import { util2 } from './util/util-2'

import { isFunction } from '@wareset-utilites/is/isFunction'

export default function test() {
  console.log('test', CONSTANT, isFunction)
  util1()
  util2()
}
