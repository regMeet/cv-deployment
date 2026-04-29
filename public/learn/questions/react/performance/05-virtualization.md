# List virtualization (`react-window` / `@tanstack/react-virtual`)

> Don't render 10,000 rows when only ~30 are visible. Render only what fits in the viewport (plus a small overscan).

## The problem

A naive list:

```jsx
<ul>
  {items.map(item => <Row key={item.id} {...item} />)}
</ul>
```

With 10K items: 10K DOM nodes, 10K React fiber nodes, slow scroll, painful re-renders.

## Virtualization

Only the items currently visible (plus a small overscan buffer) are mounted. As the user scrolls, items unmount/mount on the fly.

```jsx
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  width="100%"
  itemCount={items.length}
  itemSize={48}
>
  {({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  )}
</FixedSizeList>
```

## When you need it

- Lists > ~500 items.
- Tables / grids with many rows.
- Long scrollable feeds.

## Libraries

- **`react-window`** — small, fast, fixed-size lists are easy.
- **`@tanstack/react-virtual`** — modern, headless, supports variable item sizes well.
- **`react-virtuoso`** — full-featured, supports dynamic heights and "stick to bottom" semantics.

## Variable-height rows

Tricky: you don't know the height until you render. Strategies:

- **Estimate** an initial height; library adjusts as it measures.
- **Cache** measured heights so scrollback doesn't jump.
- **`@tanstack/react-virtual`** and `react-virtuoso` handle this best.

## Pitfalls

- **Position: absolute** items inside the list — anchored to the viewport, not the row → broken on scroll.
- **`autofocus` on a row** — row may be unmounted; focus is lost.
- **CSS hover effects** on row count — unaffected, but **scroll-linked animations** can be janky if the library re-renders heavy components.

## Senior framing

> "I virtualize once a list crosses ~500 items or shows scroll jank. `react-window` for fixed sizes, `@tanstack/react-virtual` for variable heights. The trickiest part is variable-row heights — you need height caching to avoid jumpiness on scrollback."
