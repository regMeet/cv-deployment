# Trailing zeros in N!

> Count trailing zeros of N!. Each trailing zero is a factor of 10 = 2 · 5. There are always more 2s than 5s in N!, so **count factors of 5: `n/5 + n/25 + n/125 + ...`**. O(log₅ N).

## Clarifying questions

- N as `int` or `long`? (Affects whether intermediate division stays safe.)
- `N = 0` allowed? (`0! = 1` → 0 trailing zeros.)
- Need only the count, not the digits?

## Solution — sum of `n / 5^k`

```java
public int trailingZeros(long n) {
    int count = 0;
    while (n >= 5) {
        n /= 5;
        count += n;
    }
    return count;
}
```

`n/5` counts numbers from 1..n divisible by 5 (each contributes at least one factor of 5).
`n/25` counts those divisible by 25 (extra factor; `25 = 5²` contributes a *second* 5).
And so on. Sum them.

## Why factors of 5, not 2

In N!, factors of 2 are vastly more abundant than factors of 5 (about `2·n/5` to `4·n/5` more, depending on N). So the bottleneck for "how many 10s can we form" is the 5s. **State this insight first** — it's the whole intuition.

## Worked example

`N = 100`:
- `100 / 5  = 20`
- `100 / 25 = 4`
- `100 / 125 = 0` → stop.
- Total: 24. (`100! = 9.33...e157`, ends in exactly 24 zeros.)

## Naive baseline (mention to avoid sounding silly)

Computing N! directly: overflows for N > 20 in `long`. `BigInteger` works but is `O(N²)` time and `O(N log N)` space. State briefly, beat it.

## Edge cases

- `n == 0` → 0 (loop never executes).
- `n < 5` → 0.
- `n == 5` → 1.
- Very large `n` (10¹⁸) — works fine; loop runs ~26 times.

## Follow-ups

- **Trailing zeros of `N!` in base B** — factorize B, count each prime factor's multiplicity in N!, take the min divided appropriately.
- **K-th trailing digit of N!** — much harder; related to the "last non-zero digit of N!" problem.
- **Smallest N with exactly M trailing zeros** — binary search on N, using `trailingZeros(N)` as the monotonic check.
