# Circular Prime

**Origin:** Toptal &nbsp;|&nbsp; **Topics:** Math / Number Theory, Strings

*Source:* `alan/toptal/tt2016b/CircularPrime.java`

## Problem

A Circular Prime is a prime number that remains prime under cyclic shifts of its digits. When the leftmost digit is removed
and replaced at the end of the remaining string of digits, the generated number is still prime. The process is repeated until
the original number is reached again. A number is said to be prime if it has only two factors I and itself.

Example:
131
311
113
Hence, 131 is a circular prime.

Test your program with the sample data and some random data:

Example 1

INPUT :N = 197
OUTPUT:
197
971
719
197 IS A CIRCULAR PRIME

Example 2

INPUT :N = 1193
OUTPUT:
1193
1931
9311
3119
1193 IS A CIRCULAR PRIME

Example 3

INPUT :N = 29
OUTPUT:
29
92
29 IS NOT A CIRCULAR PRIME

## Solution

```java
import java.util.ArrayList;
import java.util.List;

/**
 * A Circular Prime is a prime number that remains prime under cyclic shifts of its digits. When the leftmost digit is removed
 * and replaced at the end of the remaining string of digits, the generated number is still prime. The process is repeated until
 * the original number is reached again. A number is said to be prime if it has only two factors I and itself.
 * 
 * Example:
 * 131
 * 311
 * 113
 * Hence, 131 is a circular prime.
 * 
 * Test your program with the sample data and some random data:
 * 
 * Example 1
 * 
 * INPUT :N = 197
 * OUTPUT:
 * 197
 * 971
 * 719
 * 197 IS A CIRCULAR PRIME
 * 
 * Example 2
 * 
 * INPUT :N = 1193
 * OUTPUT:
 * 1193
 * 1931
 * 9311
 * 3119
 * 1193 IS A CIRCULAR PRIME
 * 
 * Example 3
 * 
 * INPUT :N = 29
 * OUTPUT:
 * 29
 * 92
 * 29 IS NOT A CIRCULAR PRIME
 * 
 */
public class CircularPrime {

    public int printCircularPrime(int N) {
        int count = 0;
        for (int i = 2; i < N; i++) {
            boolean circularPrime = isCircularPrime(i);
            if (circularPrime) {
                count++;
            }
        }
        return count;
    }

    private boolean isCircularPrime(int N) {
        List<Integer> numbers = getRotations(N);

        boolean isCircular = true;
        for (Integer number : numbers) {
            boolean isPrime = isPrime(number);
            if (!isPrime) {
                isCircular = false;
                break;
            }
        }
        return isCircular;

    }

    private static boolean isPrime(Integer N) {
        int sqrt = (int) Math.sqrt(N);

        boolean isPrime = true;
        for (int i = 2; i <= sqrt; i++) {
            if (N % i == 0) {
                isPrime = false;
                break;
            }
        }

        return isPrime;
    }

    private static List<Integer> getRotations(int number) {
        List<Integer> rotations = new ArrayList<Integer>();

        String sNumber = String.valueOf(number);

        int length = sNumber.length();
        for (int i = 0; i < length; i++) {
            String sCircularPrime = sNumber.substring(i, length) + sNumber.substring(0, i);
            rotations.add(Integer.parseInt(sCircularPrime));
        }

        return rotations;
    }

    public static void main(String[] args) {
        int amountOfCircularPrimes = new CircularPrime().printCircularPrime(1000000);
        System.out.println(amountOfCircularPrimes);

        // List<Integer> rotatedNumbers = getRotatedNumbers(219);
        // System.out.println(rotatedNumbers);
        //
        // List<Integer> rotatedNumbers2 = getRotations(219);
        // System.out.println(rotatedNumbers2);
    }

}
```
