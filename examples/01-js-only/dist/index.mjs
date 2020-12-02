import util1 from './util/util-1';
import { util2 } from './util/util-2';

const CONSTANT = 'some-value';

function test() {
  console.log('test', CONSTANT);
  util1();
  util2();
}

export default test;
