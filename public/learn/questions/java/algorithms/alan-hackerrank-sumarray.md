# Sum Array

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Strings

*Source:* `alan/hackerrank/sumArray.java`

## Problem

Given an array of integers, can you find the sum of its elements?

Input Format

The first line contains an integer, , denoting the size of the array.
The second line contains space-separated integers representing the array's elements.

Output Format

Print the sum of the array's elements as a single integer.

Sample Input

6
1 2 3 4 10 11
Sample Output

31
Explanation

We print the sum of the array's elements, which is: 1 + 2 + 3 + 4 + 10 + 11 = 31

## Solution

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * Given an array of integers, can you find the sum of its elements?
 * 
 * Input Format
 * 
 * The first line contains an integer, , denoting the size of the array.
 * The second line contains space-separated integers representing the array's elements.
 * 
 * Output Format
 * 
 * Print the sum of the array's elements as a single integer.
 * 
 * Sample Input
 * 
 * 6
 * 1 2 3 4 10 11
 * Sample Output
 * 
 * 31
 * Explanation
 * 
 * We print the sum of the array's elements, which is: 1 + 2 + 3 + 4 + 10 + 11 = 31
 *
 */
public class sumArray {

    public static void main(String[] args) throws IOException {
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution. */
        BufferedReader input = new BufferedReader(new InputStreamReader(System.in));
        Integer size = Integer.valueOf(input.readLine());
        String[] numbers = input.readLine().split(" ");

        int sum = 0;
        for (int i = 0; i < size; i++) {
            sum += Integer.valueOf(numbers[i]);
        }
        System.out.println(sum);

    }
}
```
