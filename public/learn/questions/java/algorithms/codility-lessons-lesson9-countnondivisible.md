# Count Non Divisible — Lesson 9

**Origin:** Codility &nbsp;|&nbsp; **Topics:** Hash Map, Arrays

*Source:* `Codility/Lessons/Lesson9/CountNonDivisible.java`

## Problem

Created by yaodh on 2014/12/8.
https://codility.com/demo/results/demoNE9AF9-5GX/
1. CountNonDivisible
Calculate the number of elements of an array that are not divisors of each element.
Task description
You are given a non-empty zero-indexed array A consisting of N integers.
For each number A[i] such that 0 ≤ i < N,
we want to count the number of elements of the array that are not the divisors of A[i].
We say that these elements are non-divisors.
For example, consider integer N = 5 and array A such that:
A[0] = 3
A[1] = 1
A[2] = 2
A[3] = 3
A[4] = 6
For the following elements:
A[0] = 3, the non-divisors are: 2, 6,
A[1] = 1, the non-divisors are: 3, 2, 3, 6,
A[2] = 2, the non-divisors are: 3, 3, 6,
A[3] = 3, the non-divisors are: 2, 6,
A[6] = 6, there aren't any non-divisors.
Write a function:
class Solution { public int[] solution(int[] A); }
that, given a non-empty zero-indexed array A consisting of N integers,
returns a sequence of integers representing the amount of non-divisors.
The sequence should be returned as:
a structure Results (in C), or
a vector of integers (in C++), or
a record Results (in Pascal), or
an array of integers (in any other programming language).
For example, given:
A[0] = 3
A[1] = 1
A[2] = 2
A[3] = 3
A[4] = 6
the function should return [2, 4, 3, 2, 0], as explained above.
Assume that:
N is an integer within the range [1..50,000];
each element of array A is an integer within the range [1..2 * N].
Complexity:
expected worst-case time complexity is O(N*log(N));
expected worst-case space complexity is O(N), beyond input storage (not counting the storage required for input arguments).
Elements of input arrays can be modified.

## Solution

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by yaodh on 2014/12/8.
 * https://codility.com/demo/results/demoNE9AF9-5GX/
 * 1. CountNonDivisible
 * Calculate the number of elements of an array that are not divisors of each element.
 * Task description
 * You are given a non-empty zero-indexed array A consisting of N integers.
 * For each number A[i] such that 0 ≤ i < N,
 * we want to count the number of elements of the array that are not the divisors of A[i].
 * We say that these elements are non-divisors.
 * For example, consider integer N = 5 and array A such that:
 * A[0] = 3
 * A[1] = 1
 * A[2] = 2
 * A[3] = 3
 * A[4] = 6
 * For the following elements:
 * A[0] = 3, the non-divisors are: 2, 6,
 * A[1] = 1, the non-divisors are: 3, 2, 3, 6,
 * A[2] = 2, the non-divisors are: 3, 3, 6,
 * A[3] = 3, the non-divisors are: 2, 6,
 * A[6] = 6, there aren't any non-divisors.
 * Write a function:
 * class Solution { public int[] solution(int[] A); }
 * that, given a non-empty zero-indexed array A consisting of N integers,
 * returns a sequence of integers representing the amount of non-divisors.
 * The sequence should be returned as:
 * a structure Results (in C), or
 * a vector of integers (in C++), or
 * a record Results (in Pascal), or
 * an array of integers (in any other programming language).
 * For example, given:
 * A[0] = 3
 * A[1] = 1
 * A[2] = 2
 * A[3] = 3
 * A[4] = 6
 * the function should return [2, 4, 3, 2, 0], as explained above.
 * Assume that:
 * N is an integer within the range [1..50,000];
 * each element of array A is an integer within the range [1..2 * N].
 * Complexity:
 * expected worst-case time complexity is O(N*log(N));
 * expected worst-case space complexity is O(N), beyond input storage (not counting the storage required for input arguments).
 * Elements of input arrays can be modified.
 */
public class CountNonDivisible {
    public int[] solution(int[] A) {
        int n = A.length;
        int[] ans = new int[n];
        int[] hash = new int[n * 2 + 1];
        int[] factors = new int[n * 2 + 1];
        for (int i = 0; i < n; i++) {
            hash[A[i]]++;
            factors[A[i]]++;
        }
        factors[1] = 0;
        for (int i = 2; i * i <= n * 2; i++) {
            factors[i * i] += hash[i];
            for (int k = i * i + i; k <= n * 2; k += i) {
                factors[k] += hash[i] + hash[k / i];
            }
        }
        for (int i = 0; i < n; i++) {
            ans[i] = n - factors[A[i]] - hash[1];
        }
        return ans;
    }

    public int[] solution2(int[] A) {
        int[][] D = new int[A.length * 2 + 1][2];

        for (int i = 0; i < A.length; i++) {
            int value = A[i];
            D[value][0]++; // ocuurences
            D[value][1] = -1; // divisors
        }

        for (int i = 0; i < A.length; i++) {
            int value = A[i];
            if (D[value][1] == -1) {
                D[value][1] = 0;
                for (int j = 1; j <= Math.sqrt(value); j++) {
                    if (value % j == 0 && value / j != j) {
                        D[value][1] += D[j][0];
                        D[value][1] += D[value / j][0];
                    } else if (value % j == 0 && value / j == j) {
                        D[value][1] += D[j][0];
                    }
                }
            }
        }
        for (int i = 0; i < A.length; i++) {
            A[i] = A.length - D[A[i]][1];
        }
        return A;
    }

    public int[] countNonDivisible(int[] A) {
        Map<Integer, List<Integer>> divisorsOf = new HashMap<Integer, List<Integer>>();
        Map<Integer, Integer> countOf = new HashMap<Integer, Integer>();

        // calc counts and divisors
        final int N = A.length;
        for (int a : A) {
            Integer newCount = 1;
            if (countOf.containsKey(a)) {
                newCount = countOf.get(a) + 1;
            } else {
                // Calc divisors only once
                List<Integer> divisors = getDivisors(a);
                divisorsOf.put(a, divisors);
            }
            countOf.put(a, newCount);
        }

        List<Integer> result = new ArrayList<Integer>();
        for (int a : A) {
            int nNonDivisors = N;
            for (int d : divisorsOf.get(a)) {
                Integer anyD = countOf.get(d);
                if (anyD != null)
                    nNonDivisors -= anyD;
            }
            result.add(nNonDivisors);
        }

        return result.stream().mapToInt(i -> i).toArray();

        // return result.toArray();
    }

    private List<Integer> getDivisors(int a) {
        List<Integer> divisors = new ArrayList<Integer>();
        final int sqrtA = (int) Math.sqrt(a);
        for (int i = 1; i <= sqrtA; ++i) {
            if (0 == a % i) {
                divisors.add(i);
                if (i * i != a)
                    divisors.add(a / i); // count it once
            }
        }
        return divisors;
    }

    public int[] toIntArray(List<Integer> list) {
        int[] result = new int[list.size()];
        for (int i = 0; i < result.length; ++i) {
            result[i] = list.get(i);
        }
        return result;
    }

    public int[] countNonDivisibleImproved(int[] A) {
        int[][] D = new int[A.length * 2 + 1][2];

        for (int i = 0; i < A.length; i++) {
            int value = A[i];
            D[value][0]++; // ocuurences
            D[value][1] = -1; // non divisors
        }

        for (int i = 0; i < A.length; i++) {
            int value = A[i];
            if (D[value][1] == -1) {
                D[value][1] = A.length; // non divisors

                for (int j = 1; j <= Math.sqrt(value); j++) {
                    if (value % j == 0) {
                        D[value][1] -= D[j][0]; // minus divisor (number of occurrences)
                        if (value / j != j) {
                            D[value][1] -= D[value / j][0]; // minus the other divisor
                        }
                    }
                }
            }
        }
        for (int i = 0; i < A.length; i++) {
            A[i] = D[A[i]][1];
        }
        return A;
    }

    public static void main(String[] args) {
        int[] ans = new CountNonDivisible().countNonDivisibleImproved(new int[] { 3, 1, 2, 3, 6 });
        for (int x : ans) {
            System.out.printf("%d ", x);
        }
    }
}

// http://stackoverflow.com/questions/21243729/countnondivisible-codility-training-task
// https://codility.com/demo/results/demoMGW4FF-D9Z/
```
