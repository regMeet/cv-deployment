# Day 15 — Linked List (insert + display)

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Linked List

*Source:* `alan/hackerrank/day15.java`

## Solution

```java
import java.util.Scanner;

public class day15 {

    public static Node2 insert(Node2 head, int data) {
        Node2 nextNode = new Node2(data);

        if (head == null) {
            head = nextNode;
        } else {
            Node2 temp = head;
            while (temp.next != null) {
                temp = temp.next;
            }
            temp.next = nextNode;
        }

        return head;
    }

    public static void display(Node2 head) {
        Node2 start = head;
        while (start != null) {
            System.out.print(start.data + " ");
            start = start.next;
        }
    }

    public static void main(String args[]) {
        Scanner sc = new Scanner(System.in);
        Node2 head = null;
        int N = sc.nextInt();

        while (N-- > 0) {
            int ele = sc.nextInt();
            head = insert(head, ele);
        }
        display(head);
        sc.close();
    }
}

class Node2 {
    int data;
    Node2 next;

    Node2(int d) {
        data = d;
        next = null;
    }
}
```
