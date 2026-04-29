# Permutation Set

**Origin:** Codility &nbsp;|&nbsp; **Topics:** Hash Set, Strings

*Source:* `alan/codility/permutationSet.java`

## Solution

```java
import java.util.HashSet;
import java.util.Set;

public class permutationSet {
    private static int stack = 0;

    private static void permutation2(String prefix, String str, Set<String> permutations) {
        stack++;
        int n = str.length();
        if (n == 0) {
            permutations.add(prefix);
        } else {
            for (int i = 0; i < n; i++) {
                permutation2(prefix + str.charAt(i), str.substring(0, i) + str.substring(i + 1), permutations);
            }
        }
    }
    
    private static void permutation(String prefix, String str, Set<String> permutations) {
        stack++;
        int n = str.length();
        if (n == 2) {
            String x = prefix + str.charAt(0) + str.charAt(1);
            String y = prefix + str.charAt(1) + str.charAt(0);
            permutations.add(x);
            permutations.add(y);
            // System.out.println(x);
            // System.out.println(y);
        } else if (n == 0) {
            // System.out.println(prefix);
            permutations.add(prefix);
        } else if (n == 1) {
            String x = prefix + str.charAt(0);
            permutations.add(x);
            // System.out.println(x);
        } else {
            for (int i = 0; i < n; i++) {
                permutation(prefix + str.charAt(i), str.substring(0, i) + str.substring(i + 1), permutations);
            }
        }
    }

    public static Set<String> permutation(String str) {
        Set<String> permutations = new HashSet<String>();
        permutation("", str, permutations);
        return permutations;
    }
    
    public static Set<String> permutation2(String str) {
        Set<String> permutations = new HashSet<String>();
        permutation2("", str, permutations);
        return permutations;
    }

    public static Set<String> permutation(Integer number) {
        String str = number.toString();
        return permutation(str);
    }

    public static void main(String[] args) {
        long startTime = System.nanoTime();
        Set<String> permutations = permutation("abc");
        double duration = (System.nanoTime() - startTime) / 1e6;
        System.out.println("Duration time: " + duration + " milliseconds.");

        System.out.println();
        System.out.println("Permutations:");
        for (String permutation : permutations) {
            System.out.println(permutation);
        }
        System.out.println();
        System.out.println("Calls amount: " + stack);
    }

}
```
