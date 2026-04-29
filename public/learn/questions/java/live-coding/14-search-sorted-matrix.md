# Search in a row-and-column sorted matrix

> 2D matrix sorted both row-wise and column-wise (each row sorted left-to-right, each column top-to-bottom). Search for a key. **O(m + n)** with the staircase walk.

## Clarifying questions

- Row + column sorted, but no relation between rows? (E.g. row 2's first element may be smaller than row 1's last. This is the common case.)
- Need index of any match, or first occurrence?
- Strictly stronger version: each row's first element ≥ previous row's last → that's a different problem solvable in O(log(mn)).

## Solution — staircase from top-right corner

```java
public int[] search(int[][] m, int key) {
    if (m == null || m.length == 0 || m[0].length == 0) return new int[]{-1, -1};
    int r = 0, c = m[0].length - 1;
    while (r < m.length && c >= 0) {
        if (m[r][c] == key) return new int[]{r, c};
        if (m[r][c] > key)  c--;     // current value too big → go left
        else                r++;     // too small → go down
    }
    return new int[]{-1, -1};
}
```

At each step, we eliminate either an entire row or an entire column. Total moves: m + n.

## Why top-right (or bottom-left), not corners on the diagonal

From top-left, both moves (right and down) increase values — no way to decide which direction. From top-right, the two outgoing moves go in *opposite* directions: left decreases, down increases. That's what gives the algorithm its decision.

## Edge cases

- Empty matrix → return -1.
- Key smaller than all → loop ends with `c = -1`.
- Key bigger than all → loop ends with `r = m.length`.
- Single row / single column → degenerates to plain binary scan.

## Follow-ups

- **Count occurrences** — same staircase, increment counter on match and step both `r++, c--` (key has at most one match per row given strict sort).
- **Strictly stronger sort (each row's start > previous row's end)** — flatten coordinates and do binary search on `[0, m·n)`. O(log(mn)).
- **K-th smallest in such a matrix** — heap-based or binary search on value.
