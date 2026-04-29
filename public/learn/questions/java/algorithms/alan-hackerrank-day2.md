# Day 2 — Operators

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Strings

*Source:* `alan/hackerrank/day2.java`

## Solution

```java
import java.util.Scanner;

public class day2 {

    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        double mealCost = scan.nextDouble(); // original meal price
        int tipPercent = scan.nextInt(); // tip percentage
        int taxPercent = scan.nextInt(); // tax percentage
        scan.close();

        // Write your calculation code here.
        double tip = mealCost * tipPercent / 100;
        double tax = mealCost * taxPercent / 100;

        // cast the result of the rounding operation to an int and save it as totalCost
        int totalCost = (int) Math.round(mealCost + tip + tax);

        // Print your result
        String print = String.format("The total meal cost is %d dollars.", totalCost);
        System.out.println(print);
    }
}
```
