# Promise.all / allSettled / race / any

> Pick the right combinator and you write less error-handling code and get the right behavior for free.

## `Promise.all(promises)`

Resolves when **all** settle fulfilled. Rejects immediately if **any** rejects (fail-fast).

```js
const [user, posts] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
]);
```

Use when: all results are required and a single failure should abort.

**Gotcha:** if one rejects, you get no results from the others — even if they succeeded.

## `Promise.allSettled(promises)`

Waits for **all** to settle (fulfilled or rejected). Never rejects itself.

```js
const results = await Promise.allSettled([fetchA(), fetchB(), fetchC()]);

for (const r of results) {
  if (r.status === 'fulfilled') use(r.value);
  else                          logError(r.reason);
}
```

Use when: you need all results regardless of individual failures (e.g., batch operations, dashboard widgets).

## `Promise.race(promises)`

Settles (fulfilled **or** rejected) as soon as the **first** Promise settles.

```js
const result = await Promise.race([
  fetch('/api/data'),
  new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000)),
]);
```

Use when: you want a timeout, or you have redundant sources and take whoever responds first.

**Gotcha:** the losing Promises still run to completion — `race` just ignores their results. Pair with `AbortController` to actually cancel them.

## `Promise.any(promises)`

Resolves as soon as the **first** one fulfills. Only rejects if **all** reject (throws `AggregateError`).

```js
const fastest = await Promise.any([
  fetchFromPrimary(),
  fetchFromReplica(),
  fetchFromCDN(),
]);
```

Use when: you have multiple sources and just need one success (hedged requests, fallback chains).

## Quick decision table

| Need | Use |
|---|---|
| All must succeed | `Promise.all` |
| All must run, collect every outcome | `Promise.allSettled` |
| First to settle wins (success or error) | `Promise.race` |
| First to succeed wins (ignore rejections) | `Promise.any` |

## Parallel fetch with a concurrency limit

`Promise.all` starts everything at once. For N=1000 requests that's a problem. Use a pool:

```js
async function* chunks(arr, size) {
  for (let i = 0; i < arr.length; i += size)
    yield arr.slice(i, i + size);
}

async function fetchWithLimit(urls, limit = 5) {
  const results = [];
  for await (const batch of chunks(urls, limit)) {
    const batch_results = await Promise.all(batch.map(fetch));
    results.push(...batch_results);
  }
  return results;
}
```

## Senior follow-ups

- **"What's the difference between `Promise.any` and `Promise.race`?"** `race` resolves on the first settlement (including rejection). `any` skips rejections and only resolves on the first fulfillment.
- **"How would you implement a retry with exponential backoff?"** Recursively catch and re-call with `await new Promise(r => setTimeout(r, delay))`, doubling `delay` each attempt.
- **"What's `AggregateError`?"** Thrown by `Promise.any` when all Promises reject. Contains an `errors` array with every rejection reason.
