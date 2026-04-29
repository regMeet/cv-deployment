# Day 25 — Running Time & Complexity (Primes)

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Math / Number Theory

*Source:* `alan/hackerrank/day25_Primes.java`

## Problem

Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution.

## Solution

```java
import java.util.Scanner;

public class day25_Primes {

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

    public static boolean isPrimeBest(int n) {
        int count = 0;
        // check lower boundaries on primality
        if (n == 2) {
            printStats(++count, n, true);
            return true;
        } // 1 is not prime, even numbers > 2 are not prime
        else if (n == 1 || (n & 1) == 0) {
            printStats(++count, n, false);
            return false;
        }

        // Check for primality using odd numbers from 3 to sqrt(n)
        for (int i = 3; i <= Math.sqrt(n); i += 2) {
            count++;
            // n is not prime if it is evenly divisible by some 'i' in this range
            if (n % i == 0) {
                printStats(++count, n, false);
                return false;
            }
        }
        // n is prime
        printStats(count, n, true);
        return true;
    }

    private static void printStats(int count, int n, boolean isPrime) {
        String caller = Thread.currentThread().getStackTrace()[2].getMethodName();
        System.err.println(caller + " performed " + count + " checks, determined " + n + ((isPrime) ? " is PRIME." : " is NOT PRIME."));
    }

    public static void main2(String[] args) {
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution. */

        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        long[] arr = new long[n];
        for (int i = 0; i < n; i++) {
            arr[i] = in.nextInt();
        }
        in.close();

        for (long i : arr) {
            boolean isPrime = day25_Primes.isPrime(i);
            if (isPrime) {
                System.out.println("Prime");
            } else {
                System.out.println("Not prime");
            }
        }
    }

    public static void main(String[] args) {
        int n = 2147483647;

        boolean prime = day25_Primes.isPrime(n);
        System.out.println(prime);

        day25_Primes.isPrimeBest(n);

        // System.out.println(day25_Primes.isPrime(2));
        // System.out.println(day25_Primes.isPrimeBest(2));

        // for (int i = 0; i < n; i++) {
        // boolean primeBestAlan = test.isPrime(i);
        // String primeOrNot = " is " + (primeBestAlan ? "" : "not ") + "prime";
        // System.out.println("number " + i + primeOrNot);
        // }
    }
}
```
