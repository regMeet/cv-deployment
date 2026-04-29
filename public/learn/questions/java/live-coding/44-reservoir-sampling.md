# Pick K random elements from a stream of unknown length

> Linked list (or stream) of length N. N is unknown; you can't pre-compute it. Return K uniformly random elements. **Reservoir sampling — Algorithm R: O(N) time, O(K) space, single pass.**

## Clarifying questions

- Sample with or without replacement? (Standard reservoir = without.)
- Each element equally likely (uniform), or weighted? (This problem: uniform.)
- Are duplicates in the stream treated as distinct elements?
- Reproducible (seeded RNG)?

## Algorithm R — Reservoir Sampling

```java
import java.util.Random;
import java.util.Iterator;

public int[] sample(Iterator<Integer> stream, int k) {
    Random rng = new Random();
    int[] reservoir = new int[k];
    int i = 0;
    while (stream.hasNext() && i < k) reservoir[i++] = stream.next();   // fill first k

    while (stream.hasNext()) {
        int v = stream.next();
        int j = rng.nextInt(i + 1);                                       // 0..i inclusive
        if (j < k) reservoir[j] = v;
        i++;
    }
    return reservoir;
}
```

For the i-th element (0-indexed, after the initial K):

- Probability the new element ends up in the reservoir: `K / (i + 1)`.
- Probability any given current reservoir element gets *kicked out*: `(K / (i+1)) · (1/K) = 1 / (i+1)`.
- So each element survives with probability that decays exactly to `K/N` at the end.

## Proof sketch (one paragraph)

By induction on `i`. After processing `i+1` elements, every one of them is in the reservoir with probability `K / (i+1)`. The new element joins with probability `K/(i+1)` (per the algorithm). Each prior reservoir element survives with `(K/(i+1)) · ((K-1)/K) + (1 − K/(i+1))` = `K/(i+1)` after simplification. Same probability for all → uniform sample.

## Why "first fill, then probabilistic" is the structure

Once we've seen at least K elements, every subsequent element gets a chance proportional to `K / (count_so_far)`. The first-fill phase is degenerate: probability 1 because we have to grab them.

## Edge cases

- N < K → return all N elements (`reservoir` is partially filled).
- Single element, K = 1 → that element with probability 1.
- K = 0 → empty result; trivial.
- Very long stream — O(N) regardless.

## Follow-ups

- **Weighted reservoir sampling** (Algorithm A-Res / A-Chao) — assign each element a key `r^(1/w_i)` where `r ~ Uniform(0,1)`, keep the K largest keys.
- **Sample 1 element** (K = 1) — same algorithm; cleaner one-liner.
- **Distributed reservoir** — partition stream, run reservoir per shard, then merge — but careful: simple concatenation is biased; use weighted merge.
