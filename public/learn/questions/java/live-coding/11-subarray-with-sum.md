# Subarray with given sum (continuous, non-negative inputs)

> Unsorted array of non-negative integers and a target `S`. Find any contiguous subarray summing to `S`, return its `[start, end]` indices or `[-1, -1]`. **Sliding window — O(n) time, O(1) space.**

## Clarifying questions

- All values non-negative? (Critical — sliding window only works because expanding can only grow the sum.)
- Are zeros possible? (Yes; affects `[1, 4, 0, 0, 3, 10, 5]` style cases.)
- Multiple solutions — any one, or all of them?
- Negative values allowed? (If yes, sliding window fails; switch to prefix sum + HashMap.)

## Sliding window — non-negative case

```java
public int[] subarraySum(int[] a, int target) {
    int n = a.length, lo = 0;
    long sum = 0;

    for (int hi = 0; hi < n; hi++) {
        sum += a[hi];
        while (sum > target && lo <= hi) {
            sum -= a[lo++];
        }
        if (sum == target) return new int[]{lo, hi};
    }
    return new int[]{-1, -1};
}
```

The window only ever expands or shrinks; each index moves at most twice → O(n).

## Why non-negativity matters

When all values ≥ 0, expanding the window monotonically grows the sum, and shrinking monotonically reduces it. This monotonicity is what makes the two-pointer scan work. With negatives, expanding can decrease the sum — the algorithm misses windows.

## Negatives allowed — prefix sum + HashMap

```java
public int[] subarraySumGeneral(int[] a, int target) {
    Map<Long, Integer> firstIndex = new HashMap<>();
    firstIndex.put(0L, -1);
    long prefix = 0;
    for (int i = 0; i < a.length; i++) {
        prefix += a[i];
        Integer j = firstIndex.get(prefix - target);
        if (j != null) return new int[]{j + 1, i};
        firstIndex.putIfAbsent(prefix, i);
    }
    return new int[]{-1, -1};
}
```

O(n) time, O(n) space — the trade-off for handling negatives.

## Edge cases

- `target == 0` with all-positive array → only matches a window of zeros (or empty if not allowed).
- Whole array sums to target → returns `[0, n-1]`.
- No match → `[-1, -1]`.

## Follow-ups

- **Count subarrays summing to target** (LeetCode 560) — same prefix-sum trick, count instead of return.
- **Smallest subarray with sum ≥ target** — sliding window, but minimize length on each match.
