# Closed chain of words — does an Eulerian circuit exist?

> Words chain when last char of W1 equals first char of W2. Decide whether a closed chain uses ALL words. Example: `{abc, gha, efg, cde}` → `abc → cde → efg → gha → abc` ✓. This is **Eulerian circuit on a directed multigraph** where each word is an edge from its first char to its last char.

## Clarifying questions

- Must use every word **exactly once**? (Yes — Eulerian circuit, not Hamiltonian.)
- Can words repeat in the input? Are they distinct? (Treat as multi-edges either way.)
- What's the alphabet — 26 lowercase, ASCII, full Unicode?

## Solution — Eulerian circuit conditions on a directed graph

A directed multigraph has an Eulerian circuit iff:
1. Every vertex has `in-degree == out-degree`.
2. All vertices with non-zero degree are in a single strongly-connected component (we can ignore vertices with degree zero).

```java
public boolean hasClosedChain(String[] words) {
    int[] in  = new int[26];
    int[] out = new int[26];
    int[] parent = new int[26];
    for (int i = 0; i < 26; i++) parent[i] = i;

    for (String w : words) {
        if (w == null || w.isEmpty()) continue;
        int u = w.charAt(0) - 'a';
        int v = w.charAt(w.length() - 1) - 'a';
        out[u]++;
        in[v]++;
        union(parent, u, v);
    }

    int root = -1;
    for (int i = 0; i < 26; i++) {
        if (in[i] != out[i]) return false;          // condition 1
        if (in[i] + out[i] > 0) {                    // condition 2 — single component
            int r = find(parent, i);
            if (root == -1) root = r;
            else if (root != r) return false;
        }
    }
    return root != -1;   // empty input has no closed chain
}

private int find(int[] p, int x) {
    while (p[x] != x) { p[x] = p[p[x]]; x = p[x]; }
    return x;
}
private void union(int[] p, int a, int b) {
    p[find(p, a)] = find(p, b);
}
```

Connectivity here is by the **underlying undirected graph** — that's a sufficient check given condition 1 holds (a known graph-theory result). Avoids the cost of an SCC algorithm.

Complexity: O(N · L · α(26)) where L is max word length. Effectively linear.

## Why model as edges, not vertices

Words are the *edges* (first char → last char), not the vertices. There are at most 26 vertices regardless of input size — that's why this is fast and the in/out array is so small.

## Edge cases

- Empty input → return `false` (or `true`, depending on spec — clarify).
- Single word that starts and ends with same letter → it's a self-loop; closed chain trivially exists.
- All words isolated to different letters (no shared chars) → fails connectivity.

## Follow-ups

- **Construct the chain**, not just decide existence — Hierholzer's algorithm in O(E).
- **Open chain (Eulerian path, not circuit)** — exactly one vertex with out − in = 1, one with in − out = 1, rest balanced.
