# All pairs in a sorted array summing to N

> Sorted array, integer N. Find all pairs `(a, b)` with `a + b == N`. **Two-pointer convergence — O(n) time, O(1) space.**

## Clarifying questions

- Indices or values?
- Pairs of indices `(i, j)` with `i < j`, or values regardless of position?
- Allow same element used twice (i.e. `2·a == N`)? Standard answer: no — distinct indices.
- Duplicates — return all pair instances, or distinct value pairs?

## Solution — converging two pointers

```java
import java.util.ArrayList;
import java.util.List;

public List<int[]> pairsWithSum(int[] a, int n) {
    List<int[]> out = new ArrayList<>();
    int lo = 0, hi = a.length - 1;
    while (lo < hi) {
        int sum = a[lo] + a[hi];
        if (sum == n) {
            out.add(new int[]{a[lo], a[hi]});
            lo++;
            hi--;
        } else if (sum < n) lo++;
        else                hi--;
    }
    return out;
}
```

Each pointer moves only inward, so each index is visited once → O(n) total.

## Why two-pointer beats hashing here

Unsorted: HashSet lookup → O(n) time, O(n) space. Sorted: two pointers → O(n) time, **O(1) space**. The sortedness gives you ordering you can exploit; don't waste it.

## Distinct pairs vs all instances

If the input has duplicates and you want **distinct value pairs only**:

```java
if (sum == n) {
    out.add(new int[]{a[lo], a[hi]});
    int lv = a[lo], hv = a[hi];
    while (lo < hi && a[lo] == lv) lo++;
    while (lo < hi && a[hi] == hv) hi--;
}
```

Skip past duplicates on both sides after a hit.

## Edge cases

- Empty / single-element → no pairs.
- All same value, `2·v == N` → many pairs (`(n choose 2)`).
- N very large or very small → loop exits cleanly.

## Follow-ups

- **3-sum** (LeetCode 15) — fix one element, two-pointer the rest. O(n²).
- **Closest pair to N** (no exact sum required) — same scan, track closest delta.
- **Unsorted input** — HashSet of `N - a[i]` while scanning. O(n) time, O(n) space.
