# Kth smallest in the union of two sorted arrays

> Two sorted arrays of sizes M, N. Return the K-th smallest element of their union. **O(log(min(K, M, N)))** with the right algorithm.

## Clarifying questions

- 1-indexed or 0-indexed K? (Big source of off-by-one bugs.)
- Can K exceed M+N? (Validate input.)
- Allow duplicates across arrays? (Yes, treat as multiset.)
- Median (special case K = (M+N)/2) or general?

## Naive — merge until you've seen K elements

O(K) time, trivial to write. Worth mentioning as a baseline.

```java
public int kthMerge(int[] a, int[] b, int k) {
    int i = 0, j = 0, count = 0, last = 0;
    while (count < k) {
        if (i < a.length && (j == b.length || a[i] <= b[j])) last = a[i++];
        else                                                  last = b[j++];
        count++;
    }
    return last;
}
```

## O(log K) — binary partition

Compare K/2-th elements of each array; discard the lower half of the array whose K/2-th value is smaller.

```java
public int kth(int[] a, int aStart, int[] b, int bStart, int k) {
    if (aStart >= a.length) return b[bStart + k - 1];
    if (bStart >= b.length) return a[aStart + k - 1];
    if (k == 1) return Math.min(a[aStart], b[bStart]);

    int half  = k / 2;
    int aIdx  = Math.min(aStart + half, a.length) - 1;
    int bIdx  = Math.min(bStart + half, b.length) - 1;

    if (a[aIdx] <= b[bIdx]) {
        return kth(a, aIdx + 1, b, bStart, k - (aIdx - aStart + 1));
    } else {
        return kth(a, aStart, b, bIdx + 1, k - (bIdx - bStart + 1));
    }
}
```

Each call eliminates ~K/2 candidates → log K depth, constant work per level.

## Why discarding the lower K/2-th is safe

If `a[K/2-1] < b[K/2-1]`, every element of `a[0..K/2-1]` has at most `K/2 - 1` from `a` and `K/2 - 1` from `b` smaller — so its rank is at most K - 1 in the union. None of them can be the K-th. Throw them away.

## Edge cases

- One array empty → answer is `b[k-1]`.
- K = 1 → minimum of the two heads.
- K = M + N → maximum of the two tails.
- K out of range → throw.

## Follow-ups

- **Median of two sorted arrays** (LeetCode 4) — same partitioning idea but framed around finding the cut.
- **K-th in N sorted arrays** — min-heap of array heads, pop K times → O(K log N).
