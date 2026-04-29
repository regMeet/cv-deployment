# Next integer with the same number of set bits

> Given N, find the smallest M > N with the same `bitCount`. Example: `N = 10 (1010)` → `M = 12 (1100)`. **The "snoob" trick** — appears in Hacker's Delight and as the underlying op for Gosper's hack (combinatorial enumeration).

## Clarifying questions

- N positive only? (Yes, standard.)
- 32-bit or 64-bit?
- What if N is e.g. `0b111...1000` and there's no larger same-bitcount value within int range?

## Hacker's Delight "snoob" — bit-trick

```java
public int nextSameBits(int n) {
    int c = n & -n;                  // lowest set bit
    int r = n + c;                   // ripple-add: turns trailing run into one bit
    int ones = ((n ^ r) >>> 2) / c;  // count of ones to redistribute (shifted)
    return r | ones;
}
```

What happens conceptually:

1. `c` isolates the lowest set bit.
2. `n + c` flips the trailing run of 1s into a higher bit, simultaneously zeroing them. The bit count of `r` is now `bitCount(n) - (ones in trailing run) + 1`.
3. We need to put back the missing ones at the lowest possible positions.
4. `(n ^ r)` highlights the bits that changed; shifting and dividing by `c` rearranges them at the LSB end.
5. OR the rearranged bits into `r` to get the answer.

## Worked example

```
n     = 0b00010110   (decimal 22; 3 set bits)
c     = 0b00000010   (lowest set bit)
r     = 0b00011000   (after add — collapses trailing 110 → 1000)
n^r   = 0b00001110   (bits that changed)
shift = 0b00000011   ((n^r >> 2) / c = 0b00000011)
result = 0b00011011   (decimal 27 — same 3 set bits, smallest > n)
```

## Why this is famous

Used by Gosper's hack to enumerate all `k`-element subsets of `n` in increasing-bitmask order. Foundational for combinatorial generation. Worth memorizing the pattern.

## Edge cases

- `n == 0` → no set bits; no successor with same count. Return 0 or throw.
- `n` already has the bits at the highest positions (e.g. `0b1110...0000`) → next-same-bits would overflow. Returns 0 or wraps; document.
- Single set bit → next is `n << 1` (the only value with one bit and larger).
- `n == Integer.MAX_VALUE` → no successor in int range; wraps.

## Follow-ups

- **Previous integer with same bitcount** — symmetric trick (Hacker's Delight has it too).
- **Generate all subsets of size k of a set of n** — Gosper's hack iteration starting at `(1 << k) - 1`.
- **Why `>>> 2`** — first the trailing run goes from `c << 0 + c << 1 + ... = (c << k) - c` to `c << k`, contributing `k - 1` ones to redistribute; the shift accounts for that.
