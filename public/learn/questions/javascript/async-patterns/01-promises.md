# Promises — creation, chaining, error handling

> A Promise represents a value that may be available now, later, or never. Understanding how it chains and fails is essential.

## States

```
pending → fulfilled (resolved with a value)
        → rejected  (rejected with a reason)
```

Once settled, a Promise never changes state.

## Creating a Promise

```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve('done'), 1000);
  // or: reject(new Error('failed'))
});
```

## Chaining — `.then` always returns a new Promise

```js
fetch('/api/user')
  .then(res => res.json())      // transforms the value
  .then(user => user.name)      // transforms again
  .then(name => console.log(name))
  .catch(err => console.error(err)); // catches any error above
```

Each `.then` handler:
- Returns a value → next `.then` receives it
- Returns a Promise → next `.then` waits for it
- Throws → nearest `.catch` receives the error

## `.catch` is `.then(null, handler)`

```js
p.catch(err => handle(err));
// equivalent to:
p.then(null, err => handle(err));
```

Prefer `.catch` at the end of chains. Putting a rejection handler in `.then(onFulfilled, onRejected)` won't catch errors thrown by `onFulfilled`.

## `.finally`

Runs regardless of outcome. Doesn't receive the value/error; just passes it through.

```js
showSpinner();
fetch('/api/data')
  .then(process)
  .catch(handleError)
  .finally(() => hideSpinner()); // always runs
```

## Error propagation

An error skips all `.then` handlers until it finds a `.catch`:

```js
Promise.resolve('start')
  .then(() => { throw new Error('boom'); })
  .then(() => console.log('never runs'))
  .catch(err => console.log('caught:', err.message)); // 'caught: boom'
```

## Common mistake — returning inside a handler

```js
// BUG — result of fetch is lost, chain resolves with undefined
.then(id => {
  fetch(`/api/${id}`); // forgot to return
})

// CORRECT
.then(id => fetch(`/api/${id}`))
```

## Senior follow-ups

- **"What's the difference between `reject(new Error(...))` and `throw` inside the executor?"** Both lead to a rejected Promise, but `throw` only works synchronously inside the executor. An async `throw` inside `setTimeout` inside the executor will NOT reject the Promise.
- **"Can you cancel a Promise?"** No — Promises are not cancellable by spec. Use `AbortController` + `fetch` signal, or track a `cancelled` flag in your closure.
- **"What's Promise.resolve(thenable)?"** If you pass an object with a `.then` method, `Promise.resolve` will treat it as a Promise and adopt its state. This is how libraries interoperate.
