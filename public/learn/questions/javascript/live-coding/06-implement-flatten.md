# Implement flatten(arr, depth)

> Tests recursion and array manipulation. Quick exercise often used as a warm-up.

## Problem

Implement `flatten(arr, depth = 1)` that flattens a nested array up to `depth` levels.

```js
flatten([1, [2, [3, [4]]]])       // [1, 2, [3, [4]]]   depth=1
flatten([1, [2, [3, [4]]]], 2)    // [1, 2, 3, [4]]
flatten([1, [2, [3, [4]]]], Infinity) // [1, 2, 3, 4]
```

## Solution — recursive

```js
function flatten(arr, depth = 1) {
  if (depth === 0) return arr.slice();

  return arr.reduce((acc, item) => {
    if (Array.isArray(item) && depth > 0) {
      acc.push(...flatten(item, depth - 1));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}
```

## Solution — iterative with a stack

```js
function flattenAll(arr) {
  const result = [];
  const stack = [...arr];

  while (stack.length) {
    const item = stack.shift();
    if (Array.isArray(item)) {
      stack.unshift(...item);
    } else {
      result.push(item);
    }
  }

  return result;
}
```

`shift`/`unshift` preserves order. Swap for `pop`/`push` if you reverse at the end (faster for large arrays).

## Native equivalents

```js
arr.flat();          // depth 1
arr.flat(Infinity);  // fully flat
arr.flatMap(fn);     // map + flat(1) combined
```

## Senior follow-ups

- **"Why use spread with `push` rather than `concat`?"** `acc.push(...items)` mutates the existing array (no allocation). `acc.concat(items)` creates a new array each time — O(n²) in a reduce.
- **"What's the risk of `...flatten(item, depth - 1)` for deeply nested arrays?"** Spread inside `push` has a call stack limit per spread call (~100k items). For truly enormous arrays, prefer a loop or `Array.prototype.push.apply(acc, items)`.
- **"How does `flatMap` differ from `map(...).flat()`?"** They produce the same result, but `flatMap` is a single pass — more efficient for large arrays.
