# Sort

**Origin:** Amazon &nbsp;|&nbsp; **Topics:** Arrays

*Source:* `alan/amazon/practice/sort.java`

## Problem

@param a
@param b - it will be modified
@param j = length of b

## Solution

```java
public class sort {
    public static void main(String[] args) {
        int A[] = { 1, 3, 5, 6, 9 };
        int B[] = new int[12];
        B[0] = 3;
        B[1] = 6;
        B[2] = 8;
        B[3] = 10;
        B[4] = 11;
        B[5] = 13;
        B[6] = 15;
        mergeInB(A, B, 7);
        for (int n : B)
            System.out.print(n + " ");
    }

    /**
     * @param a
     * @param b - it will be modified
     * @param j = length of b
     */
    public static void mergeInB(int[] a, int[] b, int j) {
        int i = a.length - 1, k;
        j--;
        for (k = b.length - 1; k >= 0; k--) {
            if (i >= 0 && j >= 0) {
                if (a[i] > b[j]) {
                    b[k] = a[i];
                    i--;
                } else {
                    b[k] = b[j];
                    j--;
                }
            } else
                break;
        }

        while (i >= 0 && k >= 0) {
            b[k] = a[i];
            k--;
            i--;
        }

        while (j >= 0 && k >= 0) {
            b[k] = b[j];
            j--;
            k--;
        }
    }
}
```
