import util1$1 from './util/util-1';
import { util2 } from './util/util-2';
import util1 from '../util-1';
import { isFunction } from '@wareset-utilites/is/isFunction';

var util3 = () => console.log('util-3' + util1);

var qwe = 12;
var json = {
	qwe: qwe
};

// import { CONSTANT } from './lib.js'
const { CONSTANT } = require('./lib');
console.log(json);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function test() {
  console.log('test', CONSTANT, isFunction);
  util1$1();
  util2();
  util3();
}

// ;(async (): Promise<void> => {
//   const q = import('@wareset-utilites/array')
//   console.log(q)
// })()

export default test;
