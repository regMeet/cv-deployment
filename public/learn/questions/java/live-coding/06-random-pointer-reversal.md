# Reverse a linked list with `next` and `random` pointers

> Each node has two pointers: `next` and `random`. `random` points to any node in the list (or `null`); no two `random`s target the same node. Reverse the direction of BOTH pointers — meaning, after the operation, `next` runs the list backwards, and if `A.random == B` originally, then `B.random == A` afterward. Constraint: O(1) extra space.

## Clarifying questions

- "Reverse `random`" means flip its target (`A→B` becomes `B→A`), correct?
- Is the input guaranteed acyclic via `next`? (Cycles via `random` are inherent to the problem.)
- Hashmap allowed? If yes, the problem becomes much simpler (and it's worth pricing both options).

## Step 1 — Reverse `next` (classic, O(1) space)

```java
class Node {
    int  value;
    Node next;
    Node random;
}

private Node reverseNext(Node head) {
    Node prev = null, cur = head;
    while (cur != null) {
        Node nxt = cur.next;
        cur.next = prev;
        prev     = cur;
        cur      = nxt;
    }
    return prev;
}
```

## Step 2 — Reverse `random`

The constraint **"no two `random`s point to the same node"** means each node is the target of at most one incoming `random`. So the inverse map is well-defined: there's exactly one node whose new `random` should be each given node.

### Variant A — HashMap, O(n) space (write this first)

```java
public Node reverse(Node head) {
    head = reverseNext(head);

    // Map<target, source> — the node whose old random was target
    Map<Node, Node> incoming = new IdentityHashMap<>();
    for (Node n = head; n != null; n = n.next) {
        if (n.random != null) incoming.put(n.random, n);
    }
    for (Node n = head; n != null; n = n.next) {
        n.random = incoming.get(n);   // null if nobody pointed at n
    }
    return head;
}
```

Two clean linear passes. **Use this in the interview unless O(1) space is hard-required** — the O(1) version is fragile and not worth the time pressure.

### Variant B — O(1) space (mention if asked)

Trick: walk the list twice, using the existing `random` pointers themselves as scratch.

1. **Pass 1** — for each node `X` with `X.random == Y`, link the pair into a temporary structure: temporarily set `Y.random` to `X` AFTER saving `Y`'s original random somewhere we can recover it. The standard trick is to chain through the `next` field of nodes that have already had their `next` reversed in step 1, but it gets thorny.
2. **Pass 2** — clean up.

In practice this is a 30-line implementation that's easy to get wrong on a whiteboard. **State that you know it's possible, sketch the idea, default to Variant A for clarity.**

## Edge cases

- `head == null` → return null.
- All `random`s are null → after reversal they should all stay null. Variant A handles this naturally (the map is empty).
- A node whose `random` points to itself → after reversal, still points to itself.
- Single node → `next` reversal trivial; `random` either null or self-pointing, both unchanged.

## What this question is really testing

- Do you know the list-reversal pattern in O(1) space cold.
- Do you recognize that **"no two randoms target the same node"** is what makes the inverse a function (not a multimap).
- Can you trade memory for clarity without being asked, and articulate the trade-off.

## Follow-ups

- **Drop the uniqueness constraint** — now multiple `random`s can target the same node. The "reversal" is no longer well-defined; ask the interviewer how to disambiguate (pick first occurrence? union into a list?).
- **Deep-clone the list** (LeetCode 138) — same `random`-pointer model, different op. The interleave-then-split trick achieves O(1) extra space cleanly there.
