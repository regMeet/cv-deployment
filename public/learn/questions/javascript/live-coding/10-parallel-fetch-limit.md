# Fetch N URLs with a concurrency limit

> Combines async/await, Promises, and queue management. A senior-level exercise that appears often.

## Problem

Given an array of URLs and a `limit`, fetch all URLs but never more than `limit` at a time. Return results in the same order as the input.

```js
const urls = ['/api/1', '/api/2', '/api/3', '/api/4', '/api/5'];
const results = await fetchWithLimit(urls, 2);
// At most 2 fetches in-flight at any moment
```

## Solution — pool with a queue

```js
async function fetchWithLimit(urls, limit) {
  const results = new Array(urls.length);
  const queue = [...urls.entries()]; // [[0, url], [1, url], ...]

  async function worker() {
    while (queue.length) {
      const [index, url] = queue.shift();
      results[index] = await fetch(url).then(r => r.json());
    }
  }

  // Start `limit` workers in parallel; each drains the queue
  const workers = Array.from({ length: Math.min(limit, urls.length) }, worker);
  await Promise.all(workers);

  return results;
}
```

**How it works:**
- `limit` worker coroutines run in parallel, each looping through the shared queue.
- When a worker finishes a fetch, it immediately picks the next URL.
- Results are stored at the correct index (same order as input).
- `queue.shift()` is synchronous — no race condition because JS is single-threaded between awaits.

## Solution — chunk-based (simpler, less efficient)

```js
async function fetchWithLimit(urls, limit) {
  const results = [];

  for (let i = 0; i < urls.length; i += limit) {
    const batch = urls.slice(i, i + limit);
    const batchResults = await Promise.all(batch.map(url => fetch(url).then(r => r.json())));
    results.push(...batchResults);
  }

  return results;
}
```

Simpler but less efficient: if one URL in a batch is slow, the whole batch waits. The pool solution starts the next URL as soon as any slot frees up.

## Comparison

```
Chunk:  [──── batch 1 ────][────── batch 2 ──────][── batch 3 ──]
                           ^ wait for slowest       ^ wait for slowest

Pool:   slot1: [─1─][─3─][─5─][─7─]
        slot2: [──2──][─4─][──6──]
               ^ always keeps slots busy
```

## Adding error handling

```js
async function worker() {
  while (queue.length) {
    const [index, url] = queue.shift();
    try {
      results[index] = await fetch(url).then(r => r.json());
    } catch (err) {
      results[index] = { error: err.message }; // or re-throw
    }
  }
}
```

## Senior follow-ups

- **"Why is `queue.shift()` safe from race conditions?"** JavaScript is single-threaded. The `shift()` runs synchronously between `await` points, so two workers can never `shift` the same item. After `await`, control returns and the next `.shift()` sees the updated queue.
- **"How would you add a retry policy per URL?"** Wrap each fetch in a `retry(fn, attempts)` helper that catches and re-calls up to N times with exponential backoff.
- **"What if you need the results in arrival order (not input order)?"** Use `push` instead of index assignment, and include the original index in the result so the caller can sort.
