# Top-K largest from a stream too big for memory

> File of 10^8 integers, one per line. Find the 100 largest. Can't load all at once. **Min-heap of size K — O(N log K) time, O(K) space.**

## Clarifying questions

- Are duplicates allowed? Should top-K include them?
- Tied values at the K-th boundary — return all ties or exactly K?
- Memory budget — is O(K) (a few hundred ints) actually fine? Usually yes.
- Single machine or distributed input? (Different algorithm for the latter.)

## Solution — bounded min-heap

```java
import java.util.PriorityQueue;
import java.util.Iterator;

public int[] topK(Iterator<Integer> stream, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>(k);   // min-heap
    while (stream.hasNext()) {
        int v = stream.next();
        if (heap.size() < k) {
            heap.offer(v);
        } else if (v > heap.peek()) {
            heap.poll();
            heap.offer(v);
        }
    }
    int[] out = new int[heap.size()];
    int i = 0;
    while (!heap.isEmpty()) out[i++] = heap.poll();   // ascending order
    return out;
}
```

The min-heap always holds the **K largest seen so far**. The top of the heap is the smallest of those K — anything larger replaces it; anything smaller is ignored.

## Why min-heap (not max-heap)

We want fast access to the *threshold* (the smallest among the current K). Replacing the threshold and re-heapifying is O(log K). A max-heap would force a linear scan to find the smallest.

## Sorting alternative — and why it's wrong here

Sort entire stream, take top K → O(N log N) time, O(N) space. **The space requirement (O(N)) doesn't fit the constraint** that we can't load all values. Mention sorting as the obvious wrong answer to demonstrate awareness.

## Edge cases

- N < K → return all.
- All identical → returns K copies (or all if N < K).
- Stream of negatives only → still works, no special case.

## Follow-ups

- **Distributed across many shards** — each shard computes its top-K, central node merges (heap of K candidates from each, total O(S·K) memory).
- **K-th largest only (not full list)** — same heap, return its peek at the end.
- **Quickselect** — O(N) expected time if you can hold the data; useless here because we can't.
