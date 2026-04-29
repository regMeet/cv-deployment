# Day 27 — Testing (generate test cases)

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Arrays

*Source:* `alan/hackerrank/day27.java`

## Solution

```java
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class day27 {

    // 5
    // 4 3
    // -1 -3 4 2
    // 4 2
    // 0 -1 2 1
    // 2 1
    // 1 2
    // 3 1
    // 1 2 0
    // 4 3
    // -1 0 2 1
    public static void main(String[] args) {
        System.out.println("5");

        System.out.println("4 4");
        System.out.println("-1 0 3 3");

        System.out.println("6 2");
        System.out.println("-1 0 1 2 3 2");

        System.out.println("7 4");
        System.out.println("-1 -2 0 3 3 9 6");

        System.out.println("3 2");
        System.out.println("-2 0 1");

        System.out.println("8 5");
        System.out.println("-2 -1 0 2 3 5 6 99");
    }

    public static void main2(String[] args) {
        Scanner in = new Scanner(System.in);

        int n = in.nextInt();

        List<ProfesorTestCase> testCases = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            int students = in.nextInt();
            int k = in.nextInt();

            int[] arrivals = new int[students];
            for (int j = 0; j < students; j++) {
                arrivals[j] = in.nextInt();
            }
            testCases.add(new ProfesorTestCase(k, arrivals));
        }

        in.close();

        for (ProfesorTestCase testCase : testCases) {
            int k = testCase.k;
            int count = 0;
            for (int i = 0; i < testCase.arrivals.length; i++) {
                int arrival = testCase.arrivals[i];
                if (arrival <= 0) {
                    count++;
                }
            }
            System.out.println(k > count ? "YES" : "NO");
        }

    }
}

class ProfesorTestCase {
    int k;
    int[] arrivals;

    public ProfesorTestCase(int k, int[] arrivals) {
        super();
        this.k = k;
        this.arrivals = arrivals;
    }

}
```
