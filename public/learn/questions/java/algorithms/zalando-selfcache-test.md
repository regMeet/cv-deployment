# Test

**Origin:** Zalando &nbsp;|&nbsp; **Topics:** Hash Map

*Source:* `zalando/selfCache/test.java`

## Solution

```java
import java.util.Map.Entry;

public class test {

    private static final long TEN_SECONDS = 10 * 1000;
    private static final long ONE_SECOND = 1 * 1000;

    public static void main(String[] args) throws InterruptedException {
        SelfExpiringHashMap<String, Integer> turnos = new SelfExpiringHashMap<>(TEN_SECONDS);

        turnos.put("Alan", 3, 3 * ONE_SECOND);
        turnos.put("Mike", 10);
        turnos.put("Britos", 7, 7 * ONE_SECOND);

        for (int i = 0; !turnos.isEmpty(); i++) {
            System.out.println("Second number: " + i);
            for (Entry<String, Integer> entry : turnos.entrySet()) {
                System.out.print("Entry: " + entry.getKey() + " - Value: " + entry.getValue());
                System.out.println();
            }
            System.out.println("waiting another round");
            System.out.println();
            Thread.sleep(1000);
        }
    }

}
```
