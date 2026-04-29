# Majority element — Boyer-Moore voting

> Element appearing **more than n/2 times** in an array. **O(n) time, O(1) space** with Boyer-Moore. The classic test of "do you know the trick" — sorting (O(n log n)) and HashMap (O(n) space) are baselines to beat.

## Clarifying questions

- Is a majority guaranteed to exist? (If not, you need a verification pass.)
- Strictly more than n/2, or at-least n/2?
- Multiple candidates possible? (>n/2 ⇒ at most one; >n/3 ⇒ at most two — different problem.)

## Boyer-Moore voting algorithm

```java
public int majority(int[] a) {
    int candidate = 0, count = 0;
    for (int v : a) {
        if (count == 0)         { candidate = v; count = 1; }
        else if (v == candidate) count++;
        else                     count--;
    }
    // verification — required if majority isn't guaranteed
    count = 0;
    for (int v : a) if (v == candidate) count++;
    return count > a.length / 2 ? candidate : -1;
}
```

## The intuition

Pair each majority element with a non-majority. Since majority count > n/2, you'll always have leftovers — those are the majority. The voting loop simulates this pairing by canceling out unequal neighbours.

`candidate` and `count` form a "current leader" tracker; every time `count` hits 0, we discard the past and start fresh. Crucially, the true majority survives all such resets.

## Why this is famous

It's the canonical example of a **streaming algorithm** — single pass, O(1) state. Pre-Boyer-Moore, this was assumed to require sorting or hashing. Mention this in interviews to show context.

## Edge cases

- No majority — verification pass returns -1 (or throws, per spec).
- All elements identical → `candidate` is correct from line 1.
- Single element → trivially majority.
- Tie (exactly n/2) → not a majority; verification rejects.

## Follow-ups

- **Find all elements appearing > n/3 times** (LeetCode 229) — at most two candidates, generalized Boyer-Moore with two trackers.
- **General "more than n/k"** — k-1 trackers; same logic.
- **Distributed majority** — combine partial Boyer-Moore states by merging the two `(candidate, count)` pairs from each shard.
