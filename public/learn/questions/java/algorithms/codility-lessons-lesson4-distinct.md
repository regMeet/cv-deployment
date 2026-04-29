# Distinct — Lesson 4

**Origin:** Codility &nbsp;|&nbsp; **Topics:** Sorting

*Source:* `Codility/Lessons/Lesson4/Distinct.java`

## Problem

Created by yaodh on 2014/12/6.
1. Distinct
Compute number of distinct values in an array.
Task description
Write a function
class Solution { public int solution(int[] A); }
that, given a zero-indexed array A consisting of N integers, returns the number of distinct values in array A.
Assume that:
N is an integer within the range [0..100,000];
each element of array A is an integer within the range [-1,000,000..1,000,000].
For example, given array A consisting of six elements such that:
A[0] = 2 A[1] = 1 A[2] = 1
A[3] = 2 A[4] = 3 A[5] = 1
the function should return 3, because there are 3 distinct values appearing in array A, namely 1, 2 and 3.
Complexity:
expected worst-case time complexity is O(N*log(N));
expected worst-case space complexity is O(N), beyond input storage (not counting the storage required for input arguments).
Elements of input arrays can be modified.

## Solution

```java
import java.util.Arrays;
import java.util.BitSet;

/**
 * Created by yaodh on 2014/12/6.
 * 1. Distinct
 * Compute number of distinct values in an array.
 * Task description
 * Write a function
 * class Solution { public int solution(int[] A); }
 * that, given a zero-indexed array A consisting of N integers, returns the number of distinct values in array A.
 * Assume that:
 * N is an integer within the range [0..100,000];
 * each element of array A is an integer within the range [-1,000,000..1,000,000].
 * For example, given array A consisting of six elements such that:
 * A[0] = 2 A[1] = 1 A[2] = 1
 * A[3] = 2 A[4] = 3 A[5] = 1
 * the function should return 3, because there are 3 distinct values appearing in array A, namely 1, 2 and 3.
 * Complexity:
 * expected worst-case time complexity is O(N*log(N));
 * expected worst-case space complexity is O(N), beyond input storage (not counting the storage required for input arguments).
 * Elements of input arrays can be modified.
 */
public class Distinct {
	public int solution(int[] A) {
		if (A.length <= 0)
			return 0;
		Arrays.sort(A);
		int pre = A[0], count = 1;
		for (int i = 1; i < A.length; i++) {
			if (A[i] != pre) {
				pre = A[i];
				count++;
			}
		}
		return count;
	}

	public static void main(String[] args) {
		System.out.println(new Distinct().solution2(new int[] { 2, 1, 1, 2, 3, 1 }));
		
		System.out.println(new Distinct().solution(new int[] { 2, -1, 1, 2, 3, 1 }));
		
		System.out.println(new Distinct().solutionAbs(new int[] { -5, -3, -1, 0, 3, 6 }));
	}

	public int solution2(int[] A) {
		BitSet hash = new BitSet();

		for (int i = 0; i < A.length; i++) {
			int value = A[i];
//			if (!hash.get(value)){
				hash.set(value);
//			}
		}

		return hash.cardinality();
	}
	
	public int solutionAbs(int[] A) {
		BitSet hash = new BitSet();

		for (int i = 0; i < A.length; i++) {
			int value = Math.abs(A[i]);
			if (!hash.get(value)){
				hash.set(value);
			}
		}

		return hash.cardinality();
	}
}
```
