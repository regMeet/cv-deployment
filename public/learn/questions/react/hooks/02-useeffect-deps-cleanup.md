# `useEffect` — dependencies & cleanup

> The single biggest source of subtle bugs in React. Get the deps right, return a cleanup function, and you'll avoid 90% of effect bugs.

## Mental model

> An effect is a way to **synchronize** something external (DOM, timer, subscription, fetch) with React state. It runs **after** render, with the values from that render.

## Dependency array — what to put

**Every value from the component scope** the effect uses. Props, state, derived values, functions defined in the component.

```jsx
useEffect(() => {
  socket.subscribe(channel, handleMsg);
  return () => socket.unsubscribe(channel, handleMsg);
}, [channel, handleMsg]); // ← anything used inside
```

`react-hooks/exhaustive-deps` lints this for you. **Trust the linter**; manually shortening the array causes stale-closure bugs.

## Cleanup — when it runs

The cleanup function runs:

1. Before the next time the effect runs (deps changed).
2. When the component unmounts.

So a typical effect lifecycle is: `setup → cleanup → setup → cleanup → ...`.

## Always clean up

- Subscriptions, sockets.
- Timers (`clearInterval` / `clearTimeout`).
- Event listeners.
- Aborting fetch (`AbortController`).

```jsx
useEffect(() => {
  const ctrl = new AbortController();
  fetch(url, { signal: ctrl.signal }).then(/*...*/);
  return () => ctrl.abort();
}, [url]);
```

## StrictMode double-fire (dev only)

In React 18+ dev mode, effects run **twice** to surface missing cleanups. Production runs them once. If your effect breaks under double-mount, your cleanup is incomplete.

## When NOT to use an effect

- Computing derived state — do it during render.
- Reacting to a prop change to set state — derive instead, or use `key` to reset.
- Event handlers — put logic in the handler, not in an effect that watches state.

> Rule: if the effect is "synchronizing with something external", keep it. Otherwise, delete it.

## Interview line

> "I include every reactive value the effect uses in the deps and trust the linter. Cleanup is part of the contract — anything I subscribe to, time, or fetch must be undone. And a lot of effects shouldn't exist at all: derived state belongs in render, not in an effect that mirrors a prop into state."
