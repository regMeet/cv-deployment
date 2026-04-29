# Test 2

**Origin:** Other &nbsp;|&nbsp; **Topics:** Sorting

*Source:* `test2.java`

## Solution

```java
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

public class test2 {

    private int getLongestQuasiConstantSubsecuence(int[] array) {
        int max = 0;

        if (array.length <= 1) {
            return max;
        }

        System.out.println("original: " + Arrays.toString(array));
        Arrays.sort(array);

        // it's being sorted so it could be inserted into a map and iterate it in order
        System.out.println("sorted:   " + Arrays.toString(array));

        Map<Integer, Integer> map = new LinkedHashMap<>();
        for (int currentNumber : array) {
            Integer times = map.get(currentNumber);
            if (times == null) {
                times = 0;
            }

            map.put(currentNumber, times + 1);
        }

        int currentMax = 0;
        for (int currentNumber : map.keySet()) {
            Integer currentNumberTimes = map.get(currentNumber);

            // System.out.println("number: " + currentNumber + " currentNumberTimes: " + currentNumberTimes);

            int nextNumber = currentNumber + 1;
            Integer nextNumberTimes = map.get(nextNumber);
            // System.out.println("nextNumber: " + nextNumber + " times: " + nextNumberTimes);

            if (nextNumberTimes != null) {
                currentMax = currentNumberTimes + nextNumberTimes;
            } else {
                currentMax = currentNumberTimes;
            }
            System.out.println("currentMax: " + currentMax + " currentNumber: " + currentNumber + " nextNumber " + nextNumber);

            max = Math.max(max, currentMax);
        }

        return max;
    }

    public static void main(String[] args) {
        test2 test2 = new test2();

        System.out.println("longestQuasiConstantSubsecuence: " + test2.getLongestQuasiConstantSubsecuence(new int[] { 6, 10, 6, 9, 7, 8 }));
        System.out.println();

        System.out.println("longestQuasiConstantSubsecuence: " + test2.getLongestQuasiConstantSubsecuence(new int[] { 6, 5, 3, 1, 11, 9, 9, 6, 9, 7 }));
        System.out.println();

    }

    private int getLongestQuasiConstantSubsecuence2(int[] a) {
        int max = 0;

        if (a.length <= 1) {
            return max;
        }

        System.out.println("original: " + Arrays.toString(a));
        Arrays.sort(a);

        System.out.println("sorted:   " + Arrays.toString(a));

        int lastNumber = a[0];
        int sum = 1;
        for (int i = 1; i < a.length; i++) {

            int currentNumber = a[i];
            if (currentNumber == lastNumber) {
                sum++;
            } else {
                int diff = Math.abs(currentNumber - lastNumber);

                System.out.println(diff);
                if (diff == 1) {
                    sum++;
                } else {

                }
            }
            max = Math.max(max, sum);

        }

        System.out.println("result:   " + Arrays.toString(a));
        return max;
    }

}
```
