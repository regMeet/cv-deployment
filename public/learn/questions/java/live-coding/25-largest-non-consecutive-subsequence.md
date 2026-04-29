# Maximum sum subsequence with no two adjacent elements

> Pick a subsequence (not subarray) such that no two chosen elements are adjacent in the original array, and the sum is maximized. **DP in O(n) time, O(1) space.** Same as "House Robber" (LeetCode 198).

## Clarifying questions

- All positive, all negative, or mixed?
- Empty subsequence allowed (return 0 if all elements negative)?
- Subsequence vs subarray — confirm we can skip arbitrary elements as long as we never pick two adjacent.

## DP — pick or skip

For each index `i`, the best sum considering `a[0..i]` is:

```
dp[i] = max(dp[i-1],            // skip a[i]
            dp[i-2] + a[i])     // take a[i], must skip a[i-1]
```

Only the last two values matter → O(1) space.

```java
public int maxNonAdjacentSum(int[] a) {
    if (a == null || a.length == 0) return 0;
    int prev2 = 0, prev1 = Math.max(0, a[0]);
    for (int i = 1; i < a.length; i++) {
        int take = prev2 + a[i];
        int skip = prev1;
        int cur  = Math.max(skip, take);
        prev2    = prev1;
        prev1    = cur;
    }
    return prev1;
}
```

The `Math.max(0, a[0])` initial value handles empty-subsequence-allowed semantics. Drop the max if you must pick at least one element.

## Why this works

A subsequence with no two adjacent splits naturally at index `i`: either `i` is in the subsequence (then `i-1` isn't, and the rest is the best from `0..i-2`), or `i` is not (and the rest is the best from `0..i-1`). Two cases, easy max. No overlap → no over-counting.

## What "subsequence" doesn't mean here

Some interviewers conflate subsequence and subarray. **Confirm out loud**: subsequence = pick any subset preserving order; subarray = contiguous window. This problem is the former.

## Edge cases

- All negative + empty allowed → return 0.
- All negative + must pick one → return max single element (drop the `Math.max(0, ...)` at init).
- Length 1 → return `max(0, a[0])` or `a[0]`.
- Length 2 → return `max(a[0], a[1])`.

## Follow-ups

- **Circular array** (House Robber II) — first and last are adjacent. Solve twice: include first / exclude first.
- **No 3 consecutive** — different recurrence (see separate problem).
- **K-consecutive forbidden** — generalize: `dp[i] = max(dp[i-1], dp[i-K] + a[i])` (with care).
