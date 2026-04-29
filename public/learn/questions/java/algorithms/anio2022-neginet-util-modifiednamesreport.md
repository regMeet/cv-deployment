# Modified Names Report

**Origin:** NegiNet &nbsp;|&nbsp; **Topics:** Misc

*Source:* `anio2022/neginet/util/ModifiedNamesReport.java`

## Problem

Creates modified names, consisting with unique N first lastNames and N first firstNames and mixing them together.

## Solution

```java
import java.util.ArrayList;
import java.util.List;

/**
 * Creates modified names, consisting with unique N first lastNames and N first firstNames and mixing them together.
 */
public class ModifiedNamesReport {
    private final static int MAX_NUMBER_NAMES = 25;
    private final int maxNumberNames;
    private final List<String> firstNames = new ArrayList<>();
    private final List<String> lastNames = new ArrayList<>();

    public ModifiedNamesReport() {
        maxNumberNames = MAX_NUMBER_NAMES;
    }

    public ModifiedNamesReport(int maxNumberNames) {
        this.maxNumberNames = maxNumberNames;
    }

    public void addNames(String firstName, String lastName) {
        if (firstNames.size() < maxNumberNames) {
            firstNames.add(firstName);
            lastNames.add(lastName);
        }
    }

    public List<String> getModifiedNames() {
        List<String> list = new ArrayList<>();
        int size = firstNames.size();
        for (int i = 0; i < size; i++) {
            String s1 = firstNames.get(i);
            String s2 = lastNames.get((i + 1) % size);
            list.add(s1 + " " + s2);
        }
        return list;
    }
}
```
