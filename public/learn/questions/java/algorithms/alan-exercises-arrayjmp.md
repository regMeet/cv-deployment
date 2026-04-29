# Array Jmp

**Origin:** Personal &nbsp;|&nbsp; **Topics:** Arrays

*Source:* `alan/Exercises/ArrayJmp.java`

## Problem

Every element in an array of integers points to a relative location from the current element. Precisely, if A[k] = m,
the jump from k should land at k+A[k]=k+m.
Write a function
int arrayJmp(int[] A);
that returns the number of jumps until the pointer jumps out of the array when starting from the first element.

For example:
A[0]=2, A[1]=3, A[2]=1, A[3]=1, A[4]=3

The pointer's 1st jump is from 0 to 2, 2nd jump from 2 to 3, 3rd jump from 3 to 4, 4th jump from 4 to 7, but 7 is out of the array.
The number of jumps until the pointer jumps out of the array is 4.

Return -1 if the sequence of jumps never ends.

http://sajha.com/sajha/html/index.cfm?threadid=82940

## Solution

```java
public class ArrayJmp {
    private static int arrayJmp(int[] A) {
        int size = A.length;
        int counter = 0;
        for (int i = 0; (i > -1 && i < size); counter++, i += A[i]) {
            if (counter > size)
                return -1;
        }
        return counter;
    }

    public static void main(String[] args) {
        int[] array = new int[] { 2, 3, 1, 1, 3 };
        System.out.println(ArrayJmp.arrayJmp(array));
    }
}
```
