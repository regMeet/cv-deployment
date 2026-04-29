# Day 21 — Generics (printArray)

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Design / OOP

*Source:* `alan/hackerrank/day21.java`

## Solution

```java
public class day21 {

    public static void main(String args[]) {
        Integer[] intArray = { 1, 2, 3 };
        String[] stringArray = { "Hello", "World" };

        printArray(intArray);
        printArray(stringArray);

        if (Solution.class.getDeclaredMethods().length > 2) {
            System.out.println("You should only have 1 method named printArray.");
        }
    }

    private static void printArray(Object[] a) {
        for (Object object : a) {
            System.out.println(object);
        }
    }

}
```
