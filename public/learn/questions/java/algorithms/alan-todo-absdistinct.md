# Abs Distinct

**Origin:** Personal &nbsp;|&nbsp; **Topics:** Arrays

*Source:* `alan/todo/absDistinct.java`

## Problem

A non-empty zero-indexed array A consisting of N numbers is given. The absolute distinct count of this array is the number of distinct absolute values among the elements of the array.

For example, consider array A such that

A[0] = -5    A[1] = -3    A[2] = -1
A[3] =  0    A[4] =  3    A[5] =  6
The absolute distinct count of this array is 5, because there are 5 distinct absolute values among the elements of this array, namely 0, 1, 3, 5 and 6.

Write a function

function absDistinct($A);

that, given a non-empty zero-indexed array A consisting of N numbers, returns absolute distinct count of array A.

Assume that:

N is an integer within the range [1..100,000];
each element of array A is an integer within the range [-2,147,483,648..2,147,483,647];
array A is sorted in non-decreasing order.
For example, given array A such that

A[0] = -5    A[1] = -3    A[2] = -1
A[3] =  0    A[4] =  3    A[5] =  6
the function should return 5, as explained above.

Complexity:

expected worst-case time complexity is O(N);
expected worst-case space complexity is O(N), beyond input storage (not counting the storage required for input arguments).
Elements of input arrays can be modified.

## Solution

```java
import java.util.BitSet;

import Codility.Lessons.Lesson4.Distinct;

/*
A non-empty zero-indexed array A consisting of N numbers is given. The absolute distinct count of this array is the number of distinct absolute values among the elements of the array.

For example, consider array A such that

A[0] = -5    A[1] = -3    A[2] = -1
A[3] =  0    A[4] =  3    A[5] =  6
The absolute distinct count of this array is 5, because there are 5 distinct absolute values among the elements of this array, namely 0, 1, 3, 5 and 6.

Write a function

function absDistinct($A);

that, given a non-empty zero-indexed array A consisting of N numbers, returns absolute distinct count of array A.

Assume that:

N is an integer within the range [1..100,000];
each element of array A is an integer within the range [-2,147,483,648..2,147,483,647];
array A is sorted in non-decreasing order.
For example, given array A such that

A[0] = -5    A[1] = -3    A[2] = -1
A[3] =  0    A[4] =  3    A[5] =  6
the function should return 5, as explained above.

Complexity:

expected worst-case time complexity is O(N);
expected worst-case space complexity is O(N), beyond input storage (not counting the storage required for input arguments).
Elements of input arrays can be modified.
*/

public class absDistinct {

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
	
	public static void main(String[] args) {
		System.out.println(new Distinct().solutionAbs(new int[] { -5, -3, -1, 0, 3, 6 }));
	}
}
```
