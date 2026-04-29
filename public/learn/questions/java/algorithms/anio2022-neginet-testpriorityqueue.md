# Test Priority Queue

**Origin:** NegiNet &nbsp;|&nbsp; **Topics:** Queue, Heap / PQ

*Source:* `anio2022/neginet/testPriorityQueue.java`

## Solution

```java
import java.util.PriorityQueue;

public class testPriorityQueue {

    public static void main2(String[] args) {

    }

    public static void main(String[] args) {
        PriorityQueue<String> pq = new PriorityQueue<String>();
        pq.add("2");
        pq.add("4");
        System.out.println(pq); //prints [2, 4]
        pq.offer("1");
        System.out.println(pq); // prints [1, 4, 2]
        pq.add("3");
        System.out.println(pq); // prints [1, 3, 2, 4]

        while(!pq.isEmpty()) {
            String s = pq.poll();
            System.out.println(s);
        }
//        Iterator value = pq.iterator();
//        // Displaying the values after iterating through the queue
//        System.out.println("The iterator values are: ");
//        while (value.hasNext()) {
//            System.out.println(value.next());
//        }

    }
}
```
