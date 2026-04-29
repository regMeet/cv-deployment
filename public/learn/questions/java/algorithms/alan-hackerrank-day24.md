# Day 24 — Linked List (remove duplicates)

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Linked List, Hash Set

*Source:* `alan/hackerrank/day24.java`

## Solution

```java
import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

public class day24 {

    public static Node2 removeDuplicates(Node2 head) {
        Set<Integer> values = new HashSet<>();

        Node2 previous = null;
        Node2 tmp = head;
        while (tmp != null) {
            if (values.contains(tmp.data)) {
                tmp = tmp.next;
                previous.next = tmp;
            } else {
                values.add(tmp.data);
                previous = tmp;
                tmp = tmp.next;
            }
        }

        return head;
    }

    public static Node2 insert(Node2 head, int data) {
        Node2 p = new Node2(data);
        if (head == null)
            head = p;
        else if (head.next == null)
            head.next = p;
        else {
            Node2 start = head;
            while (start.next != null)
                start = start.next;
            start.next = p;

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
        int T = sc.nextInt();
        while (T-- > 0) {
            int ele = sc.nextInt();
            head = insert(head, ele);
        }
        head = removeDuplicates(head);
        display(head);

        sc.close();
    }
}
```
