# Day 3 — Conditional Statements (Weird)

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Misc

*Source:* `alan/hackerrank/day3.java`

## Solution

```java
import java.util.Scanner;

public class day3 {

    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        int n = scan.nextInt();
        scan.close();
        String ans = "";

        // if 'n' is NOT evenly divisible by 2 (i.e.: n is odd)
        if (n % 2 == 1) {
            ans = "Weird";
        } else {
            // If is even and in the inclusive range of 2 to 5, print Not Weird
            // If is even and in the inclusive range of 6 to 20, print Weird
            // If is even and greater than 20, print Not Weird
            if (n >= 2 && n <= 5) {
                ans = "Not Weird";
            } else if (n >= 6 && n <= 20) {
                ans = "Weird";
            } else if (n > 20) {
                ans = "Not Weird";
            } else {
                ans = "Weird";
            }
        }
        System.out.println(ans);
    }
}
```
