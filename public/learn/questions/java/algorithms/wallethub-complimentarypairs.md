# Complimentary Pairs

**Origin:** WalletHub &nbsp;|&nbsp; **Topics:** Hash Set, Arrays

*Source:* `walletHub/ComplimentaryPairs.java`

## Problem

Write an efficient algorithm to find K-complementary pairs in a given array of integers. Given Array A, pair (i, j) is K- complementary if K = A[i] + A[j];

@author Alan

## Solution

```java
import java.util.BitSet;
import java.util.HashSet;
import java.util.Set;

/**
 * Write an efficient algorithm to find K-complementary pairs in a given array of integers. Given Array A, pair (i, j) is K- complementary if K = A[i] + A[j];
 * 
 * @author Alan
 *
 */

public class ComplimentaryPairs {

    private static Set<String> getComplimentaryPairs(int sum, int[] numbers) {
        Set<String> pairs = new HashSet<String>();
        BitSet hash = new BitSet(numbers.length);

        for (int number : numbers) {
            hash.set(number);
        }

        for (int number : numbers) {
            int pair = sum - number;
            if (pair >= 0 && hash.get(pair)) {
                String newPair;

                // Added this logic to remove duplicate pairs.
                if (number < pair) {
                    newPair = number + " + " + pair;
                } else {
                    newPair = pair + " + " + number;
                }

                pairs.add(newPair);
            }

        }

        return pairs;
    }

    public static void main(String[] args) {
        int sum = 7;
        int[] numbers = new int[] { 1, 1, 9, 8, 6, 0, 5, 2, 7, 3, 4 };

        Set<String> pairs = getComplimentaryPairs(sum, numbers);

        System.out.println("Pairs: K = i + j");
        for (String pair : pairs) {
            System.out.println(sum + "= " + pair);
        }
    }
}
```
