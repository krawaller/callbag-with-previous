# callbag-with-previous

[Callbag](https://github.com/callbag/callbag) operator that puts the previous value alongside the current in an array.

```
[currentValue, previousValue]
```

The first output will also have `true` as a third item, to allow you to distinguish from the previous item being `undefined` and the first value.

```
[firstValue, undefined, true]
```

`npm install callbag-with-previous`

## example

```js
const fromIter = require('callbag-from-iter');
const forEach = require('callbag-for-each');
const withPrevious = require('callbag-with-previous');

const source = withPrevious(fromIter([1,2,3]));

forEach(x => console.log(x))(source); // [1, undefined, true]
                                      // [2, 1]
                                      // [3, 2]
```
