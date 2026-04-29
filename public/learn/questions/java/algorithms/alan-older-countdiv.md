# Count Div

**Origin:** Codility &nbsp;|&nbsp; **Topics:** Misc

*Source:* `alan/older/countDiv.java`

## Problem

Write a function:

 class Solution { public int count_div(int A,int B,int K); }

 that, given three integers A, B and K, returns the number of integers within the range [A..B] that are divisible by K, i.e.:

 { i : A ≤ i ≤ B, i mod K = 0 }

 For example, for A = 6, B = 11 and K = 2, your function should return 3, because there are three numbers divisible by 2 within
 the range [6..11], namely 6, 8 and 10.

 Assume that:

 · A is an integer within the range [0..2,000,000,000];
 · B is an integer within the range [0..2,000,000,000];
 · K is an integer within the range [1..2,000,000,000];
 · A ≤ B.
 Complexity:

 · expected worst-case time complexity is O(1);
 · expected worst-case space complexity is O(1).
 Copyright 2009–2013 by Codility Limited. All Rights Reserved. Unauthorized copying, publication or disclosure prohibited.

## Solution

```java
// you can also use imports, for example:
// import java.math.*;
class CountDiv {
	public int solution(int A, int B, int K) {
		int numberDivA = (A != 0) ? (A - 1) / K : 0;
		int numberDivB = (B != 0) ? B / K : 0;

		return numberDivB - numberDivA;
	}
	
	public static void main(String[] args) {
		int sol = new CountDiv().solution(6, 11, 2);
		System.out.println(sol);
	}
}
```
