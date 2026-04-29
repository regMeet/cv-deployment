# Last non-zero digit of N!

> Compute the rightmost non-zero digit of N! without computing N! itself (which overflows fast). The trick: **count and remove factors of 5, pair them with factors of 2 (which cause trailing zeros), and track the residue mod 10 of the remaining product.** Many published solutions are subtly wrong; the canonical correct approach uses recursion on N/5.

## Clarifying questions

- N as int or long? (For N up to ~10⁶, all algorithms work; for N up to 10¹⁸, only the recursive trick scales.)
- Is N! defined for `N == 0`? (`0! = 1` → last digit is 1.)
- Performance — O(N) acceptable, or need O(log N)?

## O(log N) — recursive on N/5

The recurrence (proved in number-theory texts; common form):

```
D(0) = 1
D(N) = (lastDigitOfBlock(N % 10) · 4^(N/5 mod 4) · D(N/5)) mod 10
```

`lastDigitOfBlock(r)` is the last non-zero digit of the product `1 · 2 · 3 · ... · r` after removing factors of 5 (which always pair with the 2s that create trailing zeros). Tabulate it for `r ∈ {0..9}`.

```java
public int lastNonZeroDigit(long n) {
    if (n < 10) {
        int[] table = {1, 1, 2, 6, 4, 2, 2, 4, 2, 8};
        return table[(int) n];
    }
    long blocks = n / 5;
    int  rem    = (int) (n % 10);
    int  block  = lastNonZeroDigit(blocks);
    int  tail   = (int) Math.pow(4, blocks % 4) % 10;
    int[] table = {1, 1, 2, 6, 4, 2, 2, 4, 2, 8};
    return (block * tail * table[rem]) % 10;
}
```

The recursion depth is ~log₅(N) — fits easily even for N = 10¹⁸.

## Why this is hard

Three things conspire:

1. **Factors of 2 and 5 pair to make 10s** (trailing zeros). You must remove them carefully.
2. After removing 5s, the leftover **factors of 2** (without their pair) contribute a multiplicative factor of `2^(extra)` mod 10, which has a **period of 4** (`2, 4, 8, 6, 2, 4, 8, 6, ...`).
3. The product of digits 1..9 (no 5) mod 10 is itself periodic in N's units digit.

The recursive form combines these into one tidy expression.

## O(N) baseline — write this first

```java
public int lastNonZeroDigitNaive(int n) {
    long product = 1;
    for (int i = 2; i <= n; i++) {
        long v = i;
        while (v % 10 == 0) v /= 10;
        product *= v;
        while (product % 10 == 0) product /= 10;
        product %= 1_000_000_000L;          // keep small
    }
    return (int) (product % 10);
}
```

Strip trailing zeros from `i` and the running product; truncate to keep magnitude bounded. Works for N up to ~10⁶ comfortably. **In an interview, write this first and discuss the log version verbally** unless explicitly asked.

## Edge cases

- `n == 0` or `n == 1` → factorial is 1; last non-zero digit 1.
- `n == 5` → `120`; last non-zero digit 2.
- `n == 10` → `3628800`; last non-zero digit 8.
- Very large `n` → only the log-N recursive form survives.

## Follow-ups

- **Trailing zero count of N!** — separate problem, simpler: `n/5 + n/25 + n/125 + ...`.
- **Last K non-zero digits of N!** — generalization; use mod `10^K` and same factor-stripping logic.
- **Last non-zero digit of N!! (double factorial)** — different recurrence.
