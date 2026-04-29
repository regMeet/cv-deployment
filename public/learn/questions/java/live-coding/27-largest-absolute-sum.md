# Subarray with largest absolute sum

> Array of mixed integers. Find the contiguous subarray maximizing `|sum|`. Example: `[1, 2, -5, 4, 5, -1, 2, -11]` → `|-11| = 11`. **Run Kadane twice — once for max, once for min — return the larger absolute value.**

## Clarifying questions

- Empty subarray allowed (sum = 0)?
- Need indices, or just the value?
- Tie between positive and negative max abs values — preference?

## Solution — Kadane for both extremes

```java
public int maxAbsSubarraySum(int[] a) {
    int maxSum = a[0], maxCur = a[0];
    int minSum = a[0], minCur = a[0];
    for (int i = 1; i < a.length; i++) {
        maxCur = Math.max(a[i], maxCur + a[i]);
        maxSum = Math.max(maxSum, maxCur);
        minCur = Math.min(a[i], minCur + a[i]);
        minSum = Math.min(minSum, minCur);
    }
    return Math.max(Math.abs(maxSum), Math.abs(minSum));
}
```

Two Kadanes in lockstep — `maxSum` is the largest possible positive (or least-negative) sum, `minSum` is the most negative. The largest absolute value is one of these two.

## Why two passes (or interleaved one), not one

`|sum|` isn't a monotonic-friendly objective — Kadane's "extend or restart" reasoning depends on monotonic preference (always larger). Splitting into "find max" and "find min" recovers two monotonic problems, each solvable by Kadane. Take the absolute winner of those two.

## Edge cases

- Single element → return `|a[0]|`.
- All same sign → only one of the two passes finds anything interesting; the other returns the smallest-magnitude single element.
- All zeros → return 0.

## Follow-ups

- **Largest absolute sum subsequence** (not subarray) — different problem; sum of all positives or all negatives, take larger absolute.
- **Smallest absolute sum subarray** — closest-to-zero subarray; prefix sums sorted, look for the smallest difference between consecutive prefixes.
