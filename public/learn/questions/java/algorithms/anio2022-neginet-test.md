# Test

**Origin:** NegiNet &nbsp;|&nbsp; **Topics:** Misc

*Source:* `anio2022/neginet/test.java`

## Solution

```java
import anio2022.neginet.util.PeopleNameInsights;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

public class test {
    public static void main(String[] args) throws IOException {
        long startTime = System.nanoTime();
        PeopleNameInsights test = new PeopleNameInsights();

        System.out.println(System.getProperty("user.dir"));
        String fileName = "src/main/java/anio2022/neginet/data/coding-test-data.txt";
//        String fileName = "src/main/java/anio2022/neginet/data/data-test.txt";
        test.readFile(fileName);
        test.printReport();
        long duration = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTime);
        System.out.println();
        System.out.println("Total time: " + duration + "ms");
    }
}
```
