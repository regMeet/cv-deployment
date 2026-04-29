# Perm Check — Lesson 2

**Origin:** Codility &nbsp;|&nbsp; **Topics:** Hash Set, Arrays

*Source:* `Codility/Lessons/Lesson2/PermCheck.java`

## Problem

Created by yaodh on 2014/12/4.
Lesson 2: PermCheck
Check whether array A is a permutation.
Description:
A non-empty zero-indexed array A consisting of N integers is given.
A permutation is a sequence containing each element from 1 to N once, and only once.
For example, array A such that:
A[0] = 4
A[1] = 1
A[2] = 3
A[3] = 2
is a permutation, but array A such that:
A[0] = 4
A[1] = 1
A[2] = 3
is not a permutation, because value 2 is missing.
The goal is to check whether array A is a permutation.
Write a function:
int solution(int A[], int N);
that, given a zero-indexed array A, returns 1 if array A is a permutation and 0 if it is not.
For example, given array A such that:
A[0] = 4
A[1] = 1
A[2] = 3
A[3] = 2
the function should return 1.
Given array A such that:
A[0] = 4
A[1] = 1
A[2] = 3
the function should return 0.
Assume that:
N is an integer within the range [1..100,000];
each element of array A is an integer within the range [1..1,000,000,000].
Complexity:
expected worst-case time complexity is O(N);
expected worst-case space complexity is O(N), beyond input storage (not counting the storage required for input arguments).
Elements of input arrays can be modified.

## Solution

```java
import java.util.BitSet;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by yaodh on 2014/12/4.
 * Lesson 2: PermCheck
 * Check whether array A is a permutation.
 * Description:
 * A non-empty zero-indexed array A consisting of N integers is given.
 * A permutation is a sequence containing each element from 1 to N once, and only once.
 * For example, array A such that:
 * A[0] = 4
 * A[1] = 1
 * A[2] = 3
 * A[3] = 2
 * is a permutation, but array A such that:
 * A[0] = 4
 * A[1] = 1
 * A[2] = 3
 * is not a permutation, because value 2 is missing.
 * The goal is to check whether array A is a permutation.
 * Write a function:
 * int solution(int A[], int N);
 * that, given a zero-indexed array A, returns 1 if array A is a permutation and 0 if it is not.
 * For example, given array A such that:
 * A[0] = 4
 * A[1] = 1
 * A[2] = 3
 * A[3] = 2
 * the function should return 1.
 * Given array A such that:
 * A[0] = 4
 * A[1] = 1
 * A[2] = 3
 * the function should return 0.
 * Assume that:
 * N is an integer within the range [1..100,000];
 * each element of array A is an integer within the range [1..1,000,000,000].
 * Complexity:
 * expected worst-case time complexity is O(N);
 * expected worst-case space complexity is O(N), beyond input storage (not counting the storage required for input arguments).
 * Elements of input arrays can be modified.
 */
public class PermCheck {
    public int solution(int[] A) {
        int n = A.length;
        BitSet bit = new BitSet(n);
        for (int i = 0; i < A.length; i++) {
            if (A[i] < 1 || A[i] > n || bit.get(A[i] - 1))
                return 0;
            bit.set(A[i] - 1);
        }
        return 1;
    }

    public static void main(String[] args) {
        System.out.println(new PermCheck().solution(new int[] { 4, 1, 3, 5 }));
        System.out.println(new PermCheck().solution2(new int[] { 4, 1, 3, 4 }));

    }

    // hash set, no order, no duplicates
    public int solution2(int[] A) {
        int n = A.length;
        Set<Integer> numbers = new HashSet<Integer>(n);
        for (int i = 0; i < n; i++) {
            if (A[i] < 1 || A[i] > n)
                return 0;
            numbers.add(A[i] - 1);
        }
        if (numbers.size() < n) {
            return 0;
        }
        return 1;
    }

    // with arrays
    public int solution3(int[] A) {
        int n = A.length;
        int[] numbers = new int[n+1];
        for (int i = 0; i < n; i++) {
            int value = A[i];
            if (value < 1 || value > n || numbers[value] != 0)
                return 0;
            numbers[value]=1;
        }
        return 1;
    }
}
```
