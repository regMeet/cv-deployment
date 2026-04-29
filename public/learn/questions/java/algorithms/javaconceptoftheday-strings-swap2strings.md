# Swap 2 Strings

**Origin:** JavaConceptOfTheDay &nbsp;|&nbsp; **Topics:** Strings

*Source:* `javaConceptOfTheDay/strings/Swap2Strings.java`

## Solution

```java
public class Swap2Strings {

    public static void swap2Strings(String s1, String s2) {
        System.out.println("Before Swapping :");

        System.out.println("s1 : " + s1);

        System.out.println("s2 : " + s2);

        // Swapping starts

        s1 = s1 + s2;

        s2 = s1.substring(0, s1.length() - s2.length());

        s1 = s1.substring(s2.length());

        // Swapping ends

        System.out.println("After Swapping :");

        System.out.println("s1 : " + s1);

        System.out.println("s2 : " + s2);
    }

    public static void main(String[] args) {
        swap2Strings("alan", "testing");
    }

}
```
