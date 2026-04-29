# Top 10 Report

**Origin:** NegiNet &nbsp;|&nbsp; **Topics:** Hash Map, Linked List, Queue

*Source:* `anio2022/neginet/util/Top10Report.java`

## Solution

```java
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;

public class Top10Report {
    private final Map<String, Integer> names = new HashMap<>();

    public int addName(String name) {
        Integer count = names.get(name);
        int newCount = count != null ? count + 1 : 1;

        if (count != null) {
            names.put(name, newCount);
        } else {
            names.put(name, newCount);
        }
        return newCount;
    }

    public int getSize() {
        return names.size();
    }

    public List<NameCount> getTopTen() {
        final int N = 10;

        PriorityQueue<NameCount> pq = new PriorityQueue<>(N, Comparator.comparingInt(NameCount::getCount));

        names.forEach((name, count) -> {
            if (pq.size() < N) {
                pq.add(new NameCount(name, count));
            } else if (count > pq.peek().getCount()) {
                // comparator in constructor makes sure peek will have the smallest count
                pq.poll();
                pq.add(new NameCount(name, count));
            }
        });

        // pq is ordered, but not sorted, pulling value from heap will always return the smallest
        LinkedList<NameCount> topN = new LinkedList<>();
        while (!pq.isEmpty()) {
            NameCount o = pq.poll();
            topN.addFirst(o);
        }

        return topN;
    }

}
```
