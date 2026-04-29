# Test 1

**Origin:** Amazon &nbsp;|&nbsp; **Topics:** Hash Map, Arrays

*Source:* `anio2022/amazon/test1.java`

## Solution

```java
import java.io.*;
import java.math.*;
import java.security.*;
import java.text.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.regex.*;

public class test1 {

    public static int maxSetSize(List<Integer> riceBags) {
        // Map<Integer, Boolean> map = new HashMap<Integer, Boolean>();
        BitSet hash = new BitSet();

        // Write your code here
        return 0;
    }

    public int solution(int[] riceBags) {
        Map<Integer, Boolean> map = new HashMap<Integer, Boolean>();
        int max = -1;
        int maxNumber = 0;
        double sqrt = 0;

        for (int i : riceBags) {
            map.put(i, true);
            if (i > maxNumber) {
                maxNumber = i;
                sqrt = Math.sqrt(i);
            }
        }

        for (int i : riceBags) {
            System.out.println("i: " + i);
            int count = 0;
            int next = i;
            while (next <= maxNumber) {
                if (!map.containsKey(next)) {
                    break;
                }
                count++;
                next = next * next;
            }
            max = count > 1 && count > max ? count : max;

        }

        return max;
    }

    public static void main(String[] args) {
        System.out.println(new test1().solution(new int[] { 3, 9, 4, 2, 16 }));
    }

}
```
