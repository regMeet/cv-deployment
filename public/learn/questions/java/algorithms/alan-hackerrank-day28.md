# Day 28 — RegEx & Patterns (filter Gmail users)

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Strings

*Source:* `alan/hackerrank/day28.java`

## Solution

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;

public class day28 {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);

        int n = in.nextInt();

        List<String> names = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            String name = in.next();
            String email = in.next();
            if (email.endsWith("@gmail.com")) {
                names.add(name);
            }
        }
        in.close();

        Collections.sort(names);
        for (String name : names) {
            System.out.println(name);
        }
    }

}
```
