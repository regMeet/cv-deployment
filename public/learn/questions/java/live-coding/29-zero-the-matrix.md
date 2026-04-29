# Zero out rows and columns of a matrix

> N×N matrix of 0s and 1s. Whenever you find a 0, zero its entire row and column. Naive: O(N²) extra space. Senior: **O(1) extra space** by reusing the first row and first column as flags.

## Clarifying questions

- Modify in place or return a new matrix?
- The matrix is just 0s and 1s, or arbitrary integers? (Algorithm same; values different.)
- Do we need to scan multiple times if a 0 is created during writing? **No** — only the *original* 0s mark rows/columns.

## Naive — two boolean arrays

```java
public void zero(int[][] m) {
    int r = m.length, c = m[0].length;
    boolean[] rowZero = new boolean[r];
    boolean[] colZero = new boolean[c];
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++)
            if (m[i][j] == 0) { rowZero[i] = true; colZero[j] = true; }
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++)
            if (rowZero[i] || colZero[j]) m[i][j] = 0;
}
```

O(R + C) extra space. Clear, easy to write — start here in an interview.

## O(1) space — use first row/column as marker storage

```java
public void zeroInPlace(int[][] m) {
    int r = m.length, c = m[0].length;
    boolean firstRowZero = false, firstColZero = false;

    for (int j = 0; j < c; j++) if (m[0][j] == 0) firstRowZero = true;
    for (int i = 0; i < r; i++) if (m[i][0] == 0) firstColZero = true;

    for (int i = 1; i < r; i++)
        for (int j = 1; j < c; j++)
            if (m[i][j] == 0) { m[i][0] = 0; m[0][j] = 0; }

    for (int i = 1; i < r; i++)
        for (int j = 1; j < c; j++)
            if (m[i][0] == 0 || m[0][j] == 0) m[i][j] = 0;

    if (firstRowZero) for (int j = 0; j < c; j++) m[0][j] = 0;
    if (firstColZero) for (int i = 0; i < r; i++) m[i][0] = 0;
}
```

The trick: row 0 and column 0 carry the zero-out flags for everyone else. Two booleans (`firstRowZero`, `firstColZero`) carry the flags for row 0 and column 0 themselves.

## Why three passes are needed

1. Capture whether the first row/column originally had any zero.
2. Mark zeros in row 0 and column 0 based on every other cell's zeros.
3. Zero out body cells by reading the marker rows/columns.
4. Finally, zero out the first row/column based on the captured booleans.

Skipping the booleans loses information: by the time you process row 0, row 0 may have been overwritten with markers, so you can't tell if the *original* row 0 had a zero.

## Edge cases

- Matrix with no zeros → unchanged.
- All zeros → still all zeros.
- 1×N or N×1 → boolean approach is simpler; the in-place trick degenerates.

## Follow-ups

- **Sparse matrix** — store row/col indices in two sets, no need for a per-cell scan.
- **Different sentinel** (e.g. -1 instead of 0) — same algorithm with one-line change.
