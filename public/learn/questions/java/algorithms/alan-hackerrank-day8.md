# Day 8 — Dictionaries and Maps (phone book)

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Hash Map

*Source:* `alan/hackerrank/day8.java`

## Solution

```java
import java.util.HashMap;
import java.util.Scanner;

public class day8 {
    private static final String format = "%s=%d";

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);

        HashMap<String, Integer> phoneBook = new HashMap<>();

        int n = in.nextInt();
        for (int i = 0; i < n; i++) {
            String name = in.next();
            int phone = in.nextInt();
            phoneBook.put(name, phone);
        }

        while (in.hasNext()) {
            String s = in.next();

            // Write code here
            Integer number = phoneBook.get(s);
            if (number != null) {
                System.out.println(String.format(format, s, number));
            } else {
                System.out.println("Not found");
            }
        }
        in.close();
    }
}
```
