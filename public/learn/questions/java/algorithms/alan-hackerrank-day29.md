# Day 29 — Bitwise AND (max under limit)

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Bit Manipulation

*Source:* `alan/hackerrank/day29.java`

## Solution

```java
import java.util.Scanner;

public class day29 {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] numbers = new int[n];
        int[] limits = new int[n];
        for (int i = 0; i < n; i++) {
            numbers[i] = in.nextInt();
            limits[i] = in.nextInt();
        }
        in.close();

        for (int i = 0; i < numbers.length; i++) {
            int number = numbers[i];
            int limit = limits[i];
            int maxLimitBitwise = getMaxLimitBitwise(number, limit);
            System.out.println(maxLimitBitwise);
        }
    }

    private static int getMaxLimitBitwise(int number, int limit) {
        int max = 0;
        for (int i = 1; i <=number; i++) {
            for (int j = i + 1; j <=number; j++) {
                int bitwise = i & j;
                if (bitwise > max && bitwise < limit) {
                    max = bitwise;
                }
            }
        }
        return max;
    }
}
```
