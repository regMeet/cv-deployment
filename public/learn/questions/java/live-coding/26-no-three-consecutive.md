# Maximum sum with no three consecutive elements

> Positive integers. Pick a subset (subarray-aligned, contiguous-aware) maximizing sum such that no three consecutive elements of the original are all picked together. Example: `[3000, 2000, 1000, 3, 10]` → 5013 (pick 3000, 2000, 3, 10; can't include all three of 3000-2000-1000).

## Clarifying questions

- "No three consecutive" — none of the three? Or at most two of any three?
- Positive integers only, or mixed?
- Empty subset OK?

## DP — keep, skip, double-skip

For each index `i`, decide based on whether we pick `a[i]` and how many of the immediate predecessors are picked:

```
dp[i] = max(
    dp[i-1],                  // skip a[i]
    dp[i-2] + a[i],           // take a[i], skip a[i-1]
    dp[i-3] + a[i-1] + a[i]   // take a[i] and a[i-1], skip a[i-2]
)
```

The third branch ensures we never include three in a row.

```java
public int maxNoThreeConsecutive(int[] a) {
    int n = a.length;
    if (n == 0) return 0;
    if (n == 1) return Math.max(0, a[0]);
    if (n == 2) return Math.max(0, a[0] + a[1]);
    int[] dp = new int[n];
    dp[0] = a[0];
    dp[1] = a[0] + a[1];
    dp[2] = Math.max(Math.max(a[1] + a[2], a[0] + a[2]), a[0] + a[1]);
    for (int i = 3; i < n; i++) {
        dp[i] = Math.max(dp[i - 1],
                Math.max(dp[i - 2] + a[i],
                         dp[i - 3] + a[i - 1] + a[i]));
    }
    return dp[n - 1];
}
```

Can be reduced to O(1) space by keeping only the last three `dp` values.

## Why three branches (and not two)

Unlike "no two adjacent" where we just decide to take or skip, here taking `a[i]` doesn't fully constrain `a[i-1]` — we might be allowed to take it too, as long as we didn't take `a[i-2]`. The branching captures all three permissible "tail patterns" of the picked set: ending in skip, single take, or double take.

## Edge cases

- N < 3 → take everything; no three-consecutive constraint can be violated.
- All zero → return 0.
- Negative values + empty subset allowed → cap with `Math.max(0, ...)`.

## Follow-ups

- **No K consecutive** generalization — branches become K, recurrence has K terms.
- **Reconstruct the chosen indices** — backtrack from `dp[n-1]` checking which branch was active.
