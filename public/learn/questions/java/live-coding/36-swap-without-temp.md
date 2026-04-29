# Swap two integers without a temporary variable

> XOR swap (overflow-safe) or arithmetic swap (overflow-prone). **Both are mostly trivia in 2025 — modern compilers register-allocate the temp version away. Worth knowing for the conversation.**

## Clarifying questions

- Need to handle aliasing (the two variables are actually the same memory location)?
- Integer arithmetic only, or also for arbitrary types?
- Is performance actually a goal, or is this a pure interview question?

## XOR swap — overflow-free

```java
public void swap(int[] a, int i, int j) {
    if (i == j) return;                   // critical: avoid aliasing → both become 0
    a[i] ^= a[j];
    a[j] ^= a[i];
    a[i] ^= a[j];
}
```

Trace:
1. `a[i] = a[i] ^ a[j]`
2. `a[j] = a[j] ^ (a[i] ^ a[j]) = a[i]_original`
3. `a[i] = (a[i] ^ a[j]) ^ a[i]_original = a[j]_original`

## Arithmetic swap — readable but overflow-prone

```java
public void swapAdd(int[] a, int i, int j) {
    if (i == j) return;
    a[i] = a[i] + a[j];
    a[j] = a[i] - a[j];
    a[i] = a[i] - a[j];
}
```

Fails when `a[i] + a[j]` overflows — silently produces wrong values in some inputs. **XOR has no overflow** because each bit is independent.

## The aliasing trap

Both versions destroy the value when `i == j` (or, in pointer languages, when `&a == &b`):

```
a[0] ^= a[0];   // a[0] = 0
a[0] ^= a[0];   // still 0
a[0] ^= a[0];   // still 0 — value is lost
```

**Always guard with `if (i == j) return;`** when called on indices into the same array.

## Why this is mostly a parlor trick now

Compilers turn `int t = a; a = b; b = t;` into two register moves with no actual temp. The XOR-swap version generates *more* instructions than the temp version on modern hardware. Still asked in interviews because it tests bitwise reasoning and edge-case awareness (aliasing).

## Edge cases

- `i == j` → must short-circuit, else both lose their value.
- Both already equal (different positions) → swap is a no-op; both versions handle correctly.
- `INT_MIN` and `INT_MAX` in arithmetic version → undefined (overflow); XOR version is safe.

## Follow-ups

- **Swap two variables of arbitrary type** without temp — generally impossible in Java (no operator overloading); use a temp.
- **Swap using a single tuple-style assignment** — Java doesn't support it; Python and Go do.
