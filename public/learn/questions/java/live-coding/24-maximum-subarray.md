# Maximum subarray sum (Kadane's algorithm)

> Array of integers (possibly negative). Find the contiguous subarray with the largest sum. **O(n) time, O(1) space.** Canonical algorithm; you must know it cold.

## Clarifying questions

- All-negative array — return the max single element, or 0 (empty subarray)?
- Need indices, or just the sum?
- Empty subarray allowed? (Most variants say no — at least one element.)

## Kadane's — running max ending at i

```java
public int maxSubarraySum(int[] a) {
    int best = a[0], cur = a[0];
    for (int i = 1; i < a.length; i++) {
        cur  = Math.max(a[i], cur + a[i]);   // extend or restart
        best = Math.max(best, cur);
    }
    return best;
}
```

`cur` = the maximum sum of any subarray that ends at index `i`. At each step, we either extend the previous max-ending-here, or start over from `a[i]`. `best` tracks the global max.

## Why "extend or restart" is the only choice

If `cur` is negative, dragging it forward only hurts the next sum. So as soon as `cur + a[i] < a[i]`, we restart at `a[i]`. This is equivalent to saying `cur = max(a[i], cur + a[i])`.

## Reporting the indices

```java
int bestStart = 0, bestEnd = 0, curStart = 0;
int cur = a[0], best = a[0];
for (int i = 1; i < a.length; i++) {
    if (cur + a[i] < a[i]) { cur = a[i]; curStart = i; }
    else                     cur += a[i];
    if (cur > best) { best = cur; bestStart = curStart; bestEnd = i; }
}
```

Same algorithm, plus tracking where each candidate started.

## Edge cases

- All-negative input → returns the largest single element (commonly desired).
- Single element → returns it.
- Empty input → throw or return 0 (clarify spec).

## Follow-ups

- **Maximum *circular* subarray** — answer is `max(kadane, totalSum − minSubarraySum)`. Edge: all negative.
- **Maximum sum with at most K elements** — sliding window or DP.
- **2D version (max sum submatrix)** — fix top/bottom rows, collapse to 1D, run Kadane. O(R²C).
