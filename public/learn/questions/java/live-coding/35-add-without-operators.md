# Add two integers without `+` or arithmetic operators

> Implement integer addition using only bitwise operators. **XOR computes the sum without carry; AND-then-shift computes the carry. Repeat until carry is zero.**

## Clarifying questions

- Negative numbers allowed? (Yes — Java's `int` is two's complement; the algorithm handles negatives natively.)
- Overflow behavior — wraparound or throw? (Default to wraparound, matching `+`.)
- Allowed: bitwise `& | ^ << >> ~`? Confirm.

## Solution — XOR for sum-without-carry, AND-shift for carry

```java
public int add(int a, int b) {
    while (b != 0) {
        int carry = a & b;
        a = a ^ b;
        b = carry << 1;
    }
    return a;
}
```

At each iteration:
- `a ^ b` is the sum *if there were no carries* (bit-wise XOR).
- `a & b` is the bits where a carry would be generated.
- Shift the carry left by 1 (since carries propagate to the next position) and re-add.

The "re-add" is recursive — but each iteration moves the carry leftward, so the loop terminates within ~32 steps (bits in `int`).

## Why it terminates

The carry, after shifting, has at least one trailing zero — and over iterations, the carry's bit pattern strictly migrates upward. Eventually, either the carry becomes zero or shifts off the end (which in Java is undefined-but-defined two's-complement wraparound and still terminates).

## Negative numbers

Java uses two's complement, so `-3` is `0xFFFFFFFD`. The algorithm works without modification because XOR/AND/shift are agnostic to signed interpretation. Try `add(5, -3)`:

```
a=5  (0101), b=-3 (...11111101)
a^b = ...11111000   (-8)
a&b = 0101 & ...11111101 = 0101 (5)
shift = 0101 << 1 = 1010 (10)
... eventually a = 2, b = 0
```

## Edge cases

- `b == 0` → return `a` immediately.
- `a == 0 && b == 0` → returns 0; carry never enters loop.
- `Integer.MIN_VALUE + Integer.MIN_VALUE` → wraps to 0 (matches `+` behavior).

## Follow-ups

- **Subtract** — `a - b == add(a, ~b + 1)`, but `+1` uses the operator we're banning. Use `add(a, add(~b, 1))`.
- **Multiply** — repeated shift-and-add: for each set bit `i` of `b`, add `a << i` to result.
- **Divide** — repeated subtraction with shifting; trickier with signs.
