function test() {
  return function (target, propertyKey = '') {
    console.log(target, propertyKey);
  };
}

export default test;
