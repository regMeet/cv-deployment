# Redux vs Zustand / Jotai / Recoil

> Redux is still the standard for big apps. Zustand and Jotai are simpler for most cases. Recoil is mostly historical now.

## Redux (with Toolkit)

```js
// slice
const userSlice = createSlice({
  name: 'user',
  initialState: { value: null },
  reducers: {
    setUser: (state, action) => { state.value = action.payload; }
  }
});

// in component
const user = useSelector(s => s.user.value);
const dispatch = useDispatch();
```

**Strengths**

- Mature, battle-tested.
- Excellent **devtools** (time travel, action history).
- **Middleware** ecosystem (logging, async, persistence).
- Strong patterns at large scale; predictable.

**Costs**

- Boilerplate (RTK helps a lot but still more than Zustand).
- Indirect mental model — actions, reducers, selectors.

## Zustand

```js
const useStore = create((set) => ({
  count: 0,
  inc: () => set(s => ({ count: s.count + 1 })),
}));

// in component
const count = useStore(s => s.count);
```

**Strengths**

- Tiny API. Selectors give you slice subscription out of the box.
- No `Provider` required.
- Plays nicely with React Suspense / concurrent.

**Costs**

- Less ecosystem than Redux. Fewer patterns codified.

## Jotai

```js
const countAtom = atom(0);

const [count, setCount] = useAtom(countAtom);
```

**Strengths**

- **Atomic** — each piece of state is its own atom; only components using a given atom re-render.
- Composable atoms (derived state via formulas).

**Costs**

- Different mental model (atoms instead of a single store).
- Less common; smaller community.

## Recoil

Made by Meta. Atomic model similar to Jotai. Largely **stalled** — Meta paused active development. **Not recommended for new projects** in 2025.

## Decision rule

| Need | Pick |
|---|---|
| Big app, devtools, middleware ecosystem | Redux Toolkit |
| Default for new apps, small footprint | Zustand |
| Atomic model, derived state with formulas | Jotai |
| Server state (caching, refetch, mutations) | **React Query / SWR** (separate problem) |

## Important — server state vs UI state

A lot of "state management complexity" disappears when you realize:

- **Server state** (data from APIs) → **React Query / SWR / RTK Query** (caching, dedup, refetch).
- **UI state** (open modal, selected tab, form draft) → Zustand / Redux / local state.

Don't put server data in Redux unless you have a real reason. RTK Query / React Query handle it better.

## Interview line

> "I default to local state and React Query for server data. For shared UI state I lean Zustand for new apps; Redux Toolkit when I need devtools, middleware, or it's already in the codebase. Most 'Redux apps' I've seen would have been simpler with React Query for server state and a small Zustand store for the rest."
