# async/await — pitfalls and error handling

> `async/await` is syntactic sugar over Promises. Understanding what it desugars to explains all the pitfalls.

## Basics

```js
async function getUser(id) {
  const res = await fetch(`/api/users/${id}`);
  const data = await res.json();
  return data; // implicitly wraps in Promise.resolve()
}
```

An `async` function always returns a Promise. `await` suspends the function and resumes it as a microtask when the awaited Promise settles.

## Error handling

Use `try/catch` instead of `.catch`:

```js
async function getUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed:', err);
    throw err; // re-throw if the caller should know
  }
}
```

**Don't forget to re-throw** if the caller needs to know the operation failed.

## Pitfall 1 — sequential when parallel would do

```js
// BAD — each awaits the previous; total time = A + B + C
const a = await fetchA();
const b = await fetchB();
const c = await fetchC();

// GOOD — all three start at once; total time = max(A, B, C)
const [a, b, c] = await Promise.all([fetchA(), fetchB(), fetchC()]);
```

If the calls are **independent**, always prefer `Promise.all`.

## Pitfall 2 — await inside forEach

```js
// BUG — forEach doesn't wait for async callbacks
ids.forEach(async (id) => {
  await processId(id); // fires all at once, forEach returns before any complete
});

// CORRECT — sequential
for (const id of ids) {
  await processId(id);
}

// CORRECT — parallel
await Promise.all(ids.map(id => processId(id)));
```

## Pitfall 3 — unhandled rejection from async function

```js
async function danger() {
  throw new Error('boom');
}

danger(); // Promise rejects silently if not awaited or .catch'd
await danger(); // throws — can be caught
```

Always `await` or `.catch` the returned Promise.

## Pitfall 4 — returning a Promise vs awaiting it

```js
async function a() {
  return fetch('/api'); // Promise — fine, async unwraps it
}

async function b() {
  return await fetch('/api'); // also fine, but adds an extra microtask tick
}

// The difference matters in try/catch:
async function c() {
  try {
    return fetch('/api'); // rejection NOT caught — Promise returned before catch wraps it
  } catch (e) { /* never runs on fetch rejection */ }
}

async function d() {
  try {
    return await fetch('/api'); // rejection IS caught
  } catch (e) { /* runs */ }
}
```

## Senior follow-ups

- **"When would you choose `.then` chains over async/await?"** When composing higher-order functions (e.g., `Array.map` with Promises), or in environments where you want to avoid transpilation. `.then` chains are also easier to pipe through combinators.
- **"Does `await` block the thread?"** No — it suspends the current async function and yields control. Other code can run during the await.
- **"What happens to the error if you don't catch a rejected Promise?"** `unhandledrejection` event fires on `window` (or `uncaughtRejection` in Node). In some environments this terminates the process.
