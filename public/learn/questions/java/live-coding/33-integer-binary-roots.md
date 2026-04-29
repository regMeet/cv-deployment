# Symmetric binary roots

> `bit-rev(N)` reverses the bits of `N` (the meaningful bits, not the full 32). A **symmetric binary root** of N is an integer `A` such that `N = A · bit-rev(A)`. Find all such A. Example: 32-bit reverse is wrong here — only the bits up to the highest set bit are reversed.

## Clarifying questions

- Bit-reverse is over the *minimal* width of A (most-significant bit kept fixed)? (Yes — `bit-rev(25) = 19` because `25 = 11001` and reverse `10011 = 19`.)
- N's range — fits in `long`?
- Multiple roots possible — return all? Or just one?
- Performance bound? (Brute force up to `sqrt(N)` is usually fine.)

## Solution — try every candidate up to √N

For `A · bit-rev(A) = N`, at least one of `{A, bit-rev(A)}` is ≤ √N. So enumerate candidates up to √N, compute their bit-reverse, check the product.

```java
import java.util.ArrayList;
import java.util.List;

public List<Long> symmetricRoots(long n) {
    List<Long> out = new ArrayList<>();
    long limit = (long) Math.sqrt(n) + 1;
    for (long a = 1; a <= limit; a++) {
        long r = bitReverse(a);
        if (a * r == n) out.add(a);
        if (r != a && r * a == n && r <= limit) out.add(r);
    }
    return out;
}

private long bitReverse(long x) {
    long r = 0;
    while (x > 0) {
        r = (r << 1) | (x & 1);
        x >>>= 1;
    }
    return r;
}
```

`bitReverse` only flips the bits that are actually used — high zeros aren't preserved. That matches the example (`bit-rev(25) = 19`, not the 32-bit reverse).

## Why √N is enough

If `A · bit-rev(A) = N`, then `min(A, bit-rev(A)) ≤ √N`. So we never need to check past √N — every valid pair has at least one member there. (Watch the duplicate when `A == bit-rev(A)` — palindromic bit pattern, e.g. `A = 9 = 1001`.)

## Edge cases

- N = 0 → only `A = 0` (degenerate).
- N = 1 → `A = 1`.
- A is a bit-palindrome (`bit-rev(A) == A`) → A² = N → only one entry, not two.
- `A = 0` not enumerated (loop starts at 1) — usually intended.

## Follow-ups

- **Largest A satisfying the condition** — same loop but track max instead of collecting.
- **Bit-reverse over fixed 32-bit width** — different problem; LeetCode 190 uses lookup tables for speed.
- **N not factorable as `A · bit-rev(A)`** — return empty list.
