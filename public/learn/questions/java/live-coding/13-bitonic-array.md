# Find the peak of a bitonic array

> Array of distinct integers strictly increasing then strictly decreasing. Find index `K` of the peak. O(log n) — modified binary search.

## Clarifying questions

- Strictly increasing/decreasing? (No plateaus → standard binary search works.)
- Always has a peak? (i.e. is a purely increasing or decreasing array a degenerate bitonic? Clarify.)
- Distinct elements?

## Solution — binary search comparing to neighbour

```java
public int peakIndex(int[] a) {
    int lo = 0, hi = a.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] < a[mid + 1]) lo = mid + 1;   // ascending → peak is to the right
        else                     hi = mid;       // descending or peak → answer is mid or left
    }
    return lo;
}
```

The invariant: peak is always in `[lo, hi]`. Each iteration halves the range. When `lo == hi`, that's the peak.

## Why comparing to `mid + 1` (not `mid - 1`)

Single comparison decides which slope we're on:
- `a[mid] < a[mid+1]` → still ascending → peak strictly past mid.
- `a[mid] > a[mid+1]` → descending → peak ≤ mid.

Comparing to both neighbours works too but doubles the comparisons.

## Edge cases

- Length 1 → return 0.
- Length 2 → return index of larger.
- Peak at index 0 (purely descending) — handled if `a[0] > a[1]` triggers the second branch immediately.
- Peak at index n-1 (purely ascending) — first branch keeps advancing `lo`.

## Follow-ups

- **Search for a target in a bitonic array** — find the peak first (O(log n)), then binary-search each side.
- **Bitonic with duplicates** — degenerates to O(n) in the worst case, like rotated-sorted-with-duplicates.
- **Find the maximum of a unimodal function** — ternary search (continuous case).
