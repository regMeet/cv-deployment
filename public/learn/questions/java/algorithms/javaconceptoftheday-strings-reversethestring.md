# Reverse The String

**Origin:** JavaConceptOfTheDay &nbsp;|&nbsp; **Topics:** Recursion / Backtracking

*Source:* `javaConceptOfTheDay/strings/ReverseTheString.java`

## Solution

```java
public class ReverseTheString {

    public static void main(String[] args) {
        String str = "MyJava";

        // 1. Using StringBuffer Class

        StringBuffer sbf = new StringBuffer(str);

        System.out.println(sbf.reverse()); // Output : avaJyM

        // 2. Using iterative method

        iterativeMethod(str);

        System.out.println();

        // 3. Using Recursive Method

        System.out.println(recursiveMethod(str)); // Output : avaJyM
    }

    private static void iterativeMethod(String str) {
        char[] strArray = str.toCharArray();

        for (int i = strArray.length - 1; i >= 0; i--) {
            System.out.print(strArray[i]); // Output : avaJyM
        }
    }

    // Recursive method to reverse string

    static String recursiveMethod(String str) {
        if ((null == str) || (str.length() <= 1)) {
            return str;
        }

        return recursiveMethod(str.substring(1)) + str.charAt(0);
    }
}
```
