# Verify a number's absence in a sorted on-disk list using a bitmap

> Sorted file of N integers in range `[0, M)`, M ≫ N, file too big to load. Need to answer "is X in the file?" queries fast. **Bitmap** of M bits in memory: O(N) build, O(1) query.

## Clarifying questions

- M ≫ N specifically how much? (e.g. N = 10⁹, M = 10¹² → bitmap is 125 GB; doesn't fit. M = 10⁹, N = 10⁶ → bitmap is 125 MB; fits.)
- Many queries or just one? (For one, just stream-scan; for many, build the index.)
- Read-only file, or mutable?

## Solution — build a bitmap, then query

```java
public class BitmapSet {
    private final long[] bits;
    private final long   m;

    public BitmapSet(long m) {
        this.m = m;
        this.bits = new long[(int) ((m + 63) / 64)];
    }

    public void add(long value) {
        int idx = (int) (value >>> 6);            // value / 64
        long mask = 1L << (value & 63);            // bit position within word
        bits[idx] |= mask;
    }

    public boolean contains(long value) {
        int idx = (int) (value >>> 6);
        long mask = 1L << (value & 63);
        return (bits[idx] & mask) != 0;
    }
}
```

Build: stream the file once, calling `add(v)` for each value → O(N) time.
Query: O(1) with two arithmetic ops and an AND.

Memory: `M / 8` bytes. For M = 10⁹, that's 125 MB — fine on a server.

## When the bitmap doesn't fit

If `M / 8` exceeds available memory, options:

- **Bloom filter** — O(N) bits per element with a small false-positive rate. False negatives never occur, so "absent" answers are reliable; "present" needs a follow-up disk check.
- **External binary search** on the sorted file — O(log N) disk seeks per query. Fine if disk seeks are cheap (SSD).
- **Sparse representation** — store a sorted array or a B-tree of present values. Memory ∝ N, not M.

## Why the sorted property of the file is irrelevant for bitmap

The sortedness is a hint that the file is too big to hash into a `Set<Long>`. The bitmap also doesn't *need* sortedness — it's an unordered membership structure. Mention this in the interview to show you noticed the spec.

## Edge cases

- `M = 0` → empty domain; nothing to check.
- Duplicates in file — bitmap silently dedups (a bit set twice is still set).
- `value >= M` at query time → out of bounds; clamp or throw.

## Follow-ups

- **Count distinct values** — `Long.bitCount` over all words.
- **Range queries** — extra work; bitmap doesn't directly support range counts in O(1).
- **Updates** (insertions in the file) — call `add(v)` on the new value; very fast.
