# Implement deepClone

> Tests recursion, type handling, and knowledge of edge cases. A common follow-up after "what's the difference between shallow and deep copy?"

## Problem

Implement `deepClone(value)` that returns a deep copy of any value (primitives, arrays, plain objects). Mention edge cases as you go.

## Naive version (interview starting point)

```js
function deepClone(value) {
  if (value === null || typeof value !== 'object') return value;

  if (Array.isArray(value)) {
    return value.map(deepClone);
  }

  const clone = {};
  for (const key of Object.keys(value)) {
    clone[key] = deepClone(value[key]);
  }
  return clone;
}
```

This handles primitives, arrays, and plain objects. Good enough to say out loud in an interview, then enumerate what it misses.

## What it doesn't handle

| Edge case | Problem |
|---|---|
| Circular references | Stack overflow |
| `Date` | Cloned as an empty object |
| `RegExp` | Cloned as an empty object |
| `Map`, `Set` | Cloned as an empty object |
| Functions | Skipped (or copied by reference — same function) |
| `Symbol` keys | Skipped by `Object.keys` |
| Non-enumerable properties | Skipped |

## Improved — handles circular refs, Date, RegExp, Map, Set

```js
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;

  if (seen.has(value)) return seen.get(value);

  if (value instanceof Date)   return new Date(value);
  if (value instanceof RegExp) return new RegExp(value);

  if (value instanceof Map) {
    const clone = new Map();
    seen.set(value, clone);
    for (const [k, v] of value) clone.set(deepClone(k, seen), deepClone(v, seen));
    return clone;
  }

  if (value instanceof Set) {
    const clone = new Set();
    seen.set(value, clone);
    for (const v of value) clone.add(deepClone(v, seen));
    return clone;
  }

  const clone = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
  seen.set(value, clone); // register before recursing to handle circular refs

  for (const key of [...Object.keys(value), ...Object.getOwnPropertySymbols(value)]) {
    clone[key] = deepClone(value[key], seen);
  }

  return clone;
}
```

## The production shortcut

```js
const clone = structuredClone(value); // native, handles most cases
```

`structuredClone` (available in modern browsers and Node 17+) handles circular references, `Date`, `Map`, `Set`, `ArrayBuffer`, etc. It does NOT clone functions or DOM nodes.

## Senior follow-ups

- **"Why `WeakMap` for the seen map?"** Keys are held weakly — when the original object is garbage-collected, the entry is removed. Using a plain `Map` would prevent GC during the clone.
- **"When would you choose `JSON.parse(JSON.stringify(x))`?"** Only for simple plain-object data with no dates, functions, or circular refs, and when you don't care about losing `undefined` / `NaN` / `Infinity` values. It's a code smell in most cases.
- **"Can you deep-clone a class instance?"** The improved version uses `Object.create(Object.getPrototypeOf(value))` to preserve the prototype chain, so methods are available. But private fields (`#field`) are not clonable from outside the class.
