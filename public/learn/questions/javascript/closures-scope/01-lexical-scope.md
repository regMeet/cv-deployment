# Lexical scope and closures

> A closure is a function that **remembers the variables from the scope where it was defined**, even after that scope has returned.

## Lexical scope

Scope is determined at **write time** (where the function is defined), not at **call time** (where it's called).

```js
function outer() {
  const x = 10;

  function inner() {
    console.log(x); // sees x from outer's scope
  }

  return inner;
}

const fn = outer(); // outer() has returned
fn(); // 10 — inner still has access to x
```

`inner` closed over `x`. The variable lives as long as `inner` does.

## What gets captured

The closure captures the **variable binding**, not a snapshot of its value.

```js
function makeCounter() {
  let count = 0;
  return {
    inc: () => ++count,
    get: () => count,
  };
}

const c = makeCounter();
c.inc(); c.inc();
console.log(c.get()); // 2 — both methods share the same `count`
```

## Scope chain

Every function has a reference to its outer scope. When a variable isn't found locally, the engine walks up the chain:

```
inner scope → outer scope → module scope → global scope
```

## Common mistake — shared binding in loops

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // prints 3, 3, 3
}
```

All three callbacks close over the **same** `i`. By the time they fire, the loop is done and `i === 3`.

Fix with `let` (block-scoped, new binding per iteration):

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0, 1, 2
}
```

## Senior follow-ups

- **"What's the memory implication of closures?"** As long as the closure is reachable, it holds its entire scope chain alive. Closures over large objects can cause unintentional memory retention.
- **"How would you avoid the loop problem without `let`?"** IIFE to create a new scope: `(function(j) { setTimeout(() => console.log(j), 0); })(i)`.
- **"Is a closure a copy or a reference?"** Always a reference to the binding — mutations are reflected everywhere that shares the closure.
