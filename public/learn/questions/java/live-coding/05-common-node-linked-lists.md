# Find the common node where two linked lists merge

> Two singly-linked lists may merge at some node and share the suffix. Return the merging node, or `null` if they don't meet. Bar: O(m + n) time, O(1) space.

## Clarifying questions

- Are the lists guaranteed acyclic?
- Do we know the lengths up front?
- Modify-in-place allowed, or strictly read-only?

## The two-pointer trick — O(m + n) time, O(1) space

```java
class Node {
    int  value;
    Node next;
}

public Node intersection(Node a, Node b) {
    if (a == null || b == null) return null;

    Node p = a;
    Node q = b;

    while (p != q) {
        p = (p == null) ? b : p.next;
        q = (q == null) ? a : q.next;
    }
    return p;   // either the merge node, or null if no intersection
}
```

Each pointer walks `m + n` nodes total. After hopping to the other list once, both pointers are aligned by length difference, so they meet exactly at the merge node. If there's no merge, both reach `null` simultaneously and the loop exits.

## Why it works (the clean intuition)

Let `m`, `n` be the lengths and `c` the shared suffix length. Path of `p`: `(m - c) + c + (n - c) = m + n - c`. Same for `q`. Both walk identical distances → they collide at the start of the shared suffix.

## Alternative — length-difference walk

```java
int la = length(a), lb = length(b);
while (la > lb) { a = a.next; la--; }
while (lb > la) { b = b.next; lb--; }
while (a != b)  { a = a.next; b = b.next; }
return a;
```

Same complexity, more code, but the logic is more obvious. Some interviewers prefer it for clarity.

## What NOT to do

- **HashSet of one list, scan the other** — O(m + n) time but O(m) space. Mention it as a baseline, then beat it.
- **Compare values** — wrong; we want the same NODE, not the same data.

## Edge cases

- Either list empty → return `null`.
- Lists are equal (same head) → return the head.
- No intersection → both pointers reach `null`, loop exits cleanly.

## Follow-ups

- **What if a list has a cycle?** Use Floyd's cycle detection first; the problem reduces to the cyclic version.
- **Both lists have cycles** — analyze whether the cycles are the same one.
