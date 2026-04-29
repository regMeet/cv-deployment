# Day 23 — BST Level-Order Traversal

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Tree / BST, Queue

*Source:* `alan/hackerrank/day23.java`

## Solution

```java
import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

public class day23 {

    static void levelOrder(Node root) {
        Queue<Node> level = new LinkedList<>();
        level.add(root);
        while (!level.isEmpty()) {
            Node node = level.poll();
            System.out.print(node.data + " ");
            if (node.left != null)
                level.add(node.left);
            if (node.right != null)
                level.add(node.right);
        }
    }
    // TODO: imprimir los otras formas de un arbol, preorder, postorder, inorder, por nivel

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
        levelOrder(root);
        
        sc.close();
    }
}
```
