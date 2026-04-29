# Count occurrences of K in a sorted array

> Sorted array with possible duplicates. Count how many times `K` appears. **O(log n)** with two binary searches: leftmost and rightmost occurrence, then subtract.

## Clarifying questions

- Sorted ascending? (Yes for binary search.)
- Distinct or duplicates allowed? (Duplicates required for the problem to be interesting.)
- Return -1, 0, or throw if K is absent?

## Solution — leftmost and rightmost binary search

```java
public int countOccurrences(int[] a, int k) {
    int first = firstOccurrence(a, k);
    if (first == -1) return 0;
    int last  = lastOccurrence(a, k);
    return last - first + 1;
}

private int firstOccurrence(int[] a, int k) {
    int lo = 0, hi = a.length - 1, res = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == k) { res = mid; hi = mid - 1; }   // keep going left
        else if (a[mid] < k) lo = mid + 1;
        else                 hi = mid - 1;
    }
    return res;
}

private int lastOccurrence(int[] a, int k) {
    int lo = 0, hi = a.length - 1, res = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == k) { res = mid; lo = mid + 1; }   // keep going right
        else if (a[mid] < k) lo = mid + 1;
        else                 hi = mid - 1;
    }
    return res;
}
```

Two `O(log n)` searches → total `O(log n)`.

## Why "tracking the result" is cleaner than the bias-mid version

You can also write a single binary search with a right-biased mid for `lastOccurrence` — but it's a famously bug-prone pattern. The "remember the last match, keep searching" structure is mechanically reliable.

## Linear scan version (when to mention it)

```java
int count = 0;
for (int v : a) if (v == k) count++;
return count;
```

O(n) baseline. State it, then beat it. Skipping straight to binary search risks looking like you can't see the obvious.

## Edge cases

- K not in array → 0.
- All elements equal to K → returns array length.
- Empty array → 0.
- Single element matching K → 1.

## Follow-ups

- **First and last index of K** (LeetCode 34) — return both, this problem with the subtract step removed.
- **Count occurrences in a sorted matrix** — extend the staircase walk.
- **K-th occurrence index** — binary search variant.
