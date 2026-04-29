# Prime

**Origin:** Personal &nbsp;|&nbsp; **Topics:** Math / Number Theory

*Source:* `alan/newest/Prime.java`

## Solution

```java
import java.util.ArrayList;

public class Prime {

    public static boolean isPrime(long n) {
        int checks = 0;

        // check lower boundaries on primality
        if (n == 2) {
            return true;
        } // 1 is not prime, even numbers > 2 are not prime
        else if (n < 2 || (n % 2) == 0) {
            return false;
        }

        boolean isPrime = true;
        double sqrt = Math.sqrt(n);
        // Check for primality using odd numbers from 3 to sqrt(n)
        for (int i = 3; i <= sqrt; i += 2) {
            checks++;
            // n is not prime if it is evenly divisible by some 'i' in this range
            if (n % i == 0) {
                isPrime = false;
                break;
            }
        }

        System.out.println("checks: " + checks);
        return isPrime;
    }

    // it would be better to divide for already calculated primes
    public boolean isPrime(int i, ArrayList<Integer> primeNumbers) {
        if (!primeNumbers.isEmpty()) {

        }

        return false;
    }

    public int countPrimes(int number) {
        int count = 0;

        for (int i = 2; i <= number; i++) {
            if (isPrime(i)) {
                System.out.println(i + " is prime.");
                count++;
            }
        }

        return count;
    }

    public static void main(String[] args) {
        Prime p = new Prime();
        int count = p.countPrimes(9542);
        System.out.println("Amount of primes: " + count);

        // boolean prime = p.isPrime(7056);
        // System.out.println(prime);
    }

}
```
