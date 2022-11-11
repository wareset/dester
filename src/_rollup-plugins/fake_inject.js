import rollupInject from '@rollup/plugin-inject'
// TODO
const NAME = 'fake--inject--'

const injectObject = (function(listSave, listOther) {
  const obj = {}
  for (let v, i = listSave.length; i-- > 0;) obj[v = listSave[i]] = NAME + v
  return obj
})(`
Object Function Boolean Error
Number Math Date
String RegExp
Array JSON Map Set
`.trim().split(/\W+/),

`
Infinity
Symbol BigInt
AggregateError EvalError RangeError ReferenceError SyntaxError TypeError URIError
Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array 
Int32Array Uint32Array Float32Array Float64Array BigInt64Array BigUint64Array
WeakMap WeakSet
ArrayBuffer SharedArrayBuffer Atomics DataView 
Promise Generator GeneratorFunction AsyncFunction AsyncGenerator AsyncGeneratorFunction
Reflect Proxy
Intl
`.trim().split(/\W+/))

export default function fake_inject() {

}

// rollupInject(injectObject),
// {
//   name: 'fake--inject--',
//   resolveId(id) {
//     return /^fake--inject--/.test(id) ? { id, external: false } : null
//   },
//   load(id) {
//     if (/^fake--inject--/.test(id)) {
//       const v = id.slice(14)
//       return `const v = ${v}; export default v`
//     }
//     return null
//   },
// },
