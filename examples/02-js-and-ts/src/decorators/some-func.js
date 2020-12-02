export default function test() {
  return function (target, propertyKey = '') {
    console.log(target, propertyKey);
  };
}
