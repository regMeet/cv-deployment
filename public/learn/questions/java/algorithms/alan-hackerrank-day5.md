# Day 5 — Loops (multiplication table)

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Strings

*Source:* `alan/hackerrank/day5.java`

## Solution

```java
import java.util.Scanner;

public class day5 {

    private static final int TIMES = 10;
    private static final String format = "%d x %d = %d";

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();

        for (int i = 1; i <= TIMES; i++) {
            int m = n * i;
            System.out.println(String.format(format, n, i, m));
        }
        in.close();
    }
}
```
