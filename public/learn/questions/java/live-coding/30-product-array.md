# Product array except self (no division)

> Given `A[N]`, return `P[N]` where `P[i] = product of all elements except A[i]`. **No division allowed.** O(n) time, O(1) extra space (output not counted).

## Clarifying questions

- Are zeros allowed in the input? (Without division this works regardless; with division, zeros are the catch.)
- Output array allocation counted toward space?
- Possible overflow → use `long`?

## Solution — two passes, prefix and suffix products

```java
public int[] productExceptSelf(int[] a) {
    int n = a.length;
    int[] p = new int[n];

    p[0] = 1;
    for (int i = 1; i < n; i++) p[i] = p[i - 1] * a[i - 1];   // prefix products

    int suffix = 1;
    for (int i = n - 1; i >= 0; i--) {
        p[i] *= suffix;                                       // multiply in suffix
        suffix *= a[i];
    }
    return p;
}
```

After pass 1, `p[i] = A[0] · A[1] · ... · A[i-1]` (everything to the left).
Pass 2 multiplies in the running suffix product (everything to the right).
Final: `p[i] = (everything left of i) · (everything right of i)`.

## Why no division

Division is the obvious naive solution: total product / `a[i]`. But:
- Fails if there's a zero (anywhere).
- Multiple zeros → answer is all zeros; one zero → only that index gets the non-zero product, rest are zero. Lots of edge cases.
- Some interviewers ban it explicitly to test cleverness.

## Edge cases

- Single element → output is `[1]` (vacuous product of nothing).
- One zero in input → output has `total_product_excluding_zero` at the zero's index, 0 elsewhere.
- Two or more zeros → output is all zeros.
- Overflow risk → use `long[]` or document the overflow assumption.

## Follow-ups

- **Range product queries** — prefix product array (with care for zeros) gives O(1) per query.
- **Sum instead of product** — same prefix/suffix template with `+`.
- **Division allowed** — handle zero count: 0 zeros → divide; 1 zero → only that index non-zero; ≥2 zeros → all zero.
