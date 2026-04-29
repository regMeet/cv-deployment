# Test 3

**Origin:** Other &nbsp;|&nbsp; **Topics:** Arrays

*Source:* `test3.java`

## Solution

```java
public class test3 {

    private int solution(int[] A) {
        int n = A.length;

        if (n < 0 || n > 1000) {
            return 0;
        }

        int result = 0;

        for (int i = 0; i < n - 1; i++) {
            if (A[i] == A[i + 1])
                result = result + 1;
        }

        int r = 0;

        for (int i = 0; i < n; i++) {
            int count = 0;
            if (i > 0) {
                if (A[i - 1] != A[i])
                    count = count + 1;
                else
                    count = count - 1;
            }
            if (i < n - 1) {
                if (A[i + 1] != A[i])
                    count = count + 1;
                else
                    count = count - 1;
            }
            r = Math.max(r, count);
        }

        if (r == 0) {
            r = -1;
        }

        return result + r;
    }

    public static void main(String[] args) {
        test3 test3 = new test3();

         System.out.println("longestQuasiConstantSubsecuence: " + test3.solution(new int[] { 1, 1, 0, 1, 0, 0 }));
         System.out.println();

        System.out.println("longestQuasiConstantSubsecuence: " + test3.solution(new int[] { 1, 0, 0, 1 }));
        System.out.println();

         System.out.println("longestQuasiConstantSubsecuence: " + test3.solution(new int[] { 1, 1, 0, 0, 1, 0, 0 }));
         System.out.println();

         System.out.println("longestQuasiConstantSubsecuence: " + test3.solution(new int[] { 0, 2 }));
         System.out.println();

        // System.out.println("longestQuasiConstantSubsecuence: " + test3.solution(new int[] { 6, 5, 3, 1, 11, 9, 9, 6, 9, 7 }));
        System.out.println();

    }

}
```
