# Star rating component

> Tests **controlled vs uncontrolled**, hover-vs-click state, and basic a11y for a non-native control.

## Problem

Build a 5-star rating component. Click sets the rating, hover previews. Support read-only mode. Accessible.

## Solution

```jsx
import { useState } from 'react';

export function StarRating({ value, defaultValue = 0, onChange, max = 5, readOnly = false }) {
  // controlled if `value` provided, uncontrolled otherwise
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;

  const [hover, setHover] = useState(0);
  const display = hover || current;

  function set(next) {
    if (readOnly) return;
    if (value === undefined) setInternal(next);
    onChange?.(next);
  }

  return (
    <div
      role="radiogroup"
      aria-label="Rating"
      onMouseLeave={() => setHover(0)}
      style={{ display: 'inline-flex' }}
    >
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const filled = n <= display;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === current}
            aria-label={`${n} star${n === 1 ? '' : 's'}`}
            disabled={readOnly}
            onClick={() => set(n)}
            onMouseEnter={() => !readOnly && setHover(n)}
            onFocus={() => !readOnly && setHover(n)}
            onBlur={() => setHover(0)}
            style={{
              background: 'none', border: 'none', cursor: readOnly ? 'default' : 'pointer',
              fontSize: 24, color: filled ? 'gold' : '#ccc',
            }}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
```

## What this demonstrates

- **Controlled or uncontrolled.** Pass `value` for controlled (parent owns), or `defaultValue` for uncontrolled (component owns). Same pattern as `<input>`.
- **Two state slots: `current` + `hover`.** Hover never overwrites the chosen value — it only changes display.
- **`role="radiogroup"` + `role="radio"`** so screen readers announce it as a rating, not "five buttons".
- **Keyboard works for free** because each star is a `<button>` — Tab + Enter/Space.

## Common mistakes

- Storing the hover value in the same state as the chosen rating → leaving the cursor "saves" a wrong rating.
- Using `<div onClick>` instead of `<button>` — kills keyboard access.
- Ignoring `readOnly`. Display-only ratings still need to *render* the value but should not appear interactive.

## Follow-ups

- **"Half stars."** Track value as a float; render two clickable halves per star.
- **"Custom icons."** Make the star renderer a prop (`renderIcon={(filled) => …}`).
