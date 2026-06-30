# Implement debounce

> Debounce delays a function call until after a quiet period. Useful for search inputs, window resize handlers, form validation.

## Problem

Implement `debounce(fn, delay)` that returns a new function. When the returned function is called, it waits `delay` ms. If called again before the delay expires, it resets the timer. Only fires `fn` once the caller stops calling for `delay` ms.

```js
const debouncedSearch = debounce(search, 300);

input.addEventListener('input', () => debouncedSearch(input.value));
// search() fires only 300ms after the user stops typing
```

## Solution

```js
function debounce(fn, delay) {
  let timer = null;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

**Key points:**
- `timer` lives in the closure — shared across all calls to the returned function.
- `clearTimeout` on every call resets the countdown.
- `fn.apply(this, args)` preserves the call context and arguments.

## With leading edge (fires immediately, then ignores calls during cooldown)

```js
function debounce(fn, delay, { leading = false } = {}) {
  let timer = null;

  return function (...args) {
    const callNow = leading && timer === null;

    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (!leading) fn.apply(this, args);
    }, delay);

    if (callNow) fn.apply(this, args);
  };
}
```

## With cancel

```js
function debounce(fn, delay) {
  let timer = null;

  function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  }

  debounced.cancel = () => clearTimeout(timer);

  return debounced;
}
```

## Senior follow-ups

- **"What's the difference between debounce and throttle?"** Debounce fires once after a quiet period. Throttle fires at most once per interval regardless of how many times it's called.
- **"When would you use leading-edge debounce?"** Button clicks that shouldn't fire multiple times but should feel immediate. The first click fires instantly; subsequent rapid clicks are ignored until quiet.
- **"How do you debounce an async function?"** Same implementation — but be careful with race conditions if the debounced function fires network requests. The last call wins, but earlier responses may arrive after later ones.
