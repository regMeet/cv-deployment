# Implement curry

> Tests closures, variadic functions, and functional programming knowledge. Harder than it looks.

## Problem

Implement `curry(fn)` that returns a curried version of `fn`. The curried function can be called with any number of arguments at a time; it accumulates them until it has enough to call `fn`.

```js
function add(a, b, c) { return a + b + c; }

const curriedAdd = curry(add);
curriedAdd(1)(2)(3);    // 6
curriedAdd(1, 2)(3);    // 6
curriedAdd(1)(2, 3);    // 6
curriedAdd(1, 2, 3);    // 6
```

## Solution

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}
```

**How it works:**
- `fn.length` is the number of declared parameters.
- If we have enough arguments, call `fn`.
- Otherwise, return a new function that accumulates more arguments and recurses.

## Usage examples

```js
const multiply = curry((a, b) => a * b);
const double = multiply(2); // partially applied
double(5);  // 10
double(10); // 20

const greet = curry((greeting, name) => `${greeting}, ${name}!`);
const hello = greet('Hello');
hello('Ana');  // 'Hello, Ana!'
hello('Juan'); // 'Hello, Juan!'
```

## Partial application vs curry

Partial application fixes some arguments upfront:

```js
const add5 = add.bind(null, 5); // partial application
add5(3); // 8
```

Curry transforms a function so you can partially apply it with any split:

```js
const c = curry((a, b, c) => a + b + c);
c(1)(2)(3); // call one at a time
c(1, 2)(3); // or 2 + 1
```

## Edge cases

```js
// Functions with rest parameters — fn.length is 0, so curried calls fn immediately
function sum(...args) { return args.reduce((a, b) => a + b, 0); }
curry(sum)(1)(2); // calls sum() with [1] — not useful

// Fix: require explicit arity
function curryN(fn, arity = fn.length) {
  return function curried(...args) {
    if (args.length >= arity) return fn.apply(this, args);
    return (...more) => curried(...args, ...more);
  };
}

const sum3 = curryN(sum, 3);
sum3(1)(2)(3); // 6
```

## Senior follow-ups

- **"What's `fn.length` for default parameters?"** Default parameters (and rest) don't count toward `fn.length`. `(a, b = 1) => ...` has `.length` of `1`.
- **"How is currying used in real codebases?"** Lodash/fp and Ramda export curried functions. Useful for point-free style: `const activeUsers = filter(user => user.active)`.
- **"What's the difference between currying and partial application?"** Currying always produces unary functions one argument at a time. Partial application pre-fills some arguments but returns a function that takes the rest all at once.
