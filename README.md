# debounce-safe
Safe debounce.

## Usage:
debounce(func: `function`, [wait: `number` = 1, [leading: `boolean` = false, [trailing*: `boolean`]]])

// * - if "leading" is `false`, "trailing" always will be `true`. Otherwise, the 'func' will never be called.

#### Base:
```js
import debounce from 'debounce-safe'
// or const debounce = require('debounce-safe').default

debounce(func, 21)
debounce(func, 21, false),
debounce(func, 21, false, true) //the last argument is ignored
debounce(func, 21, false, false) // the last argument is ignored
// like lodash.debounce(func, 21, { leading: false, trailing: true })

debounce(func, 12, true)
debounce(func, 12, true, false)
// like lodash.debounce(func, 12, { leading: true, trailing: false })

debounce(func, 111, true, true)
// like lodash.debounce(func, 111, { leading: true, trailing: true })

```

#### Methods:
`clear`, `flush` and `cause`
```js
import debounce from 'debounce-safe'

const func = (a, b) => { return a + b }

const debouncedFunc = debounce(func, 2000)

// standard call. "func" is called after 2 seconds 
debouncedFunc(1, 2) // => void

// Reset as if the "debouncedFunc" had never been called.
debouncedFunc.clear() // => void

// Execute the "func" synchronously,
// but if it was to be executed after a while.
// It works as a 'TIME ACCELERATION' - the next call 
// will be possible only after 2 seconds
debouncedFunc.flush() // => void

// Synchronously calls a "func" with arguments.
// This also works as a 'TIME ACCELERATION'
debouncedFunc.cause(2, 3) // => 5

```

## Why is there another `debounce` on the `npm`?
I was looking for a function that could work quickly without having anything extra in the code. And, most importantly, it should be safe to recursively call itself. 

But I didn't find any, because all the other libraries can be divided into two types - either very simple or very redundant.

And none of the existing solutions were safe for recursive calls.

For example:

```js
import _debounce from 'lodash.debounce'

const func = (n) => {
  console.log('lodash open', n)
  if (n < 5) debouncedFunc(n + 1)
  console.log('lodash exit', n)
  return n
}

const debouncedFunc = _debounce(func, 1000, {
  leading: true,
  trailing: true
})

debouncedFunc(0)
// console.log =>
/*
22:20:14.012 lodash open 0
22:20:14.013 lodash exit 0
22:20:15.013 lodash open 1
22:20:15.013 lodash open 2
22:20:15.013 lodash exit 2
22:20:15.013 lodash exit 1
22:20:16.013 lodash open 3
22:20:16.013 lodash open 4
22:20:16.013 lodash exit 4
22:20:16.014 lodash exit 3
22:20:17.013 lodash open 5
22:20:17.014 lodash exit 5
*/

// WHAT'S GOING ON HERE ANYWAY???

```

And here is my library:

```js
import debounceSafe from 'debounce-safe'

const func = (n) => {
  console.log('safely open', n)
  if (n < 5) debouncedFunc(n + 1)
  console.log('safely exit', n)
  return n
}

const debouncedFunc = debounceSafe(func, 1000, true, true)

debouncedFunc(0)
// console.log =>
/*
22:20:52.989 safely open 0
22:20:52.989 safely exit 0
22:20:53.989 safely open 1
22:20:53.989 safely exit 1
22:20:54.989 safely open 2
22:20:54.990 safely exit 2
22:20:55.990 safely open 3
22:20:55.990 safely exit 3
22:20:56.990 safely open 4
22:20:56.990 safely exit 4
22:20:57.991 safely open 5
22:20:57.991 safely exit 5
*/

// And this is the behavior that I expected

```

## License
[MIT](LICENSE)
