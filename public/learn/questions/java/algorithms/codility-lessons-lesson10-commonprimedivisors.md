# Common Prime Divisors — Lesson 10

**Origin:** Codility &nbsp;|&nbsp; **Topics:** Sorting

*Source:* `Codility/Lessons/Lesson10/CommonPrimeDivisors.java`

## Problem

Created by yaodh on 2014/12/8.
https://codility.com/demo/results/demoBGUQWU-F9P/
1. CommonPrimeDivisors
Check whether two numbers have the same prime divisors.
Task description
A prime is a positive integer X that has exactly two distinct divisors: 1 and X. The first few prime integers are 2, 3, 5, 7, 11 and 13.
A prime D is called a prime divisor of a positive integer P if there exists a positive integer K such that D * K = P. For example, 2 and 5 are prime divisors
of 20.
You are given two positive integers N and M. The goal is to check whether the sets of prime divisors of integers N and M are exactly the same.
For example, given:
N = 15 and M = 75, the prime divisors are the same: {3, 5};
N = 10 and M = 30, the prime divisors aren't the same: {2, 5} is not equal to {2, 3, 5};
N = 9 and M = 5, the prime divisors aren't the same: {3} is not equal to {5}.
Write a function:
class Solution { public int solution(int[] A, int[] B); }
that, given two non-empty zero-indexed arrays A and B of Z integers, returns the number of positions K for which the prime divisors of A[K] and B[K] are
exactly the
same.
For example, given:
A[0] = 15 B[0] = 75
A[1] = 10 B[1] = 30
A[2] = 3 B[2] = 5
the function should return 1, because only one pair (15, 75) has the same set of prime divisors.
Assume that:
Z is an integer within the range [1..6,000];
each element of arrays A, B is an integer within the range [1..2,147,483,647].
Complexity:
expected worst-case time complexity is O(Z*log(max(A)+max(B))2);
expected worst-case space complexity is O(1), beyond input storage (not counting the storage required for input arguments).
Elements of input arrays can be modified.

## Solution

```java
import java.util.ArrayList;
import java.util.Collections;

/**
 * Created by yaodh on 2014/12/8.
 * https://codility.com/demo/results/demoBGUQWU-F9P/
 * 1. CommonPrimeDivisors
 * Check whether two numbers have the same prime divisors.
 * Task description
 * A prime is a positive integer X that has exactly two distinct divisors: 1 and X. The first few prime integers are 2, 3, 5, 7, 11 and 13.
 * A prime D is called a prime divisor of a positive integer P if there exists a positive integer K such that D * K = P. For example, 2 and 5 are prime divisors
 * of 20.
 * You are given two positive integers N and M. The goal is to check whether the sets of prime divisors of integers N and M are exactly the same.
 * For example, given:
 * N = 15 and M = 75, the prime divisors are the same: {3, 5};
 * N = 10 and M = 30, the prime divisors aren't the same: {2, 5} is not equal to {2, 3, 5};
 * N = 9 and M = 5, the prime divisors aren't the same: {3} is not equal to {5}.
 * Write a function:
 * class Solution { public int solution(int[] A, int[] B); }
 * that, given two non-empty zero-indexed arrays A and B of Z integers, returns the number of positions K for which the prime divisors of A[K] and B[K] are
 * exactly the
 * same.
 * For example, given:
 * A[0] = 15 B[0] = 75
 * A[1] = 10 B[1] = 30
 * A[2] = 3 B[2] = 5
 * the function should return 1, because only one pair (15, 75) has the same set of prime divisors.
 * Assume that:
 * Z is an integer within the range [1..6,000];
 * each element of arrays A, B is an integer within the range [1..2,147,483,647].
 * Complexity:
 * expected worst-case time complexity is O(Z*log(max(A)+max(B))2);
 * expected worst-case space complexity is O(1), beyond input storage (not counting the storage required for input arguments).
 * Elements of input arrays can be modified.
 */
public class CommonPrimeDivisors {
    public int solution(int[] A, int[] B) {
        int ans = 0;
        for (int i = 0; i < A.length; i++) {
            if (common(A[i], B[i])) {
                ans++;
            }
        }
        return ans;
    }

    private boolean common(int x, int y) {
        int d = gcd(x, y);
        return commonGCD(d, x) && commonGCD(d, y);
    }

    private boolean commonGCD(int x, int y) {
        int d = gcd(x, y);
        while (d != 1) {
            y /= d;
            d = gcd(x, y);
        }
        return x % y == 0;
    }

    private int gcd(int n, int m) {
        int r = n % m;
        while (r != 0) {
            n = m;
            m = r;
            r = n % m;
        }
        return m;
    }

    // public int solutionAlan(int[] A, int[] B) {
    // int ans = 0;
    // for (int i = 0; i < A.length; i++) {
    // if (checkEqualAllFactors(A[i], B[i])) {
    // ans++;
    // }
    // }
    // return ans;
    // }

    public boolean checkEqualAllFactors(int A, int B) {
        ArrayList<Integer> x = allFactors(A);
        ArrayList<Integer> y = allFactors(B);

        return x.equals(y);
    }

    public ArrayList<Integer> allFactors(int a) {

        int upperlimit = (int) (Math.sqrt(a));
        ArrayList<Integer> factors = new ArrayList<Integer>();
        for (int i = 1; i <= upperlimit; i += 1) {
            if (a % i == 0) {
                factors.add(i);
                int division = a / i;
                if (i != division) {
                    factors.add(division);
                }
            }
        }
        Collections.sort(factors);
        return factors;
    }

    public boolean checkEqualBiggestPrimeDivisor(int A, int B) {
        int x = biggestPrimeDivisor(A);
        int y = biggestPrimeDivisor(B);

        return x == y;
    }

    private int biggestPrimeDivisor(int N) {
        if (N < 2) {
            return 1;
        }

        int ans = 0;
        for (int i = 2; i <= N; i++) {
            while (N % i == 0) {
                N /= i;
            }

            if (N == 1) {
                ans = i;
                break;
            }
        }

        return ans;
    }

    public static void main(String[] args) {
        // http://massivealgorithms.blogspot.com.ar/2015/07/solution-to-common-prime-divisors-by.html
        int ans = new CommonPrimeDivisors().solution(new int[] { 15, 10, 3 }, new int[] { 75, 30, 5 });

        System.out.println(ans);

        // System.out.println(new CommonPrimeDivisors().solutionAlan(new int[] { 15, 10, 3 }, new int[] { 75, 30, 5 }));
    }
}
```
