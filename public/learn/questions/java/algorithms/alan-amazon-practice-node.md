# Node

**Origin:** Amazon &nbsp;|&nbsp; **Topics:** Linked List

*Source:* `alan/amazon/practice/Node.java`

## Problem

Class containing left and right child of current
node and key value

## Solution

```java
public class Node {
    int data;
    Node left, right;

    public Node(int item) {
        data = item;
        left = right = null;
    }
}
```
