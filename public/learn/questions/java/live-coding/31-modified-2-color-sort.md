# Modified 2-color sort (0s in even positions, 1s in odd)

> Array of 0s and 1s. Place all 0s in even indices, all 1s in odd indices. If counts don't match, leave the excess untouched. **One pass, O(1) extra space, in-place.**

## Clarifying questions

- "Excess untouched" — keep them in original order? Push them to the end? (Different semantics.)
- 0-indexed or 1-indexed even/odd? (Standard: 0-indexed; index 0 is even.)
- Output order of the placed elements — preserved or arbitrary?

## Solution — two-pointer scan over even and odd positions

```java
public void colorSort(int[] a) {
    int n = a.length;
    int even = 0, odd = 1;
    while (even < n && odd < n) {
        if (a[even] == 0) { even += 2; continue; }   // already correct
        if (a[odd]  == 1) { odd  += 2; continue; }
        // a[even] == 1 and a[odd] == 0 → swap
        int t = a[even]; a[even] = a[odd]; a[odd] = t;
        even += 2;
        odd  += 2;
    }
}
```

Each pointer only moves forward; both make at most n/2 steps → O(n).

## Why this respects "excess untouched"

If 0s outnumber 1s, eventually `odd` walks off the end while `even` still has positions to fill. The remaining `even` slots will already contain 0s (since there are enough). Conversely if 1s outnumber 0s. The unswapped tail is the "excess" — it stays put in its original positions.

## What "untouched" really means

Read the spec carefully. The blog example shows the excess **stays in their original index positions**, not shoved to the end. The two-pointer-with-swap above achieves exactly this — only mismatched (even, odd) pairs swap.

## Edge cases

- All zeros → 0s already in even and odd positions; the algorithm makes no swaps but leaves odds with their original 0s.
- All ones → symmetric.
- Length 1 → no work to do.
- Length 0 → trivially done.

## Follow-ups

- **3-color sort** (Dutch National Flag) — three pointers, low/mid/high. Different problem family.
- **Stability requirement** — this algorithm is NOT stable; if stability matters, use a separate output pass.
