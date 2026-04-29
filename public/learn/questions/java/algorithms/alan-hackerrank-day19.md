# Day 19 — Interfaces (divisor sum)

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Design / OOP

*Source:* `alan/hackerrank/day19.java`

## Solution

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;

public class day19 {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        int n = scan.nextInt();
        scan.close();

        AdvancedArithmetic myCalculator = new Calculator();
        int sum = myCalculator.divisorSum(n);
        System.out.println("I implemented: " + myCalculator.getClass().getInterfaces()[0].getName());
        System.out.println(sum);
    }

}

class Calculator implements AdvancedArithmetic {

    @Override
    public int divisorSum(int n) {
        int sum = 0;
        List<Integer> allFactors = getAllFactors(n);
        for (Integer factor : allFactors) {
            sum += factor;

        }
        return sum;
    }

    private List<Integer> getAllFactors(int a) {

        int upperlimit = (int) (Math.sqrt(a));
        List<Integer> factors = new ArrayList<Integer>();
        for (int i = 1; i <= upperlimit; i += 1) {
            if (a % i == 0) {
                factors.add(i);
                int division = a / i;
                if (i != division) {
                    factors.add(division);
                }
            }
        }
        Collections.sort(factors);
        return factors;
    }

}

interface AdvancedArithmetic {
    int divisorSum(int n);
}
```
