# Bit Rev

**Origin:** Personal &nbsp;|&nbsp; **Topics:** Misc

*Source:* `alan/todo/bit_rev.java`

## Problem

An integer obtained by reversing the bits of a given integer A is denoted as bit-rev(A).
For example, bit-rev(25) = 19, because the binary representation of 25 is 11001, and reversing those
bits yields 10011, i.e. 19. Similarly, bit-rev(26) = 11 and bit-rev(11) = 13.

A symmetric binary root of a given positive integer N is a positive integer A such that N = A * bit-rev(A).
For example, the symmetric binary root of 50 is 10, because 10 * bit-rev(10) = 10 * 5 = 50. Note that 5
is not a symmetric binary root of 50. The number 286 has two symmetric binary roots: 22 and 26.

Write a function:

function symmetric_binary_root_count($N);

that, given a positive integer N, returns the smallest symmetric binary root of N. The function should return -1 if N has no symmetric binary root.

For example, given N = 3245 the function should return 55.

Assume that:

N is an integer within the range [1..2,147,483,647].
Complexity:

expected worst-case time complexity is O(sqrt(N));
expected worst-case space complexity is O(1).

## Solution

```java
public class bit_rev {

    // raiz de N
    // for i -N verificando si N % i == 0, y chequeando que sea A * bit_rev = N

}
```
