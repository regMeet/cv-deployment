# Cyclic Rotation

**Origin:** Codility &nbsp;|&nbsp; **Topics:** Arrays

*Source:* `Codility/Arrays/CyclicRotation.java`

## Problem

A zero-indexed array A consisting of N integers is given. Rotation of the array means that each element is shifted right by one index, and the last element
of the array is also moved to the first place.

For example, the rotation of array A = [3, 8, 9, 7, 6] is [6, 3, 8, 9, 7]. The goal is to rotate array A K times; that is, each element of A will be shifted
to the right by K indexes.

Write a function:

class Solution { public int[] solution(int[] A, int K); }
that, given a zero-indexed array A consisting of N integers and an integer K, returns the array A rotated K times.

For example, given array A = [3, 8, 9, 7, 6] and K = 3, the function should return [9, 7, 6, 3, 8].

Assume that:

N and K are integers within the range [0..100];
each element of array A is an integer within the range [−1,000..1,000].
In your solution, focus on correctness. The performance of your solution will not be the focus of the assessment.

## Solution

```java
import java.util.Arrays;

/**
 * A zero-indexed array A consisting of N integers is given. Rotation of the array means that each element is shifted right by one index, and the last element
 * of the array is also moved to the first place.
 *
 * For example, the rotation of array A = [3, 8, 9, 7, 6] is [6, 3, 8, 9, 7]. The goal is to rotate array A K times; that is, each element of A will be shifted
 * to the right by K indexes.
 *
 * Write a function:
 *
 * class Solution { public int[] solution(int[] A, int K); }
 * that, given a zero-indexed array A consisting of N integers and an integer K, returns the array A rotated K times.
 *
 * For example, given array A = [3, 8, 9, 7, 6] and K = 3, the function should return [9, 7, 6, 3, 8].
 *
 * Assume that:
 *
 * N and K are integers within the range [0..100];
 * each element of array A is an integer within the range [−1,000..1,000].
 * In your solution, focus on correctness. The performance of your solution will not be the focus of the assessment.
 */
public class CyclicRotation {

    public int[] solution(int[] A, int K) {
        // eg k= 1 A = [3, 8, 9, 7, 6] the result is [6, 3, 8, 9, 7]
        // eg k= 3 A = [3, 8, 9, 7, 6] the result is [9, 7, 6, 3, 8]
        int length = A.length;

        int[] result = new int[length];

        if (K == 0 || K % length == 0) {
            return A;
        }

        for (int i = 0; i < length; i++) {
            int newPosition = (i + K) % length;
            result[newPosition] = A[i];
        }

        return result;
    }

    public static void main(String[] args) {
        // int[] A = { 1, 2, 3, 4, 5, 6, 7, 8, 9 };
        // int K = 3;

        int[] A = {3, 8, 9, 7, 6};
        int K = 3;

        int[] solution = new CyclicRotation().solution(A, K);
        System.out.println(Arrays.toString(solution));
    }

}
```
