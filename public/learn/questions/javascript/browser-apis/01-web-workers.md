# Web Workers — offloading CPU work

> JavaScript is single-threaded. Web Workers give you real threads for CPU-heavy tasks without blocking the UI.

## The problem

Long-running synchronous code blocks the main thread — no user interactions, no repaints, janky UI.

```js
// This freezes the browser for seconds:
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2); // O(2^n)
}
fibonacci(45); // ~8 seconds — main thread frozen
```

## The solution: Web Worker

A Worker runs in a separate thread. It communicates with the main thread via `postMessage` / `onmessage` — no shared memory (except `SharedArrayBuffer`).

```js
// main.js
const worker = new Worker('worker.js');

worker.postMessage({ n: 45 });

worker.onmessage = (e) => {
  console.log('Result:', e.data); // UI stays responsive while waiting
};

worker.onerror = (err) => console.error(err);
```

```js
// worker.js
self.onmessage = (e) => {
  const result = fibonacci(e.data.n);
  self.postMessage(result);
};

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

## What Workers can and can't do

| Can do | Can't do |
|---|---|
| `fetch`, `XMLHttpRequest` | Access the DOM |
| `setTimeout`, `setInterval` | Access `window` or `document` |
| `IndexedDB`, `Cache API` | Use `localStorage` (use `IndexedDB`) |
| Import scripts | Share memory by default |
| `WebSockets` | |

## Transferable objects — zero-copy messaging

By default, data is **structured-cloned** (copied). For large buffers, transfer ownership instead:

```js
const buffer = new ArrayBuffer(1024 * 1024); // 1 MB
worker.postMessage(buffer, [buffer]); // transferred, not copied
// `buffer` is now detached (unusable) in the main thread
```

## Terminate a worker

```js
worker.terminate(); // immediately stops the worker
```

From inside: `self.close()`.

## Inline workers (no separate file)

```js
const blob = new Blob([`
  self.onmessage = (e) => self.postMessage(e.data * 2);
`], { type: 'application/javascript' });

const worker = new Worker(URL.createObjectURL(blob));
```

## Senior follow-ups

- **"When would you use a Worker over chunking with setTimeout?"** Workers run in true parallel. `setTimeout`-based chunking still runs on the main thread and can still cause jank. Use Workers for genuinely CPU-bound work.
- **"What's SharedArrayBuffer?"** Allows shared memory between threads. Requires cross-origin isolation headers (`COOP`/`COEP`) due to Spectre mitigations.
- **"What's the difference between Web Workers, Service Workers, and Worklets?"** Web Workers: generic compute threads. Service Workers: network proxy / offline cache, persists between page loads. Worklets (AudioWorklet, PaintWorklet): lightweight threads for specific browser pipeline stages.
