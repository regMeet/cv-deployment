# Person

**Origin:** Adyen &nbsp;|&nbsp; **Topics:** Binary Search

*Source:* `anio2022/adyen/binarysearch/Person.java`

## Solution

```java
import lombok.Data;
import lombok.Setter;
import lombok.ToString;
import lombok.Getter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class Person implements Comparable<Person> {
    private String name;
    private int age;

    @Override
    public int compareTo(Person p) {
        return age - p.age;
    }

    public int compareName(Person p) {
        return name.compareTo(p.name);
    }
}
```
