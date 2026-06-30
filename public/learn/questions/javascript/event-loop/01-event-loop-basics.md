# How the event loop works

> JavaScript is single-threaded — one call stack, one thing at a time. The event loop is what lets it handle async work without blocking.

## The pieces

| Piece | What it is |
|---|---|
| **Call stack** | Where function calls live. LIFO. Synchronous. |
| **Web APIs** | Browser-provided features: `setTimeout`, `fetch`, DOM events. They run outside the stack. |
| **Task queue** (macrotask) | Callbacks queued by Web APIs once they finish. One per event loop turn. |
| **Microtask queue** | Higher-priority queue. Drained completely before the next macrotask. |
| **Event loop** | Picks a task from the task queue → runs it → drains microtasks → paints if needed → repeat. |

## The order in one rule

```
synchronous code → all microtasks → one macrotask → all microtasks → …
```

## Macrotasks vs Microtasks

| Macrotask | Microtask |
|---|---|
| `setTimeout` / `setInterval` | `Promise.then/catch/finally` |
| `setImmediate` (Node) | `queueMicrotask()` |
| I/O callbacks | `MutationObserver` |
| UI rendering tick | `async/await` continuations |

## Worked example

```js
console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve().then(() => console.log('C'));

console.log('D');
```

**Output: A → D → C → B**

1. `A` — synchronous, runs immediately.
2. `setTimeout` — registered with Web API; callback goes to task queue.
3. `Promise.then` — callback goes to microtask queue.
4. `D` — synchronous.
5. Call stack empty → drain microtasks → `C`.
6. Next event loop turn → pick macrotask → `B`.

## Why `setTimeout(fn, 0)` isn't "immediate"

The `0` means "at least 0ms", not "right now". The callback still has to wait for the current task and all microtasks to finish. Browsers enforce a minimum of ~4ms for nested timeouts.

## Senior follow-ups

- **"What's the difference between `queueMicrotask` and `Promise.resolve().then`?"** Functionally the same queue; `queueMicrotask` is the explicit API without creating a Promise.
- **"Can microtasks starve the render?"** Yes — an infinite microtask loop blocks the browser from ever painting.
- **"How does Node's event loop differ?"** Node has multiple phases (timers, I/O, idle, poll, check, close) via libuv. `setImmediate` fires in the check phase, after I/O.
