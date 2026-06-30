# Implement Promise.all from scratch

> Tests deep understanding of Promises. One of the most common "implement this" exercises for senior roles.

## Problem

Implement `promiseAll(promises)` with the same semantics as `Promise.all`:
- Resolves with an array of results when **all** Promises fulfill.
- Rejects immediately if **any** Promise rejects.
- Preserves the order of results, regardless of resolution order.

```js
promiseAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3),
]).then(console.log); // [1, 2, 3]

promiseAll([
  Promise.resolve(1),
  Promise.reject(new Error('oops')),
  Promise.resolve(3),
]).catch(console.error); // Error: oops
```

## Solution

```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      resolve([]);
      return;
    }

    const results = new Array(promises.length);
    let remaining = promises.length;

    promises.forEach((p, i) => {
      Promise.resolve(p) // wrap non-Promise values
        .then((value) => {
          results[i] = value;
          remaining--;
          if (remaining === 0) resolve(results);
        })
        .catch(reject); // first rejection wins
    });
  });
}
```

**Key design decisions:**
- `results[i] = value` preserves order — index assignment, not push.
- `Promise.resolve(p)` handles non-Promise values (they resolve synchronously).
- After the first `reject`, any subsequent resolves or rejects are silently ignored (Promise is already settled).
- Empty array resolves synchronously to `[]`.

## Testing the edge cases

```js
// Non-Promise values
promiseAll([1, 2, 3]).then(console.log); // [1, 2, 3]

// Empty array
promiseAll([]).then(console.log); // []

// Order preserved even if later resolves first
promiseAll([
  new Promise(r => setTimeout(() => r('slow'), 100)),
  Promise.resolve('fast'),
]).then(console.log); // ['slow', 'fast'] — order matches input
```

## Implement promiseAllSettled as a bonus

```js
function promiseAllSettled(promises) {
  return promiseAll(
    promises.map(p =>
      Promise.resolve(p)
        .then(value  => ({ status: 'fulfilled', value }))
        .catch(reason => ({ status: 'rejected',  reason }))
    )
  );
}
```

## Senior follow-ups

- **"Why `Promise.resolve(p)` instead of just `p.then`?"** The input might not be a Promise (could be a plain value). `Promise.resolve` normalizes it. Calling `.then` on a non-Promise would throw.
- **"What happens if `promises` is not an array but an iterable?"** Native `Promise.all` accepts any iterable. Our implementation assumes an array — to match the spec, spread with `[...promises]` first.
- **"What if the same Promise appears twice in the array?"** It's fine — `.then` can be called multiple times on a settled Promise; the handler fires for each subscription.
