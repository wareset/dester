import rollupInject from '@rollup/plugin-inject'
// TODO
const NAME = 'dester-inject-'

const injectMethods = {}
const injectObjects = {}
;(function (listFns, listOther) {
  for (let a = Object.getOwnPropertyNames(Object.prototype),
    i = a.length; i-- > 0;) {
    injectMethods['Object.prototype.' + a[i]] = NAME + 'Object.prototype.' + a[i]
  }

  for (let v, i = listFns.length; i-- > 0;) {
    v = listFns[i]
    for (let a = ['prototype'].concat(Object.getOwnPropertyNames(v[1])),
      i = a.length; i-- > 0;) {
      injectMethods[v[0] + '.' + a[i]] = NAME + v[0] + '.' + a[i]
    }

    injectObjects[v[0]] = NAME + v[0]
  }

  for (let v, i = listOther.length; i-- > 0;) injectObjects[v = listOther[i]] = NAME + v
})(
  [
    ['Object', Object],
    ['Number', Number],
    ['Math', Math],
    ['String', String],
    ['Array', Array],
    ['JSON', JSON],
    ['Promise', Promise],
  ],

  `
Function
Boolean

Date
RegExp
Error

setTimeout
clearTimeout
setInterval
clearInterval

eval
isFinite
isNaN
parseFloat
parseInt
decodeURI
decodeURIComponent
encodeURI
encodeURIComponent
`.trim().split(/\W+/)
)

/*
Symbol BigInt
AggregateError EvalError RangeError ReferenceError SyntaxError TypeError URIError
Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array 
Int32Array Uint32Array Float32Array Float64Array BigInt64Array BigUint64Array
Map Set WeakMap WeakSet
ArrayBuffer SharedArrayBuffer Atomics DataView 
Promise Generator GeneratorFunction AsyncFunction AsyncGenerator AsyncGeneratorFunction
Reflect Proxy
Intl
*/

export default function fake_inject() {
  // console.log(injectObject)

  return [
    rollupInject(injectMethods),
    rollupInject(injectObjects),
    {
      name: NAME,
      resolveId(id) {
        return id.startsWith(NAME) ? { id, external: false } : null
      },
      load(id) {
        if (id.startsWith(NAME)) {
          const v = id.slice(NAME.length)
          return `const v = ${v}; export default v`
        }
        return null
      },
    }
  ]
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
