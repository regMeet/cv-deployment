# Key prop misuse (and using index)

> Wrong keys cause **visible bugs** — wrong DOM, lost focus, broken state — not just lint warnings.

## The most common mistake — index as key

```jsx
items.map((item, i) => <Row key={i} {...item} />)
```

If `items` ever **reorders, inserts at the front, or removes from the middle**, the index now points to a different item. React thinks `key={2}` is "the same row" → updates props on the wrong DOM node → preserves state for the wrong row.

### Why it's worse than it sounds

- **Form fields lose their value or focus** — input that the user was typing in suddenly shows different data.
- **Animations restart** for items that didn't actually change.
- **Component state gets attached to the wrong row** — a row's `useState` belongs to whichever row sits at that index next render, not to the item.

## The correct pattern

```jsx
items.map(item => <Row key={item.id} {...item} />)
```

Use the **stable identity from the data** — usually `id`. The key follows the item.

## When index is OK

- Append-only list, never reorders.
- Static list (e.g., a fixed nav menu).
- No state inside the row, no inputs.

> Only when **all three** are true.

## Random keys are the worst

```jsx
<Row key={Math.random()} />  // 💥 different key every render → unmount + remount every time
```

Every render, every row is treated as new. Loses state, loses DOM, loses everything. Avoid.

## Composite keys

If a list has no natural ID, compose one from immutable fields:

```jsx
key={`${item.userId}-${item.timestamp}`}
```

Better than index when you need uniqueness across remounts.

## React's `key` reset pattern (intentional)

You can **use the key change deliberately** to force a remount:

```jsx
<UserForm key={userId} userId={userId} />
```

When `userId` changes, React unmounts the old `UserForm` and mounts a new one — fresh state, fresh effects. Cleaner than syncing props into state with an effect.

## Senior framing

> "Wrong keys aren't a stylistic issue — they cause real bugs around focus, form state, and animations. I use stable IDs from the data; index is acceptable only on append-only static lists with no internal state. And I use the `key` change deliberately when I want to remount a subtree."
