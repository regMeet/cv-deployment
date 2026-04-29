# Local vs derived state — colocate & compute

> Two principles that prevent most state-management headaches: **colocate** state, and **derive** what you can.

## Colocation

Keep state **as close as possible** to where it's used. Lifting state up has a cost — every consumer between the source and the target re-renders.

> Lift only as high as needed for the components that need to **share** it. No higher.

## Derivation — don't store what you can compute

Bad — duplicating state into derived state:

```jsx
const [items, setItems] = useState(initial);
const [count, setCount] = useState(initial.length);  // 💥 redundant

// now you have to keep them in sync, and you'll forget
```

Good — derive in render:

```jsx
const [items, setItems] = useState(initial);
const count = items.length;
```

If `count` is expensive (rarely is), wrap in `useMemo`. Otherwise just compute.

## Don't mirror props into state

```jsx
function Foo({ user }) {
  const [u, setU] = useState(user);  // 💥 stale when prop changes
}
```

Either use the prop directly, or — if you really need to "reset" internal state when a prop changes — use the **`key` reset pattern**:

```jsx
<Foo key={user.id} user={user} />
```

A new key = new instance = fresh state. No effect needed.

## Senior heuristic

For each piece of state, ask:

1. Can I **compute** this from props or other state? → Don't store it.
2. Is it **shared** between components? → Lift just to their nearest common parent.
3. Does it match a prop? → Probably shouldn't be state.
4. Does it update with another piece of state? → Use one source, derive the other.

## Interview line

> "I default to local state, derive everything I can, and only lift state when multiple components actually need to share it. Most state-management complexity I've seen came from storing things that should have been derived."
