# Recursively remove adjacent duplicates

> Process a string like `abccbcba`: remove pairs of adjacent equal characters. After `cc` cancels → `abbcba`. After `bb` cancels → `acba`. No more cancels → done. **Stack — O(n) time, O(n) space.**

## Clarifying questions

- Cascading removal (after a removal, new adjacencies can form and also cancel)? **Yes** — that's what makes the problem non-trivial.
- Pairs only, or runs of any length? (Different problem variants exist.)
- Case-sensitive? Unicode?

## Solution — stack of characters

```java
public String removeAdjacentPairs(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (!stack.isEmpty() && stack.peek() == c) {
            stack.pop();
        } else {
            stack.push(c);
        }
    }
    StringBuilder out = new StringBuilder();
    Iterator<Character> it = stack.descendingIterator();
    while (it.hasNext()) out.append(it.next());
    return out.toString();
}
```

Each new char either cancels the stack top or extends the result. Cascading is automatic: after a pop, the next char is checked against the new top.

## Why a stack and not in-place pointer manipulation

You *can* do it in-place with a write index, treating the prefix `s[0..writeIdx]` as a stack — same algorithm:

```java
char[] buf = s.toCharArray();
int top = -1;
for (char c : buf) {
    if (top >= 0 && buf[top] == c) top--;
    else                            buf[++top] = c;
}
return new String(buf, 0, top + 1);
```

Cleaner; no allocation of a separate stack. **Mention this in the interview** — saves an allocation per character.

## Variant — runs of length k

LeetCode 1209: remove every run of exactly `k` identical characters. Use a stack of `(char, count)` pairs; pop when count hits `k`.

## Edge cases

- Empty string → empty output.
- All distinct characters → output equals input.
- All same character (even length) → empty output.
- All same character (odd length) → one character left.

## Follow-ups

- **Track number of removals** — increment a counter on each pop.
- **Remove pairs but only if they're a specific pair (e.g. `(`, `)`)** — generalizes to balanced-parens validation.
- **K-runs variant** (LeetCode 1209) — same idea with `(char, count)` stack entries.
