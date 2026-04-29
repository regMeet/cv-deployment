# Run-length encoding

> Compress runs: `aabbbcddeef` → `a2b3cd2e2f`. Counts of 1 are omitted. One pass, O(n) time, O(1) extra (output not counted).

## Clarifying questions

- ASCII only or full Unicode? (Affects how we iterate — `codePointAt` vs `charAt`.)
- Counts that exceed 9? Confirm we keep multi-digit numbers (e.g. `a12`).
- Round-trip — do we also need decoding?

## Solution — single pass with running count

```java
public String encode(String s) {
    if (s == null || s.isEmpty()) return "";
    StringBuilder out = new StringBuilder();
    int i = 0, n = s.length();
    while (i < n) {
        int j = i + 1;
        while (j < n && s.charAt(j) == s.charAt(i)) j++;
        int run = j - i;
        out.append(s.charAt(i));
        if (run > 1) out.append(run);
        i = j;
    }
    return out.toString();
}
```

## Decoding (mirror)

```java
public String decode(String s) {
    StringBuilder out = new StringBuilder();
    int i = 0, n = s.length();
    while (i < n) {
        char c = s.charAt(i++);
        int count = 0;
        while (i < n && Character.isDigit(s.charAt(i))) {
            count = count * 10 + (s.charAt(i++) - '0');
        }
        if (count == 0) count = 1;
        for (int k = 0; k < count; k++) out.append(c);
    }
    return out.toString();
}
```

## Edge cases

- Empty / single-char input.
- All-same-character input → `<c><n>`.
- Decoding ambiguity if data itself contains digits — say so out loud; the encoding above is unsafe for digit-containing input.

## Follow-ups

- **Compress only if shorter** — return original when encoded length ≥ original.
- **Block-level RLE for binary data** — used in bitmap fonts, fax, BMP. Different framing.
