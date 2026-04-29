# Triplet

**Origin:** Codility &nbsp;|&nbsp; **Topics:** Sorting

*Source:* `alan/older/triplet.java`

## Problem

A zero-indexed array A consisting of N integers is given. A triplet (P, Q, R) is triangular if 0 ≤ P < Q < R < N and:

 · A[P] + A[Q] > A[R],
 · A[Q] + A[R] > A[P],
 · A[R] + A[P] > A[Q].
 For example, consider array A such that:

 A[0] = 10    A[1] = 2    A[2] = 5
 A[3] = 1     A[4] = 8    A[5] = 20
 Triplet (0, 2, 4) is triangular.

 Write a function:

 class Solution { public int triangle(int[] A); }

 that, given a zero-indexed array A consisting of N integers, returns 1 if there exists a triangular triplet for this array and returns 0 otherwise. For example, given array A such that:

 A[0] = 10    A[1] = 2    A[2] = 5
 A[3] = 1     A[4] = 8    A[5] = 20
 the function should return 1, as explained above. Given array A such that:

 A[0] = 10    A[1] = 50    A[2] = 5
 A[3] = 1
 the function should return 0.

 Assume that:

 · N is an integer within the range [0..1,000,000];
 · each element of array A is an integer within the range [-2,147,483,648..2,147,483,647].
 Complexity:

 · expected worst-case time complexity is O(N*log(N));
 · expected worst-case space complexity is O(N), beyond input storage (not counting the storage required for input arguments).
 Elements of input arrays can be modified.

 Copyright 2009–2013 by Codility Limited. All Rights Reserved. Unauthorized copying, publication or disclosure prohibited.

## Solution

```java
import java.util.Arrays;

class triplet {
	public int triangle(int[] A) {
		if (null == A) {
			return 0;
		}
		if (A.length < 3) {
			return 0;
		}

		Arrays.sort(A);

		for (int i = 0; i + 2 < A.length; i++) {
			if (A[i] + A[i + 1] > A[i + 2]) {
				return 1;
			}
		}
		return 0;
	}

	public static void main(String[] args) {
	  triplet t = new triplet();
	  int[] array = {10, 2, 5, 1, 8, 20};
	  int triangle = t.triangle(array);
	  System.out.println(triangle);

	}
	
}
```
