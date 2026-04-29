# Pair with given difference in a sorted array

> Sorted array `A`, integer `k`. Find two values `a, b ∈ A` with `a - b == k`. **O(n) time, O(1) space.** Two-pointer technique.

## Clarifying questions

- Indices or values? (Spec; clarify.)
- `k = 0` allowed? (If yes, decide whether `a == b` requires distinct indices.)
- Duplicates in the array — fine?
- Negative `k` allowed? (Trivial flip — just swap `a` and `b`. Often: assume `k ≥ 0`.)

## Solution — two pointers, fast and slow

```java
public int[] findPair(int[] a, int k) {
    if (a == null || a.length < 2) return new int[]{-1, -1};
    int i = 0, j = 1;                        // j strictly ahead of i
    while (j < a.length) {
        int diff = a[j] - a[i];
        if (diff == k && i != j) return new int[]{i, j};
        if (diff < k) j++;                   // need bigger gap
        else if (i == j) j++;                // keep j ahead
        else i++;                            // gap too big, shrink
    }
    return new int[]{-1, -1};
}
```

Both indices only ever advance → O(n).

## Why both pointers move forward (not converge)

Different from "pair with sum": for sum, sorted endpoints converge. For **difference** in a sorted array, both `a[i]` and `a[j]` need to grow together to maintain the gap, so both pointers move *rightward*. Common bug to write the converging version by reflex.

## Edge cases

- `k == 0` — if same-index pair allowed, every element matches; otherwise need consecutive duplicates.
- Length < 2 → no pair possible.
- All identical → only `k == 0` matches.
- Negative `k` → conceptually `b - a == |k|`, same algorithm with swapped output.

## Follow-ups

- **Count all such pairs** — same scan but don't break on match; advance carefully on duplicates.
- **Unsorted input** — `Set` of `a[i] - k` while scanning, O(n) time, O(n) space.
- **Pair with sum N** — converging two-pointer (different problem in the same family).
