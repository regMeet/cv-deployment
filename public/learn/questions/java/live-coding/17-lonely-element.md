# Find the lonely element using XOR

> Array of size 2N+1: every value appears exactly twice except one which appears once. Find the lonely one. **O(n) time, O(1) space.** XOR everything.

## Clarifying questions

- Are values arbitrary integers or bounded? (XOR works regardless of range.)
- Could the lonely element be 0? (Yes; XOR still works.)
- Always exactly one lonely element? (If zero or many, the algorithm needs adjustment.)

## Solution — XOR of all elements

```java
public int lonely(int[] a) {
    int x = 0;
    for (int v : a) x ^= v;
    return x;
}
```

Three properties of XOR carry the entire proof:

1. `a ^ a == 0`
2. `a ^ 0 == a`
3. XOR is associative and commutative

Pair up the duplicates → each pair XORs to 0. Lonely element XOR'd against zero is itself.

## Why HashMap is the wrong answer here

HashMap-with-counts works (O(n) time, O(n) space) but you'd be giving up an obvious O(1)-space win. **Mention it, then beat it with XOR.** Senior signal.

## Edge cases

- Single-element array → that element is the answer.
- Lonely element is 0 → XOR result is 0; correct.
- Empty array → XOR result is 0; depending on spec, throw or return 0.

## Follow-ups

- **Two lonely elements** (everything else twice; LeetCode 260) — XOR everything → result is `a ^ b`. Pick a set bit they differ on, partition the array by that bit, XOR each half → recover both.
- **One element appears once, all others appear three times** (LeetCode 137) — bit-by-bit modular arithmetic mod 3. Cleaner: two state-tracking accumulators (`ones`, `twos`).
- **Sorted version** — pairs of duplicates don't span the lonely element; binary search the boundary in O(log n).
