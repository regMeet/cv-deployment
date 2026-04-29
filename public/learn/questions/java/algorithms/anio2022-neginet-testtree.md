# Test Tree

**Origin:** NegiNet &nbsp;|&nbsp; **Topics:** Hash Set, Arrays

*Source:* `anio2022/neginet/testTree.java`

## Solution

```java
import java.util.Arrays;
import java.util.Comparator;
import java.util.Set;
import java.util.TreeSet;

public class testTree {

    public static void main(String[] args) {
        TreeSet<Integer> set = new TreeSet<>();
        set.add(3);
        set.add(4);
        set.add(3);
        set.add(5);

        TreeSet<String> s = new TreeSet<>(new Comparator<String>() {
            @Override
            public int compare(String s1, String s2) {
                return s1.trim().compareTo(s2.trim());
            }
        });
        s.add("1");
        s.add(" 1");
        s.add("2 ");
        s.add("2");
        s.add(" 2 ");

        Arrays.toString(s.toArray()); // [ "1", "2"]
        System.out.println(s);
    }
}
```
