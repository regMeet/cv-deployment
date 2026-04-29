# Common Divisors — Lesson 10

**Origin:** Codility &nbsp;|&nbsp; **Topics:** Math / Number Theory

*Source:* `Codility/Lessons/Lesson10/CommonDivisors.java`

## Problem

How can I compute the number of common divisors of two naturals ?

For example,if we consider (12,24) the answer is 6 i.e {1,12,2,6,3,4}.
Number of common divisors between two given numbers
The solution boils down to finding the number of divisor of the GCD of the two numbers.

@author Alan

## Solution

```java
public class CommonDivisors {

    public int solution(int A, int B) {
        int gcd = E_GCD(A, B);
        System.out.println(gcd);
        return countFactors(gcd);
    }

    public int countFactors(int N) {
        int ans = 0;
        int sqt = (int) Math.sqrt(N);
        for (int i = 1; i <= sqt; i++) {
            if (N % i == 0) {
                ans += 2; // sums i and N/i
                System.out.println(i);
                if (i == N / i) { // if it's same number it removes one
                    ans--;
                    System.out.println("remove: " + i);
                }
            }
        }
        return ans;
    }

    int E_GCD(int a, int b) {
        return b != 0 ? E_GCD(b, a % b) : a;
    }

    public static void main(String[] args) {
        System.out.println("number of common divisors: " + new CommonDivisors().solution(12, 24));
    }

}
```
