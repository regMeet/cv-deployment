# Closure patterns — module, memoization, IIFE

> Closures aren't just a curiosity — they're behind several patterns you use every day.

## Module pattern

Encapsulate private state; expose only a public API.

```js
const counter = (() => {
  let _count = 0; // private

  return {
    increment() { _count++; },
    decrement() { _count--; },
    value()     { return _count; },
  };
})();

counter.increment();
counter.increment();
console.log(counter.value()); // 2
console.log(counter._count);  // undefined — not accessible
```

Before ES modules, this was the dominant pattern for avoiding global namespace pollution.

## Memoization

Cache results of expensive calls using a closure over a `Map`.

```js
function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const slowFib = (n) => n <= 1 ? n : slowFib(n - 1) + slowFib(n - 2);
const fastFib = memoize(slowFib);
```

**Caveat:** `JSON.stringify` fails on circular refs and is slow for large objects. For production, use a proper cache key strategy.

## IIFE (Immediately Invoked Function Expression)

Run a function once to create an isolated scope. Used mostly in pre-ES6 code.

```js
(function () {
  const secret = 42;
  // nothing leaks out
})();
```

Modern equivalent: just use a block with `let`/`const` or an ES module.

## Partial application / factory functions

```js
function multiply(factor) {
  return (n) => n * factor; // closes over `factor`
}

const double = multiply(2);
const triple = multiply(3);

double(5); // 10
triple(5); // 15
```

Each call to `multiply` creates a new closure over its own `factor`.

## Senior follow-ups

- **"How does the module pattern relate to ES modules?"** ES modules give you the same encapsulation natively, plus static analysis, tree-shaking, and lazy loading. Module pattern is the manual version.
- **"What's the risk of memoizing with `JSON.stringify`?"** It silently drops `undefined` values, doesn't handle functions/Symbols, and is O(n) for large objects. Prefer a WeakMap when keys are objects.
- **"Can closures cause memory leaks?"** Yes — if a closure holds a reference to a large object (e.g., a DOM element) and the closure itself is never garbage-collected (e.g., held by an event listener), the object stays in memory.
