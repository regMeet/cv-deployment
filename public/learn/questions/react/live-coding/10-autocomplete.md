# Autocomplete (async + keyboard nav)

> The "boss fight" of React live coding. Combines debounce, race conditions, keyboard a11y, and ARIA.

## Problem

Build an autocomplete:
- Debounced fetch as the user types
- Cancels in-flight requests on new input
- Arrow keys navigate, Enter selects, Esc clears
- Screen-reader announces results

## Solution

```jsx
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from './useDebounce'; // see that question

export function Autocomplete({ fetchOptions, onSelect }) {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(query, 250);
  const listId = 'ac-listbox';

  useEffect(() => {
    if (!debounced) { setOptions([]); return; }
    const ctrl = new AbortController();
    fetchOptions(debounced, ctrl.signal)
      .then((res) => { setOptions(res); setActive(-1); setOpen(true); })
      .catch((e) => { if (e.name !== 'AbortError') setOptions([]); });
    return () => ctrl.abort();
  }, [debounced, fetchOptions]);

  function onKeyDown(e) {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, options.length - 1)); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); choose(options[active]); }
    else if (e.key === 'Escape') { setOpen(false); }
  }

  function choose(opt) {
    onSelect?.(opt);
    setQuery(opt.label);
    setOpen(false);
  }

  return (
    <div role="combobox" aria-expanded={open} aria-haspopup="listbox" aria-owns={listId}>
      <input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onKeyDown={onKeyDown}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        aria-autocomplete="list"
        aria-controls={listId}
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
      />
      {open && options.length > 0 && (
        <ul id={listId} role="listbox">
          {options.map((opt, i) => (
            <li
              key={opt.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()} // keep focus on input
              onClick={() => choose(opt)}
              style={{ background: i === active ? '#eef' : 'transparent', cursor: 'pointer' }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## What earns senior signal

- **Debounce + AbortController** — the only sane way to fetch on keystrokes.
- **Cleanup aborts** — without this, the slow request from "ho" can resolve *after* "house" and overwrite the right results.
- **`onMouseDown={(e) => e.preventDefault()}`** on `<li>` — without it, clicking an option blurs the input *before* the click fires, and the dropdown closes via `onBlur` first. Very common bug.
- **ARIA combobox pattern** — `combobox` + `listbox` + `option` + `aria-activedescendant`. Don't move focus to the option; keep focus on input and announce the active descendant.

## Common mistakes

- Using `onClick` only — keyboard users can't navigate.
- Storing the active index by *option id* — fragile to reorders. Use array index.
- Forgetting to reset `active` when results change.

## Follow-ups

- **"Cache results by query."** Wrap with a `Map<query, options>` or use SWR / React Query.
- **"Highlight matched substring."** Render label as `<>{before}<mark>{match}</mark>{after}</>`.
- **"Multi-select with chips."** Track `selected: Option[]`. Render chips above the input.
