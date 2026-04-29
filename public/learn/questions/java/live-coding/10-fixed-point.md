# Fixed point in a sorted array

> Sorted array of distinct integers. Find any index `i` where `a[i] == i`, or return -1. Naive scan is O(n); since the array is sorted with distinct values, you can do it in **O(log n)**.

## Clarifying questions

- Distinct elements guaranteed? (If duplicates allowed, binary search breaks; clarify.)
- Sorted ascending strictly? (Yes for binary search to work.)
- Any fixed point or specifically the first/last one?

## Solution — binary search

```java
public int fixedPoint(int[] a) {
    int lo = 0, hi = a.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == mid) return mid;
        if (a[mid] < mid)  lo = mid + 1;
        else               hi = mid - 1;
    }
    return -1;
}
```

## Why this works

With distinct sorted integers, `a[i+1] ≥ a[i] + 1`, so the function `f(i) = a[i] - i` is non-decreasing. We want `f(i) == 0`. Binary search finds the zero of a monotone function.

- If `a[mid] < mid`, then for all `i ≤ mid`, `a[i] < i` too — discard left.
- If `a[mid] > mid`, symmetric — discard right.

## With duplicates

Binary search **doesn't work** for non-strict ascending. The standard trick is recursive: search both halves but prune by value bounds.

```java
private int find(int[] a, int lo, int hi) {
    if (lo > hi) return -1;
    int mid = lo + (hi - lo) / 2;
    if (a[mid] == mid) return mid;
    int leftEnd  = Math.min(mid - 1, a[mid]);
    int leftRes  = find(a, lo, leftEnd);
    if (leftRes != -1) return leftRes;
    int rightStart = Math.max(mid + 1, a[mid]);
    return find(a, rightStart, hi);
}
```

Worst-case O(n) but typically much faster.

## Edge cases

- Empty array → -1.
- All elements negative → no fixed point possible if `a[n-1] < 0` (still safely returns -1).
- All elements ≥ n → no fixed point; binary search rules out the whole array.

## Follow-ups

- **Smallest fixed point** — bias the search left when `a[mid] == mid`.
- **Largest fixed point** — bias right.
