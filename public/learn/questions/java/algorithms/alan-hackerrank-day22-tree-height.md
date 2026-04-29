# Day 22 — Binary Search Trees (height)

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Tree / BST, Recursion / Backtracking

*Source:* `alan/hackerrank/day22_Tree_Height.java`

## Solution

```java
import java.util.Scanner;

public class day22_Tree_Height {

    public static int getHeight(Node node) {
        if (node == null) {
            return -1;
        } else {
            return Math.max(getHeight(node.left), getHeight(node.right)) + 1;
        }
    }

    public static Node insert(Node root, int data) {
        if (root == null) {
            return new Node(data);
        } else {
            Node cur;
            if (data <= root.data) {
                cur = insert(root.left, data);
                root.left = cur;
            } else {
                cur = insert(root.right, data);
                root.right = cur;
            }
            return root;
        }
    }

    public static void main(String args[]) {
        Scanner sc = new Scanner(System.in);
        int T = sc.nextInt();
        Node root = null;
        while (T-- > 0) {
            int data = sc.nextInt();
            root = insert(root, data);
        }
        int height = getHeight(root);
        System.out.println(height);

        sc.close();
    }
}

class Node {
    Node left, right;
    int data;

    Node(int data) {
        this.data = data;
        left = right = null;
    }
}
```
