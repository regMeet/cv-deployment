# Circular swap of three variables in one statement

> Given `a, b, c`, rotate them so that `a ← b, b ← c, c ← a` — using a **single statement** with no temporary variable. The trick: combine XOR's self-inverse property with assignment-as-expression.

## Clarifying questions

- "One statement" — does that include comma-separated assignments, or strictly one expression?
- Java specifically: assignments-as-expressions don't compose as cleanly as in C. Confirm the language.
- Allowed in Java: a single statement with a chain of side effects.

## C-style solution (the original blog answer)

```c
a = a ^ b ^ c ^ (b = c) ^ (c = a);
```

Why this works (left to right):

1. Compute `a ^ b ^ c` using the **original** values.
2. Evaluate `b = c` — the side effect sets `b` to the old `c`, and the expression's value is the old `c`.
3. XOR with that: `a ^ b ^ c ^ c = a ^ b`.
4. Evaluate `c = a` — at this point `a` is still its original value (we haven't completed the assignment yet). Side effect: `c ← original a`. Expression value: original a.
5. XOR with that: `a ^ b ^ a = b`. So the final value assigned to `a` is `b`.

After the statement: `a = old b`, `b = old c`, `c = old a`. ✓

## In Java

Java guarantees left-to-right evaluation of operands, and an assignment expression evaluates to the assigned value. The C trick translates literally, with one important caveat about evaluation order being well-defined (it is, in Java):

```java
public int[] circularSwap(int a, int b, int c) {
    int[] r = new int[3];
    r[0] = a; r[1] = b; r[2] = c;
    r[0] = r[0] ^ r[1] ^ r[2] ^ (r[1] = r[2]) ^ (r[2] = r[0]);
    return r;   // r = {old b, old c, old a}
}
```

## Why this is mostly a parlor trick

- **Unreadable** — every reviewer will rewrite it.
- **C undefined behavior**: in C, modifying a variable and reading it without a sequence point is UB. The original blog snippet `a = a^b^c^(b=c)^(c=a)` is technically UB in C/C++ because `a` is read and written without a sequence point. **Java is fine** because evaluation order of operands is defined.
- The simple, readable swap uses one temp:
  ```java
  int t = a; a = b; b = c; c = t;
  ```

## Edge cases

- `a == b`, `b == c`, etc. — XOR cancels harmlessly; rotation still works.
- All three equal → no observable change.

## Follow-ups

- **Two-variable XOR swap** — `a ^= b; b ^= a; a ^= b;` Same trick, well-known. Fails when `&a == &b` (aliasing) — both become 0.
- **Rotate K of N variables** — array rotation; O(1) extra is the reverse-reverse-reverse trick.
