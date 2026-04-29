# Breadth First Traversal

**Origin:** Amazon &nbsp;|&nbsp; **Topics:** Linked List, Queue, Tree / BST

*Source:* `alan/amazon/practice/BreadthFirstTraversal.java`

## Problem

importing the inbuilt java classes required for the program

## Solution

```java
//Iterative Queue based Java program to do level order traversal
//of Binary Tree

/* importing the inbuilt java classes required for the program */
import java.util.Queue;
import java.util.LinkedList;

public class BreadthFirstTraversal {
    public static void main(String args[]) {
        /*
         * creating a binary tree and entering
         * the nodes
         */
        BinaryTreeBST tree_level = new BinaryTreeBST();
        tree_level.root = new Node(1);
        tree_level.root.left = new Node(2);
        tree_level.root.right = new Node(3);
        tree_level.root.left.left = new Node(4);
        tree_level.root.left.right = new Node(5);

        System.out.println("Level order traversal of binary tree is - ");
        tree_level.printLevelOrder();
    }
}

/* Class to print Level Order Traversal */
class BinaryTreeBST {

    Node root;

    /*
     * Given a binary tree. Print its nodes in level order
     * using array for implementing queue
     */
    void printLevelOrder() {
        Queue<Node> queue = new LinkedList<Node>();
        queue.add(root);
        while (!queue.isEmpty()) {

            /*
             * poll() removes the present head.
             * For more information on poll() visit
             * http://www.tutorialspoint.com/java/util/linkedlist_poll.htm
             */
            Node tempNode = queue.poll();
            System.out.print(tempNode.data + " ");

            /* Enqueue left child */
            if (tempNode.left != null) {
                queue.add(tempNode.left);
            }

            /* Enqueue right child */
            if (tempNode.right != null) {
                queue.add(tempNode.right);
            }
        }
    }
}
```
