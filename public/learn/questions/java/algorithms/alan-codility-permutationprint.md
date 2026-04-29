# Permutation Print

**Origin:** Codility &nbsp;|&nbsp; **Topics:** Strings

*Source:* `alan/codility/PermutationPrint.java`

## Solution

```java
public class PermutationPrint {

    private static int stack = 0;

    private static void permutation(String prefix, String str) {
        stack++;
        int n = str.length();
        if (n == 2) {
            System.out.println(prefix + str.charAt(0) + str.charAt(1));
            System.out.println(prefix + str.charAt(1) + str.charAt(0));
        } else if (n == 0) {
            System.out.println(prefix);
        } else if (n == 1) {
            System.out.println(prefix + str.charAt(0));
        } else {
            for (int i = 0; i < n; i++) {
                permutation(prefix + str.charAt(i), str.substring(0, i) + str.substring(i + 1));
            }
        }
    }

    public static void permutation(String str) {
        permutation("", str);
    }

    public static void permutation(Integer number) {
        String str = number.toString();
        permutation(str);
    }

    public static void main(String[] args) {
        permutation(1234);
        System.out.println(stack);
    }

}
```
