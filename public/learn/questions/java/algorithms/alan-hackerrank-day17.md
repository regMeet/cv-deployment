# Day 17 — More Exceptions (Calculator power)

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Design / OOP

*Source:* `alan/hackerrank/day17.java`

## Solution

```java
import java.util.Scanner;

public class day17 {

    public static void main(String[] argh) {
        Scanner in = new Scanner(System.in);
        int T = in.nextInt();
        while (T-- > 0) {
            int n = in.nextInt();
            int p = in.nextInt();
            Calculator2 myCalculator = new Calculator2();

            try {
                int ans = myCalculator.power(n, p);
                System.out.println(ans);

            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }

        in.close();
    }
}

class Calculator2 {
    public int power(int n, int p) {
        if (n < 0 || p < 0) {
            throw new IllegalArgumentException("n and p should be non-negative");
        }

        double pow = Math.pow(n, p);
        return (int) pow;
    }
}
```
