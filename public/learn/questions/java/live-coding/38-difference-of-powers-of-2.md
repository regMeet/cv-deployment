# Is N of the form 2^x − 2^y (with x > y > 0)?

> Decide whether N can be written as `2^x − 2^y`. Equivalently: in binary, N is a contiguous run of 1s, NOT touching bit 0 (since `y > 0`). **O(1) bit-twiddling.**

## Clarifying questions

- `x > y > 0` — strict, so `y ≥ 1`. Means N is even.
- N positive only? (Yes per spec.)
- Bit width? (Java `int` or `long`.)

## The bit-pattern view

`2^x − 2^y` in binary is `(2^(x-y) − 1) << y` — a run of `(x-y)` consecutive 1s, shifted left by `y`. Examples:
- `2^4 − 2^1 = 14 = 1110`
- `2^5 − 2^2 = 28 = 11100`
- `2^3 − 2^1 = 6  = 110`

So the test is: **"the set bits in N form a single contiguous run, AND bit 0 is 0."**

## Solution

```java
public boolean isDifferenceOfPowers(int n) {
    if (n < 2) return false;
    if ((n & 1) != 0) return false;            // bit 0 must be 0 (y > 0)
    // strip trailing zeros
    while ((n & 1) == 0) n >>>= 1;
    // now n must be of the form 2^k - 1, i.e. all 1s
    return ((n + 1) & n) == 0;                  // power-of-two test on n+1
}
```

After stripping trailing zeros, what remains must be all 1s. Adding 1 to all-1s gives a power of two; AND with the original gives 0.

## The blog's trick (alternate)

```java
public boolean isDifferenceOfPowers2(int n) {
    if (n < 2 || (n & 1) != 0) return false;
    int m = n | (n - 1);          // turn all bits below highest set into 1
    return ((m + 1) & m) == 0;
}
```

`n | (n-1)` flips all bits below the highest set, producing `0b...0111...1`. If N was a contiguous run, this gives all 1s up to the highest set bit. `m + 1` then is a power of two iff `m` was all-1s in the right pattern.

## Edge cases

- `n == 0` → not expressible.
- `n == 1` → `2^1 − 2^0 = 1` but spec says `y > 0`, so reject.
- `n` odd → bit 0 set; not expressible (since `y ≥ 1`).
- `n == 2` → would need `x = 2, y = 0` (rejected) or `x = ?, y = 1` → `2^x − 2 = 2 ⇒ 2^x = 4 ⇒ x = 2`, but then `x = y = 1`-ish edge; reject.

## Follow-ups

- **Sum of powers of 2** (`2^x + 2^y`) — separate problem; check that N has exactly two set bits.
- **N as `2^x · k`** — check trailing zeros vs odd quotient.
