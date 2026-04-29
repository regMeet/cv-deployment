# Day 9 — Recursion (factorial)

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Recursion / Backtracking

*Source:* `alan/hackerrank/day9.java`

## Problem

Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution.

## Solution

```java
import java.util.Scanner;

public class day9 {

    private static int factorial(int N) {
        if (N < 1) {
            return 1;
        } else {
            return N * factorial(N - 1);
        }
    }

    public static void main(String[] args) {
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution. */
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();

        System.out.println(factorial(n));
        in.close();
    }
}
```
