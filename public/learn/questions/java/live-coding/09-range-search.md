# Range search in a sorted array

> Sorted array defines ranges: `[12, 20, 32, 40, 52]` defines bounds at indices 0..4. Given target `T`, return the index `i` such that `a[i] ≤ T < a[i+1]`. Below the smallest → return 0 by convention; above the largest → return `n-1`. O(log n).

## Clarifying questions

- Below `a[0]` and above `a[n-1]` — what should we return? (Spec-driven; clarify.)
- Duplicates in the array? (Affects which index to return — leftmost or rightmost.)
- Are the bounds inclusive on the left, exclusive on the right? (Standard convention here.)

## Solution — binary search for the rightmost `a[i] ≤ T`

```java
public int rangeIndex(int[] a, int target) {
    if (a == null || a.length == 0) return -1;
    int lo = 0, hi = a.length - 1;

    while (lo < hi) {
        int mid = lo + (hi - lo + 1) / 2;   // bias right to avoid infinite loop
        if (a[mid] <= target) lo = mid;
        else                  hi = mid - 1;
    }
    return lo;
}
```

The right-biased mid is the trick: when searching for the *last* element satisfying a predicate, computing `mid` as `(lo + hi) / 2` gets you stuck when `lo + 1 == hi`. Adding 1 to the numerator fixes it.

## Equivalent — `Arrays.binarySearch` post-processing

```java
int idx = Arrays.binarySearch(a, target);
if (idx >= 0) return idx;             // exact match
int ins = -idx - 1;                    // insertion point
return Math.max(0, ins - 1);
```

Shorter, but the manual binary search is what an interviewer wants to see you write.

## Edge cases

- Empty array → return -1 (or whatever the spec says).
- Target less than `a[0]` → returns 0 with convention above.
- Target greater than `a[n-1]` → returns `n-1`.
- Single element → returns 0.

## Follow-ups

- **Find the insertion point exactly** — `lower_bound` / `upper_bound` semantics. Same loop with strict vs non-strict comparison.
- **Range overlapping intervals** — different problem; needs a sweep or interval tree.
