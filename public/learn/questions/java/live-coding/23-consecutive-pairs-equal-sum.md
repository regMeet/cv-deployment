# Consecutive pairs with equal sum across two sorted arrays

> Two sorted arrays. Find all pairs of consecutive numbers `(A[i], A[i+1])` and `(B[j], B[j+1])` such that `A[i] + A[i+1] == B[j] + B[j+1]`. Two-pointer scan over both arrays' adjacent-pair sums. O(m + n).

## Clarifying questions

- "Consecutive" means adjacent indices, right? (Yes — `i, i+1`.)
- Both arrays sorted ascending? (If so, adjacent-pair sums are non-decreasing.)
- Need indices or just values?
- Allow the same `A[i..i+1]` to match multiple `B[j..j+1]` (and vice versa)?

## Solution — two-pointer over adjacent-pair sums

```java
public List<int[][]> consecutivePairsEqualSum(int[] a, int[] b) {
    List<int[][]> out = new ArrayList<>();
    int i = 0, j = 0;
    int p = a.length - 1, q = b.length - 1;
    while (i < p && j < q) {
        int sa = a[i] + a[i + 1];
        int sb = b[j] + b[j + 1];
        if (sa == sb) {
            out.add(new int[][]{{a[i], a[i + 1]}, {b[j], b[j + 1]}});
            i++;
            j++;
        } else if (sa < sb) i++;
        else                j++;
    }
    return out;
}
```

The implicit "pair-sum array" `S_a[i] = A[i] + A[i+1]` is non-decreasing because A is sorted. Same for B. So the same converging-pointer technique used for sorted-array intersection applies.

## Why no nested loop is needed

Naive: for each `i`, scan all `j` → O(m·n). The monotonicity of pair sums lets us discard whole prefixes — same idea as merging two sorted lists. Don't fall into the nested-loop trap.

## Edge cases

- Either array has fewer than 2 elements → no pairs possible; return empty.
- All identical values across both arrays → every i, j pair matches; output is O(min(m, n)).
- No matches → empty list.

## Follow-ups

- **Triples** with equal sum across arrays — analogous, but pair-sum monotonicity doesn't extend cleanly. Mention as harder.
- **Same array, different windows of size k** — generalize: window sums of size k are non-decreasing only if the *changes* are non-negative; adjacent-pair sums in a sorted array preserve this for k=2 specifically.
