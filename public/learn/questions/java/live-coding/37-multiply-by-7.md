# Multiply by 7 without using `*`

> `7 · N == 8 · N − N == (N << 3) − N`. One shift and one subtract. **More a brainteaser than a real optimization** — modern compilers do this themselves.

## Clarifying questions

- Negative numbers OK?
- Overflow concerns? (`(N << 3)` shifts the sign bit if `N` is large.)
- Subtraction allowed (or only bitwise)?

## Solution

```java
public int multiplyBy7(int n) {
    return (n << 3) - n;
}
```

That's it. Same idea generalizes to any constant of the form `2^k - c` or `2^k + c`.

## Why this trick existed

On 1980s-era CPUs, integer multiply was 10-30× slower than shift-and-add. Modern CPUs multiply in 3-5 cycles, so the trick is obsolete in performance terms. **The reason this question still gets asked**: it tests whether you see the binary structure of integers.

## Generalization

```
N · 5  = (N << 2) + N            // 4N + N
N · 9  = (N << 3) + N            // 8N + N
N · 10 = (N << 3) + (N << 1)     // 8N + 2N
N · 15 = (N << 4) - N            // 16N - N
```

Compilers (GCC, javac+JIT) do these transforms automatically.

## Watch overflow

`(n << 3)` overflows when `n > Integer.MAX_VALUE / 8`. The subtraction may produce a value that *looks* correct due to wraparound, but the intermediate state was wrong. Use `long` if `n` can be large:

```java
public long multiplyBy7Safe(int n) {
    return ((long) n << 3) - n;
}
```

## Edge cases

- `n == 0` → returns 0.
- `n == Integer.MIN_VALUE` → `(n << 3)` is undefined-but-Java-defined wraparound; may produce wrong result.
- Negative `n` — shift is arithmetic-equivalent for `<<`; works fine.

## Follow-ups

- **Multiply by constants without `*` and only with `+`/`-`/shift** — repeated shift-and-add.
- **Multiply by arbitrary integer** — Booth's algorithm or shift-and-add per set bit of the multiplier.
- **Divide by 7** — much harder; involves Newton-Raphson-style iteration or magic constants.
