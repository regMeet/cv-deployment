# Implement throttle

> Throttle ensures a function fires at most once per interval. Useful for scroll handlers, mouse move tracking, rate-limiting API calls.

## Problem

Implement `throttle(fn, interval)` that returns a function. No matter how many times the returned function is called, `fn` fires at most once every `interval` ms.

```js
const throttledScroll = throttle(onScroll, 100);
window.addEventListener('scroll', throttledScroll);
// onScroll fires at most 10 times per second, regardless of scroll speed
```

## Solution — timestamp approach

```js
function throttle(fn, interval) {
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}
```

Simple and deterministic. Fires on the **leading edge** — the first call always goes through.

## Solution — timer approach (trailing edge)

```js
function throttle(fn, interval) {
  let timer = null;

  return function (...args) {
    if (timer !== null) return;

    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, interval);
  };
}
```

Fires on the **trailing edge** — waits `interval` ms before the first call.

## Solution — leading + trailing (full implementation)

```js
function throttle(fn, interval) {
  let lastCall = 0;
  let timer = null;

  return function (...args) {
    const now = Date.now();
    const remaining = interval - (now - lastCall);

    if (remaining <= 0) {
      if (timer) { clearTimeout(timer); timer = null; }
      lastCall = now;
      fn.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastCall = Date.now();
        timer = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}
```

The trailing call ensures the final event in a burst is always processed.

## Debounce vs Throttle

| | Debounce | Throttle |
|---|---|---|
| Fires | Once after quiet period | At most once per interval |
| Best for | Search input, form validation | Scroll, resize, mouse move |
| Burst of 10 calls | 1 call (after last) | ~N/interval calls |

## Senior follow-ups

- **"Which approach would you use for an infinite scroll trigger?"** Trailing-edge throttle — you want to check position periodically as the user scrolls, and definitely check once they stop.
- **"How does `requestAnimationFrame` compare to throttle for animations?"** `rAF` fires before the next paint (~60fps), perfectly synchronized with the browser's render cycle. Throttle with a fixed ms is less precise and can drift.
- **"How would you cancel a pending throttle?"** Add a `.cancel()` method that calls `clearTimeout(timer)` and resets state, same as debounce.
