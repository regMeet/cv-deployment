# Day 10 — Binary Numbers (longest run of 1s)

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Bit Manipulation, Strings

*Source:* `alan/hackerrank/day10.java`

## Solution

```java
import java.util.Scanner;

public class day10 {

    private static int countConsecutive1InBinaryNumber(String number) {
        int max = 0;

        int length = number.length();
        int count = 0;
        for (int i = 0; i < length; i++) {
            if (number.charAt(i) == '1') {
                count++;
                if (count > max) {
                    max = count;
                }
            } else {
                count = 0;
            }
        }

        return max;
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();

        String number = Integer.toBinaryString(n);
        int consecutiveNumbers = countConsecutive1InBinaryNumber(number);
        System.out.println(consecutiveNumbers);
        
        in.close();
    }
}
```
