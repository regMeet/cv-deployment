# Find the repeated element in a 1..N-1 array of size N

> Array of size N contains every integer from 1 to N-1, with exactly one repeated. Find the repeat. **O(n) time, O(1) space.**

## Clarifying questions

- Exactly one repeat (not multiple)?
- Values fit in `int`? (For the sum trick, watch overflow.)
- Modify-in-place allowed? (Enables a third option.)

## Solution 1 — sum trick

```java
public int repeated(int[] a) {
    long sum = 0;
    int n = a.length;
    for (int v : a) sum += v;
    return (int) (sum - (long) n * (n - 1) / 2);   // expected sum of 1..n-1
}
```

The expected sum of `1..n-1` is `n(n-1)/2`. Actual sum exceeds expected by exactly the duplicate value.

**Watch overflow** — for large N, both sums need `long`.

## Solution 2 — XOR trick (overflow-safe)

```java
public int repeatedXor(int[] a) {
    int x = 0;
    for (int v : a) x ^= v;
    for (int i = 1; i <= a.length - 1; i++) x ^= i;
    return x;
}
```

XOR of all array values XOR'd against XOR of `1..n-1` cancels everything except the duplicate. No overflow risk.

## Solution 3 — Floyd's cycle detection (when in-place isn't allowed but `O(1)` strict)

Treat the array as a function `i → a[i]`. Since one value repeats, two indices map to the same node — there's a cycle. Apply tortoise-and-hare to find the cycle entry.

```java
public int repeatedFloyd(int[] a) {
    int slow = a[0], fast = a[0];
    do { slow = a[slow]; fast = a[a[fast]]; } while (slow != fast);
    slow = a[0];
    while (slow != fast) { slow = a[slow]; fast = a[fast]; }
    return slow;
}
```

LeetCode 287 — most elegant when the array can't be modified and overflow is a concern.

## For floats in [0, 1] (the blog's bonus)

Sum-based and XOR-based both fail (XOR not defined; sum imprecise with floats). Use **HashSet**: O(n) time, O(n) space. There's no O(1) trick for arbitrary floats.

## Edge cases

- Single duplicate at the start vs end → all three algorithms handle it.
- N = 1 → no valid input (no values in 1..0); throw or return -1.

## Follow-ups

- **Find the missing AND repeated** simultaneously — one pass with sum + sum-of-squares (two equations).
- **Multiple repeats** — sum trick fails; use frequency counting in O(n) extra space.
