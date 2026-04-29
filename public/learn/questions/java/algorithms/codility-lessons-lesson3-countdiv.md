# Count Div — Lesson 3

**Origin:** Codility &nbsp;|&nbsp; **Topics:** Misc

*Source:* `Codility/Lessons/Lesson3/CountDiv.java`

## Problem

Created by yaodh on 2014/12/6.
1. CountDiv
Compute number of integers divisible by k in range [a..b].
Task description
Write a function:
class Solution { public int solution(int A, int B, int K); }
that, given three integers A, B and K, returns the number of integers within the range [A..B] that are divisible by K, i.e.:
{ i : A ≤ i ≤ B, i mod K = 0 }
For example, for A = 6, B = 11 and K = 2, your function should return 3, because there are three numbers divisible by 2 within the range [6..11],
namely 6, 8 and 10.
Assume that:
A and B are integers within the range [0..2,000,000,000];
K is an integer within the range [1..2,000,000,000];
A ≤ B.
Complexity:
expected worst-case time complexity is O(1);
expected worst-case space complexity is O(1).

## Solution

```java
public class CountDiv {
    // public int solution(int A, int B, int K) {
    // int D = B - A + 1;
    // return D / K + ((B % K) < (D % K) ? 1 : 0);
    // }

    public static void main(String[] args) {

        System.out.println(new CountDiv().solution4(0, 12, 2));

        System.out.println(new CountDiv().solution4(6, 11, 2));

        System.out.println(new CountDiv().solution4(1, 4, 2));

        System.out.println(new CountDiv().solution4(0, 0, 2));
    }

    // public int solution2(int A, int B, int K) {
    // int numberDivA = (A != 0) ? (A - 1) / K : 0;
    // int numberDivB = (B != 0) ? B / K : 0;
    //
    // return numberDivB - numberDivA + (A == 0 ? 1 : 0);
    // }

    public int solution4(int A, int B, int K) {
        int numberDivA = A / K;
        int numberDivB = B / K;
        int cornerCase = A == 0 || A % K == 0 ? 1 : 0;

        return numberDivB - numberDivA + cornerCase;
    }

    // public int solution3(int A, int B, int K) {
    // int D = B - A + 1;
    //
    // // suma total +1 es impar y B no, suma 1
    // int i = (B % K) < (D % K) ? 1 : 0;
    // System.out.println("i: " + i);
    // return D / K + i;
    // }
}
```
