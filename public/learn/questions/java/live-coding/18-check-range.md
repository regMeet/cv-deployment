# Check if array values are exactly the integer range [N, N+M-1]

> Unsorted array of M integers. Decide whether its values are exactly `{N, N+1, ..., N+M-1}` (any order, no duplicates allowed... or are they?). The blog's spec accepts duplicates as long as `max - min + 1 == M` — clarify in interview.

## Clarifying questions

- "Consists of numbers within the range" — does that mean the array IS the range exactly, or just contained within it?
- Duplicates allowed? (Spec affects which check is right.)
- Returns boolean only, or also the range bounds?

## Naive interpretation — bag of values must be exactly the range

```java
public boolean isExactRange(int[] a) {
    if (a == null || a.length == 0) return true;
    int min = a[0], max = a[0];
    long sum = 0;
    boolean[] seen = null;
    for (int v : a) { min = Math.min(min, v); max = Math.max(max, v); }
    if (max - min + 1 != a.length) return false;

    seen = new boolean[a.length];
    for (int v : a) {
        int idx = v - min;
        if (seen[idx]) return false;     // duplicate caught
        seen[idx] = true;
    }
    return true;
}
```

O(n) time, O(n) space. Two passes: one for bounds, one to verify uniqueness via a boolean array.

## O(1) space — sum + sum-of-squares trick

If duplicates are forbidden, you can verify with two arithmetic identities:

- `sum(values) == M·N + M(M-1)/2`
- `sum(values²) == sum_{k=N}^{N+M-1} k²` (closed-form available)

Match both → array is exactly the range with no duplicates. **Watch overflow** — use `long`. Useful in interviews mainly to discuss; the boolean-array approach is clearer.

## The blog's looser interpretation

The blog says `{1,3,1}` returns true with N=1, M=3 (range 1..3). That's just `max - min + 1 == M`. **One pass, O(1) space**:

```java
public boolean isWithinTightRange(int[] a) {
    int min = a[0], max = a[0];
    for (int v : a) { min = Math.min(min, v); max = Math.max(max, v); }
    return max - min + 1 == a.length;
}
```

Trivially correct, but allows duplicates and has weird semantics — confirm this is what's wanted before committing.

## Edge cases

- Empty array → vacuously true (or throw — spec).
- Single element → always true.
- Overflow when `max - min + 1` exceeds int → use `long`.

## Follow-ups

- **Find the missing number** — same setup, sum trick or XOR trick (LeetCode 268).
- **Find the missing AND duplicate** (set-mismatch) — sum + sum-of-squares yields a 2-equation system.
