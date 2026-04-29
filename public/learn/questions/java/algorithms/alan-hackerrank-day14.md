# Day 14 — Scope (max array difference)

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Arrays

*Source:* `alan/hackerrank/day14.java`

## Solution

```java
import java.util.Arrays;
import java.util.Scanner;

public class day14 {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) {
            a[i] = sc.nextInt();
        }
        sc.close();

        Difference difference = new Difference(a);

        difference.computeDifference();

        System.out.print(difference.maximumDifference);
    }
}

class Difference {
    private int[] elements;
    public int maximumDifference;

    public Difference(int[] a) {
        this.elements = a;
    }

    public void computeDifference() {
        int max = 1;
        int min = 100;
        for (int number : elements) {
            if (number > max) {
                max = number;
            }
            if (number < min) {
                min = number;
            }

        }
        this.maximumDifference = max - min;

    }

    public void computeDifference2() {
        Arrays.sort(elements);
        this.maximumDifference = Math.abs(elements[elements.length - 1] - elements[0]);
    }

}
```
