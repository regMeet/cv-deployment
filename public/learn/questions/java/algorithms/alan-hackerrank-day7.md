# Day 7 — Arrays (reverse)

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Arrays

*Source:* `alan/hackerrank/day7.java`

## Solution

```java
import java.util.Scanner;

public class day7 {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = in.nextInt();
        }
        in.close();

        for (int i = n - 1; i >= 0; i--) {
            System.out.print(arr[i] + " ");
        }
    }

}
```
