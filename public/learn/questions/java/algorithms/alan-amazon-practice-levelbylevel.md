# Level By Level

**Origin:** Amazon &nbsp;|&nbsp; **Topics:** Tree / BST, Recursion / Backtracking

*Source:* `alan/amazon/practice/LevelByLevel.java`

## Problem

Driver program to test above functions

## Solution

```java
//http://www.geeksforgeeks.org/level-order-tree-traversal/
public class LevelByLevel {
    /* Driver program to test above functions */
    public static void main(String args[]) {
        BinaryTree tree = new BinaryTree();
        tree.root = new Node(1);
        tree.root.left = new Node(2);
        tree.root.right = new Node(3);
        tree.root.left.left = new Node(4);
        tree.root.left.right = new Node(5);

        System.out.println("Level order traversal of binary tree is ");
        tree.printLevelOrder();
        
        BinaryTree tree2 = new BinaryTree();
        tree2.root = new Node(1);
        System.out.println();
        System.out.println(tree2.getHeight());
    }

}
// Recursive Java program for level order traversal of Binary Tree

class BinaryTree {
    // Root of the Binary Tree
    Node root;

    public BinaryTree() {
        root = null;
    }

    /* function to print level order traversal of tree */
    void printLevelOrder() {
        int h = getHeight();
        for (int i = 0; i <= h; i++) {
            printGivenLevel(root, i);
        }
    }

    int getHeight() {
        return getHeight(root);
    }

    /*
     * Compute the "height" of a tree -- the number of
     * nodes along the longest path from the root node
     * down to the farthest leaf node.
     */
    int getHeight(Node root) {
        if (root == null)
            return 0;
        else {
            /* compute height of each subtree */
            int lheight = getHeight(root.left);
            int rheight = getHeight(root.right);

            return Math.max(lheight, rheight) + 1;
            /* use the larger one */
            // if (lheight > rheight)
            // return (lheight + 1);
            // else
            // return (rheight + 1);
        }
    }

    /* Print nodes at the given level */
    void printGivenLevel(Node root, int level) {
        if (root == null)
            return;
        if (level == 1)
            System.out.print(root.data + " ");
        else if (level > 1) {
            printGivenLevel(root.left, level - 1);
            printGivenLevel(root.right, level - 1);
        }
    }
}
```
