# How does React actually work? (VDOM, reconciliation, Fiber)

> React keeps a **virtual** tree, diffs the next version against the current one, and applies the **minimal set of DOM mutations**.

## The flow

1. Your component returns **React elements** (objects describing the UI).
2. React builds a **virtual DOM tree** from those elements.
3. On state/props change, React produces a **new tree**.
4. **Reconciliation** diffs new vs current tree → list of changes.
5. The **renderer** (react-dom, react-native) commits those changes to the host.

## Fiber (React 16+)

Fiber is the data structure + scheduler that powers reconciliation. It splits work into units that can be **paused, resumed, and prioritized**.

That's what makes **concurrent features** possible (transitions, Suspense, time-slicing).

Two phases:

- **Render phase** — pure, can be paused/aborted. Builds the new tree.
- **Commit phase** — synchronous. Applies changes to the DOM and runs effects.

## Why VDOM matters

- Direct DOM manipulation is expensive and imperative.
- VDOM lets you write **declarative** UI ("this is what it should look like") and lets React figure out the cheapest update.
- It's not "faster than DOM" — it's a **good enough** abstraction that's much easier to reason about.

## Reconciliation heuristics

- **Different element types** at the same position → tree is thrown away and rebuilt (full unmount + mount).
- **Same element type** → React updates props and recurses into children.
- **Lists with `key`** → React matches children by key, not by position. Wrong/missing keys = wrong updates.

## Interview line

> "React keeps a virtual representation of the UI, diffs the new version against the current, and commits only the necessary changes. Fiber is the scheduler that lets that work be interruptible — which is what enables concurrent rendering and transitions."
