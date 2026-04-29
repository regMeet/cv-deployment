# Count Factors — Lesson 8

**Origin:** Codility &nbsp;|&nbsp; **Topics:** Sorting

*Source:* `Codility/Lessons/Lesson8/CountFactors.java`

## Problem

Created by yaodh on 2014/12/7.
1. CountFactors
Count factors of given number n.
Task description
A positive integer D is a factor of a positive integer N if there exists an integer M such that N = D * M.
For example, 6 is a factor of 24, because M = 4 satisfies the above condition (24 = 6 * 4).
Write a function:
class Solution { public int solution(int N); }
that, given a positive integer N, returns the number of its factors.
For example, given N = 24, the function should return 8, because 24 has 8 factors, namely 1, 2, 3, 4, 6, 8, 12, 24. There are no other factors of
24.
Assume that:
N is an integer within the range [1..2,147,483,647].
Complexity:
expected worst-case time complexity is O(sqrt(N));
expected worst-case space complexity is O(1).

## Solution

```java
import java.util.ArrayList;
import java.util.Collections;

/**
 * Created by yaodh on 2014/12/7.
 * 1. CountFactors
 * Count factors of given number n.
 * Task description
 * A positive integer D is a factor of a positive integer N if there exists an integer M such that N = D * M.
 * For example, 6 is a factor of 24, because M = 4 satisfies the above condition (24 = 6 * 4).
 * Write a function:
 * class Solution { public int solution(int N); }
 * that, given a positive integer N, returns the number of its factors.
 * For example, given N = 24, the function should return 8, because 24 has 8 factors, namely 1, 2, 3, 4, 6, 8, 12, 24. There are no other factors of
 * 24.
 * Assume that:
 * N is an integer within the range [1..2,147,483,647].
 * Complexity:
 * expected worst-case time complexity is O(sqrt(N));
 * expected worst-case space complexity is O(1).
 */
public class CountFactors {
    public int solution(int N) {
        int ans = 1, s = (int) Math.sqrt(N);
        for (int i = 2; i <= s; i++) {
            int count = 0;
            while (N % i == 0) {
                N /= i;
                count++;
            }
            ans *= count + 1;
        }
        return ans * (N > 1 ? 2 : 1);
    }

    public static void main(String[] args) {
        System.out.println(new CountFactors().solution(13));

        System.out.println(new CountFactors().allFactors(15));
    }

    // best solution
    public int countFactors(int N) {
        int ans = 0;
        int upperlimit = (int) (Math.sqrt(N));
        for (int i = 1; i <= upperlimit; i++) {
            if (N % i == 0) {
                ans++;
                if (i != N / i) {
                    ans++;
                }
            }
        }
        return ans;
    }

    public ArrayList<Integer> allFactors(int N) {

        int upperlimit = (int) (Math.sqrt(N));
        ArrayList<Integer> factors = new ArrayList<Integer>();
        for (int i = 1; i <= upperlimit; i += 1) {
            if (N % i == 0) {
                factors.add(i);
                int division = N / i;
                if (i != division) {
                    factors.add(division);
                }
            }
        }
        Collections.sort(factors);
        return factors;
    }

}
/**
 * 24/2 3 + 1
 * 12/2
 * 6/2
 * 3/3 1 + 1
 * 1 4 * 2 = 8
 */
```
