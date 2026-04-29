# Min-Max Stack — push, pop, min, max all in O(1)

> Build a stack that supports `push`, `pop`, `min`, and `max` in O(1) time. The naive answer is O(n) for min/max — the senior answer keeps two auxiliary stacks of running extremes.

## Clarifying questions

- Will we ever pop an empty stack? Throw or return null?
- Memory budget? (Naive auxiliary stacks use up to 2× the data — there's a more compact variant.)
- Are duplicates allowed? Affects whether we push to aux on equal-to-current.

## Two auxiliary stacks — O(1) for everything

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class MinMaxStack {

    private final Deque<Integer> data = new ArrayDeque<>();
    private final Deque<Integer> mins = new ArrayDeque<>();
    private final Deque<Integer> maxs = new ArrayDeque<>();

    public void push(int v) {
        data.push(v);
        mins.push(mins.isEmpty() ? v : Math.min(v, mins.peek()));
        maxs.push(maxs.isEmpty() ? v : Math.max(v, maxs.peek()));
    }

    public int pop() {
        if (data.isEmpty()) throw new IllegalStateException("empty");
        mins.pop();
        maxs.pop();
        return data.pop();
    }

    public int min() { return mins.peek(); }
    public int max() { return maxs.peek(); }
}
```

`mins`/`maxs` track the **running minimum/maximum** as of each level of the stack. When you pop, popping all three keeps them in sync.

## Why duplicating the min on every push is fine

You might be tempted to push to `mins` only when the new value is smaller. That breaks pop:

> Push 3, 5, 5, 5. If you only pushed 3 to `mins`, then pop the top 5 → `mins.peek()` is still 3 (correct), but pop again → 3 again (correct), then pop → 3 (wrong, the real min is 3 but the stack should be {3} now). Actually for `min` it works; the bug shows up with `max` and equal values.

Pushing every level keeps the invariant trivially correct.

## Compact variant — single stack, store deltas

Instead of two extra stacks, store `value - currentMin` (a `long` to avoid overflow). On pop, if the delta is negative, the popped value WAS the min, and you recover the old min. Saves memory; harder to reason about.

```java
// sketch — interview-grade detail only if asked
public void push(int v) {
    if (data.isEmpty()) { min = v; data.push(0L); }
    else {
        data.push((long) v - min);
        if (v < min) min = v;
    }
}
```

Mention this variant if the interviewer asks "can you do better on memory?".

## Edge cases

- Pop on empty → throw `IllegalStateException` (or whatever the API spec says).
- Single element → all three stacks have one entry.
- Equal values → push every time; do NOT skip on equality.

## Follow-ups

- **Min-Max Queue** — harder; needs a deque-based monotonic structure.
- **Concurrent version** — `ReentrantLock` around all four ops, or an immutable persistent stack.
