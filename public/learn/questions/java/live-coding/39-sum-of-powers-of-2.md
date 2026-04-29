# Is N of the form 2^x + 2^y (with x ≠ y, both positive)?

> Decide whether N can be written as `2^x + 2^y` with distinct exponents. Equivalently: **N has exactly two set bits in binary.** O(1).

## Clarifying questions

- `x` and `y` distinct? (Otherwise `2·2^x = 2^(x+1)`, a single power of 2 — clarify.)
- Both positive (`x, y ≥ 1`)? Affects bit-0 handling.
- N fits in `int`?

## Solution — count set bits

```java
public boolean isSumOfPowers(int n) {
    if (n <= 0) return false;
    return Integer.bitCount(n) == 2;
}
```

If N has exactly two 1-bits at positions `i` and `j`, then `N = 2^i + 2^j` with `i ≠ j`. Trivially correct.

## Without `Integer.bitCount` — clear-rightmost-bit twice

```java
public boolean isSumOfPowersManual(int n) {
    if (n <= 0) return false;
    n &= (n - 1);          // clears the lowest set bit
    if (n == 0) return false;   // had only 1 set bit
    n &= (n - 1);          // clears the next lowest
    return n == 0;         // all bits cleared → exactly 2 set originally
}
```

`n & (n-1)` is the canonical "drop the lowest set bit" idiom. Apply twice — must zero out — confirms exactly 2 set bits.

## If `x, y > 0` is required (no bit-0)

```java
public boolean isSumOfPowersStrict(int n) {
    if ((n & 1) != 0) return false;     // bit 0 set → one of x or y is 0
    return Integer.bitCount(n) == 2;
}
```

## Edge cases

- `n == 0` → no.
- `n == 1` → only one bit; no.
- `n == 2` → bit 1 only; no (need two distinct bits).
- `n == 3` → bits 0 and 1; **yes** if `x, y ≥ 0` allowed; no if both must be positive.
- Negative `n` (Java `int` two's complement) → reject.

## Follow-ups

- **Sum of K powers of 2** — `Integer.bitCount(n) == K`.
- **Difference of powers of 2** — separate problem; contiguous run of 1s.
- **Decompose N into the *minimum* number of powers of 2** — that's `bitCount(n)` (each set bit is one power).
