# What does this print? (var in loop)

> Tests whether you understand that `var` creates a single binding shared across all iterations.

## Exercise A

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

<details>
<summary><strong>Answer</strong></summary>

```
3
3
3
```

All three callbacks close over the **same** `i`. By the time any of them runs (after the loop finishes), `i` is `3`.

</details>

## Exercise B — same loop with `let`

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

<details>
<summary><strong>Answer</strong></summary>

```
0
1
2
```

`let` creates a **new binding per iteration**. Each callback closes over its own copy of `i`.

</details>

## How to fix the `var` version without `let`

**Option 1 — IIFE to create a new scope per iteration:**

```js
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(() => console.log(j), 0);
  })(i);
}
```

**Option 2 — `bind` to capture the value:**

```js
for (var i = 0; i < 3; i++) {
  setTimeout(console.log.bind(null, i), 0);
}
```

## Exercise C — objects, not primitives

```js
const fns = [];

for (var i = 0; i < 3; i++) {
  fns.push(() => i);
}

console.log(fns[0](), fns[1](), fns[2]());
```

<details>
<summary><strong>Answer</strong></summary>

```
3 3 3
```

Same reason — `var i` is one variable, and all closures reference it after the loop ends.

</details>

## Senior follow-ups

- **"What does `let` do differently under the hood?"** The spec requires a new environment record per iteration for `let`/`const` in `for` loops. The engine essentially creates a new variable for each iteration.
- **"Does the same issue affect `for...of`?"** Yes if using `var`. `for (var x of arr)` has the same problem. `for (let x of arr)` is safe.
- **"What if you use `const` in a regular `for` loop?"** `const i = 0` then `i++` throws a TypeError because `const` can't be reassigned. `const` works fine in `for...of` / `for...in` since each iteration creates a new binding.
