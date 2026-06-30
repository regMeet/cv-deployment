# Microtasks vs Macrotasks — Promise vs setTimeout

> This is the question behind every "what does this print?" exercise. Get the rule right and the rest is mechanical.

## The rule

After each macrotask (including the initial script), the engine drains the **entire** microtask queue before moving on. Microtasks can queue more microtasks — those also run before any macrotask.

```
run macrotask
  → drain ALL microtasks (including newly queued ones)
  → browser may render
  → pick next macrotask
  → repeat
```

## Quick reference

| What | Queue |
|---|---|
| `Promise.then / catch / finally` | Microtask |
| `async/await` (each `await` continuation) | Microtask |
| `queueMicrotask(fn)` | Microtask |
| `MutationObserver` callback | Microtask |
| `setTimeout` / `setInterval` | Macrotask |
| `setImmediate` (Node only) | Macrotask (check phase) |
| DOM event listener (click, etc.) | Macrotask |
| `requestAnimationFrame` | Before paint (between macrotasks) |

## Example with nested Promises

```js
setTimeout(() => console.log('timeout'), 0);

Promise.resolve()
  .then(() => {
    console.log('p1');
    Promise.resolve().then(() => console.log('p2-nested'));
  })
  .then(() => console.log('p1-chain'));
```

**Output: p1 → p2-nested → p1-chain → timeout**

Why `p2-nested` before `p1-chain`? When `p1` runs, it queues `p2-nested`. The microtask queue now has `[p2-nested, p1-chain]`. Both drain before `timeout`.

## async/await is syntactic sugar for Promises

```js
async function foo() {
  console.log('foo start');
  await Promise.resolve();
  console.log('foo after await'); // microtask continuation
}

console.log('before');
foo();
console.log('after');
```

**Output: before → foo start → after → foo after await**

`await` suspends `foo` and yields control back to the caller. The continuation (`foo after await`) is a microtask queued when the awaited Promise settles.

## Senior follow-ups

- **"Why does it matter for UX?"** Long microtask chains delay the next render frame. For CPU work, use `setTimeout` or a Web Worker to let the browser breathe.
- **"What happens if a microtask throws?"** Unhandled Promise rejections are reported (as `unhandledrejection` event), but other microtasks in the queue still run.
- **"Can you force a render between microtasks?"** No. Only `requestAnimationFrame` / `setTimeout` yield to the render step.
