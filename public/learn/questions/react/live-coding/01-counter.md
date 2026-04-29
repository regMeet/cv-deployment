# Counter (useState basics)

> The classic warm-up. Cheap to do, but the follow-ups matter.

## Problem

Build a counter with **+ / − / Reset** buttons. Disable **−** at zero.

## Solution

```jsx
import { useState } from 'react';

export function Counter({ initial = 0, step = 1 }) {
  const [count, setCount] = useState(initial);

  return (
    <div className="counter">
      <button onClick={() => setCount((c) => c - step)} disabled={count <= 0}>−</button>
      <span aria-live="polite">{count}</span>
      <button onClick={() => setCount((c) => c + step)}>+</button>
      <button onClick={() => setCount(initial)}>Reset</button>
    </div>
  );
}
```

## Why the **functional updater** matters

`setCount(c => c + 1)` reads the latest queued value. `setCount(count + 1)` reads the value from the closure — fine here, but breaks if you call it twice in the same tick or inside an async callback.

```jsx
// BAD — both reads see the same `count`
setCount(count + 1);
setCount(count + 1);

// GOOD — second read sees the result of the first
setCount((c) => c + 1);
setCount((c) => c + 1);
```

## Senior follow-ups

- **"Add a max."** Clamp inside the updater: `setCount((c) => Math.min(c + step, max))`.
- **"Avoid re-renders if disabled."** No need — React already bails if state is `===`.
- **"Refactor to useReducer."** Useful when `+`/`−`/`reset` grow into ~5+ actions, or when actions need to be dispatched from far away.
