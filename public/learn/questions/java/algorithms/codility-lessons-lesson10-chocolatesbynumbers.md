# Chocolates By Numbers — Lesson 10

**Origin:** Codility &nbsp;|&nbsp; **Topics:** Math / Number Theory

*Source:* `Codility/Lessons/Lesson10/ChocolatesByNumbers.java`

## Problem

Created by yaodh on 2014/12/8.
https://codility.com/demo/results/demoKHXQ7Q-TZ6/
1. ChocolatesByNumbers
There are N chocolates in a circle. Count the number of chocolates you will eat.
Task description
Two positive integers N and M are given. Integer N represents the number of chocolates arranged in a circle,
numbered from 0 to N - 1.
You start to eat the chocolates. After eating a chocolate you leave only a wrapper.
You begin with eating chocolate number 0. Then you omit the next M - 1 chocolates or wrappers on the circle,
and eat the following one.
More precisely, if you ate chocolate number X,
then you will next eat the chocolate with number (X + M) modulo N (remainder of division).
You stop eating when you encounter an empty wrapper.
For example, given integers N = 10 and M = 4. You will eat the following chocolates: 0, 4, 8, 2, 6.
The goal is to count the number of chocolates that you will eat, following the above rules.
Write a function:
class Solution { public int solution(int N, int M); }
that, given two positive integers N and M, returns the number of chocolates that you will eat.
For example, given integers N = 10 and M = 4. the function should return 5, as explained above.
Assume that:
N and M are integers within the range [1..1,000,000,000].
Complexity:
expected worst-case time complexity is O(log(N+M));
expected worst-case space complexity is O(1).

## Solution

```java
import java.util.BitSet;

/**
 * Created by yaodh on 2014/12/8.
 * https://codility.com/demo/results/demoKHXQ7Q-TZ6/
 * 1. ChocolatesByNumbers
 * There are N chocolates in a circle. Count the number of chocolates you will eat.
 * Task description
 * Two positive integers N and M are given. Integer N represents the number of chocolates arranged in a circle,
 * numbered from 0 to N - 1.
 * You start to eat the chocolates. After eating a chocolate you leave only a wrapper.
 * You begin with eating chocolate number 0. Then you omit the next M - 1 chocolates or wrappers on the circle,
 * and eat the following one.
 * More precisely, if you ate chocolate number X,
 * then you will next eat the chocolate with number (X + M) modulo N (remainder of division).
 * You stop eating when you encounter an empty wrapper.
 * For example, given integers N = 10 and M = 4. You will eat the following chocolates: 0, 4, 8, 2, 6.
 * The goal is to count the number of chocolates that you will eat, following the above rules.
 * Write a function:
 * class Solution { public int solution(int N, int M); }
 * that, given two positive integers N and M, returns the number of chocolates that you will eat.
 * For example, given integers N = 10 and M = 4. the function should return 5, as explained above.
 * Assume that:
 * N and M are integers within the range [1..1,000,000,000].
 * Complexity:
 * expected worst-case time complexity is O(log(N+M));
 * expected worst-case space complexity is O(1).
 */
public class ChocolatesByNumbers {
    public int solution(int N, int M) {
        int lcm = lcm(N, M); // where they meet

        int chocolates = lcm / M; // number of steps
        return chocolates;
    }

    private int lcm(int n, int m) {
        return n * m / gcd(n, m);
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

    public int solution2(int N, int M) {
        int counter = 1;
        int start = 0;
        while ((start = (start + M) % N) != 0) {
            counter++;
        }
        return counter;
    }

    public int naive(int N, int M) {
        BitSet hash = new BitSet(N);

        int at = 0;
        int cnt = 0;

        while (!hash.get(at)) {
            hash.set(at);
            at = (at + M) % N;
            cnt += 1;
        }

        return cnt;
    }

    public static void main(String[] args) {
        System.out.println("lcm(12, 10): "+ new ChocolatesByNumbers().lcm(12, 10));
        System.out.println("gcd(12, 10): "+ new ChocolatesByNumbers().gcd(12, 10));
        
        
        System.out.println(new ChocolatesByNumbers().naive(12, 4));
        System.out.println(new ChocolatesByNumbers().naive(10, 4));
        System.out.println(new ChocolatesByNumbers().solution(10, 4));
        System.out.println(new ChocolatesByNumbers().solution(4, 10));
        System.out.println(new ChocolatesByNumbers().solution(252, 105)); // 21 * 12 = 252
    }
}
```
