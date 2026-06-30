# var vs let vs const — hoisting & TDZ

> The only reason `var` still matters in interviews is that it behaves differently enough to produce gotchas.

## Quick comparison

| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | Function | Block | Block |
| Hoisted | Yes (as `undefined`) | Yes (TDZ) | Yes (TDZ) |
| Re-declare | Yes | No | No |
| Re-assign | Yes | Yes | No |
| Global property | Yes (on `window`) | No | No |

## Hoisting

All declarations are "hoisted" (moved to the top of their scope by the engine). The difference is the initialization:

```js
console.log(a); // undefined — var is hoisted and initialized to undefined
var a = 1;

console.log(b); // ReferenceError — let is hoisted but NOT initialized (TDZ)
let b = 2;
```

## Temporal Dead Zone (TDZ)

The period between entering a block and the `let`/`const` declaration being reached. Accessing the variable there throws a `ReferenceError`.

```js
{
  // TDZ starts here for `x`
  console.log(x); // ReferenceError
  let x = 5;      // TDZ ends
}
```

## `const` is not immutable

`const` prevents **reassignment**, not mutation of the value:

```js
const arr = [1, 2, 3];
arr.push(4);       // fine — mutating the array
arr = [1, 2, 3, 4]; // TypeError — reassigning the binding
```

## `var` function scope trap

```js
function test() {
  if (true) {
    var x = 1; // scoped to `test`, not the if-block
  }
  console.log(x); // 1 — visible outside the if
}
```

Same code with `let` would throw a `ReferenceError` outside the `if`.

## When to use each

- **`const`** by default — signals the binding won't change.
- **`let`** when you need to reassign (loop counters, accumulator variables).
- **`var`** almost never in new code. Only legacy codebases or specific hoisting tricks.

## Senior follow-ups

- **"Why does `var` at the top level create a global property?"** `var` outside any function binds to the global object (`window` in browsers). `let`/`const` do not.
- **"What does the TDZ prevent?"** Accessing a value before it's been initialized — a class of bugs that `var` silently masked with `undefined`.
- **"Can you have a TDZ error with `const` inside a class?"** Yes — class bodies are in strict mode, and method initializers that reference properties before they're declared hit the TDZ.
