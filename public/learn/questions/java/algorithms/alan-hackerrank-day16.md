# Day 16 — Exceptions (String → Integer)

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Strings

*Source:* `alan/hackerrank/day16.java`

## Solution

```java
import java.util.Scanner;

public class day16 {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String S = in.next();

        try {
            Integer number = Integer.valueOf(S);
            System.out.println(number);
        } catch (NumberFormatException e) {
            System.out.println("Bad String");
        }

        in.close();
    }

}
```
