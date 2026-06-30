# What does this print? (event loop + Promises)

> Classic interview exercise. Tests whether you know the microtask/macrotask queue order cold.

## Exercise

```js
function doTasks() {
  setTimeout(function timeout() {
    console.log('Timed out!');
  }, 0);

  Promise.resolve(1).then(function resolve() {
    console.log('Resolved1!');

    Promise.resolve(2).then(function resolve() {
      console.log('Resolved2!');
    });
  });

  console.info('static code');
}

doTasks();
```

<details>
<summary><strong>Answer</strong></summary>

```
static code
Resolved1!
Resolved2!
Timed out!
```

</details>

## Why — step by step

1. `doTasks()` is called. The call stack enters the function.
2. `setTimeout(..., 0)` — registered with the browser's timer API. The `timeout` callback is added to the **macrotask queue** once the timer fires (≥0ms).
3. `Promise.resolve(1).then(resolve)` — `resolve` is added to the **microtask queue**.
4. `console.info('static code')` — runs immediately. **Output: `static code`**.
5. `doTasks()` returns. Call stack is empty.
6. Engine drains the microtask queue:
   - `resolve` runs → **Output: `Resolved1!`**
   - Inside it, `Promise.resolve(2).then(resolve)` queues another microtask.
   - Engine keeps draining → nested `resolve` runs → **Output: `Resolved2!`**
7. Microtask queue empty. Engine picks next macrotask:
   - `timeout` runs → **Output: `Timed out!`**

## The key rule

> After the call stack empties, drain **all** microtasks — including ones added while draining — before picking the next macrotask.

## Variation — harder version

```js
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve()
  .then(() => {
    console.log('3');
    setTimeout(() => console.log('4'), 0);
  })
  .then(() => console.log('5'));

console.log('6');
```

<details>
<summary><strong>Answer</strong></summary>

```
1
6
3
5
4
2
```

**Why `5` before `4`?** When the first `.then` runs (prints `3`), it queues `setTimeout 4` as a macrotask and the chained `.then` (prints `5`) as a microtask. Microtasks drain before macrotasks, so `5` runs next. Only after all microtasks does the engine pick macrotasks: `2` was queued before `4`, so `2` would run first… but wait — `2` was queued before `4`, so `2` runs before `4`.

Wait: `2` was queued first (before any `.then` ran), so the macrotask order is `2 → 4`. But `5` (a microtask) runs before both.

Final: `1 → 6 → 3 → 5 → 4 → 2`… actually let's re-trace:
- Sync: `1`, `6`
- Microtask: prints `3`, queues `setTimeout 4`
- Microtask chain: prints `5`
- Macrotasks in order queued: `2` (first), then `4`

**Correct output: `1 → 6 → 3 → 5 → 2 → 4`**

</details>
