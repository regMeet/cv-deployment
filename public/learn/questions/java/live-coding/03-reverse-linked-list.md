# Reverse a singly linked list

> Classic warm-up. The bar at senior level is doing it iteratively in O(1) extra space, then handling edge cases without thinking.

## Clarifying questions

- Singly or doubly linked?
- In-place mutation OK, or do we need to keep the original?
- Recursive solution acceptable, or strict O(1) space?

## Iterative solution — O(n) time, O(1) space

```java
class Node {
    int  value;
    Node next;
}

public Node reverse(Node head) {
    Node prev = null;
    Node cur  = head;

    while (cur != null) {
        Node nxt = cur.next;   // save before overwriting
        cur.next = prev;       // flip pointer
        prev     = cur;
        cur      = nxt;
    }
    return prev;               // new head
}
```

The trick is the four-line dance: capture `next` first, then re-point, then advance both `prev` and `cur`. Lose the order and you orphan the rest of the list.

## Recursive solution

```java
public Node reverseRec(Node head) {
    if (head == null || head.next == null) return head;
    Node newHead   = reverseRec(head.next);
    head.next.next = head;     // make the next node point back
    head.next      = null;     // detach old forward link
    return newHead;
}
```

Elegant, but O(n) stack space — on a 1M-node list this blows the stack. **In an interview, write the iterative one first**, then mention recursion as an alternative.

## Edge cases to mention out loud

- `head == null` → return null.
- Single node → return head unchanged.
- Two nodes → covered by the loop (most off-by-one bugs hide here).

## Follow-ups

- **Reverse in groups of k** (LeetCode 25) — same idea, applied per chunk.
- **Reverse between positions m and n** — split, reverse middle, splice back.
- **Doubly linked list** — also swap `prev` on every node.
