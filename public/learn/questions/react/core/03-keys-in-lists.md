# Keys in lists — why they matter

> Keys tell React **which item is which** between renders. Wrong keys → wrong DOM, wrong state, broken animations.

## Without a key (or with bad keys)

React matches list items by **position**. If items reorder, insert at the front, or are filtered out, React updates the wrong nodes — fields lose focus, animations restart, child state gets attached to the wrong row.

## Bad — index as key

```jsx
items.map((item, i) => <Row key={i} {...item} />)
```

Stable only if the list is **never reordered, never inserted/deleted in the middle**. Otherwise the index points to a different item next render.

## Good — stable identity from the data

```jsx
items.map(item => <Row key={item.id} {...item} />)
```

`id` follows the item. React knows "this is the same row, just moved" and preserves DOM, focus, and child state.

## When index *is* OK

- The list is **append-only** and never reorders.
- The list is purely cosmetic (no internal state per row, no inputs to focus).

## Senior signals

- Mention **state preservation** — wrong keys break focus, controlled inputs, transitions.
- Mention **reconciliation** — keys are how React matches old vs new children.
- Don't generate keys in render (`Math.random()`) — every render is a new key, every row is unmounted and remounted, terrible.

## Interview line

> "Keys aren't just to silence the warning. They tell React which item is which between renders, so React preserves DOM nodes and component state for the items that didn't change. Index keys break the moment the list reorders or you insert in the middle."
