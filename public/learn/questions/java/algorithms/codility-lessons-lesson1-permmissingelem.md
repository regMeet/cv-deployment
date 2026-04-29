# Perm Missing Elem — Lesson 1

**Origin:** Codility &nbsp;|&nbsp; **Topics:** Arrays

*Source:* `Codility/Lessons/Lesson1/PermMissingElem.java`

## Problem

Created by yaodh on 2014/12/4.
PermMissingElem
Find the missing element in a given permutation.
Task description
A zero-indexed array A consisting of N different integers is given.
The array contains integers in the range [1..(N + 1)], which means that exactly one element is missing.
Your goal is to find that missing element.
Write a function:
class Solution { public int solution(int[] A); }
that, given a zero-indexed array A, returns the value of the missing element.
For example, given array A such that:
A[0] = 2
A[1] = 3
A[2] = 1
A[3] = 5
the function should return 4, as it is the missing element.
Assume that:
N is an integer within the range [0..100,000];
the elements of A are all distinct;
each element of array A is an integer within the range [1..(N + 1)].
Complexity:
expected worst-case time complexity is O(N);
expected worst-case space complexity is O(1), beyond input storage (not counting the storage required for input arguments).
Elements of input arrays can be modified.

## Solution

```java
public class PermMissingElem {
	// calculate the sum of all elements
	public int solution2(int[] A) {
		int n = A.length;
		// using long instead of int
		long target = (long) (n + 1) * (n + 2) / 2;
		for (int i = 0; i < n; i++) {
			target -= A[i];
		}
		return (int) target;
	}

	// swap the ith element and the (A[i]-1)th element, until A[i]=i+1;
	public int solution(int[] A) {
		int n = A.length;
		for (int i = 0; i < n; i++) {
			if (A[i] == i + 1)
				continue;
			while (A[i] != i + 1 && A[i] <= n) {
				swap(A, i, A[i] - 1);
			}
		}
		for (int i = 0; i < n; i++) {
			if (A[i] > n)
				return i + 1;
		}
		return n + 1;
	}

	private void swap(int[] a, int x, int y) {
		int tmp = a[x];
		a[x] = a[y];
		a[y] = tmp;
	}

	/**
	 * x = 10 and y = 20
	 * x = 10 + 20 = 30
	 * y = x - y = 30 - 20 = 10
	 * x = x - y = 30 - 10 = 20
	 * 
	 * @param a
	 * @param x index
	 * @param y index
	 */
	private void swap2(int[] a, int x, int y) {
		// Code to swap 'x' and 'y'
		a[x] = a[x] + a[y]; // x now becomes sum
		a[y] = a[x] - a[y]; // y becomes x
		a[x] = a[x] - a[y]; // x becomes y

	}

	public static void main(String[] args) {
		int ans = new PermMissingElem().solution2(new int[] { 5, 2, 3, 1 });
		System.out.println(ans);
	}

	public int solution3(int[] A) {
		int n = A.length;
		for (int i = 0; i < n; i++) {
			int value = A[i];
			if (value == i + 1)
				continue;
			while (value != i + 1 && value <= n) {
				swap2(A, i, value - 1);
				value = A[i];
			}
		}
		for (int i = 0; i < n; i++) {
			if (A[i] > n)
				return i + 1;
		}
		return n + 1;
	}
}
```
