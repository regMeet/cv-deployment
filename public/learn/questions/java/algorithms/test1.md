# Test 1

**Origin:** Other &nbsp;|&nbsp; **Topics:** Arrays

*Source:* `test1.java`

## Solution

```java
import java.util.Arrays;

public class test1 {

    private int getNumberOfArithmeticSubsecuences(int[] a) {
        int sum = 0;

        int length = a.length;
        if (length >= 3) {

            // get slices bigger than 3
            for (int slice = 3; slice <= length; slice++) {

                for (int i = 0; i < length; i++) {

                    if ((i + slice) <= length) {
                        int[] subsequence = Arrays.copyOfRange(a, i, i + slice);

                        boolean isArithmetic = isArithmetic(subsequence);
                        if (isArithmetic) {
                            sum++;
                        }
                    }
                }
            }

        }

        return sum;
    }

    private boolean isArithmetic(int[] subsequence) {
        boolean isArithmetic = true;

        int arithmeticDiff = Math.abs(subsequence[0] - subsequence[1]);

        for (int i = 1; i < subsequence.length; i++) {
            int previousNumber = subsequence[i - 1];
            int currentNumber = subsequence[i];

            int diff = Math.abs(previousNumber - currentNumber);

            if (diff != arithmeticDiff) {
                isArithmetic = false;
                break;
            }
        }

        if (isArithmetic) {
            System.out.println(Arrays.toString(subsequence) + " isArithmetic :" + isArithmetic);
        } else {
            System.out.println(Arrays.toString(subsequence));
        }

        return isArithmetic;
    }

    public static void main(String[] args) {
        test1 test1 = new test1();

        System.out.println("getNumberOfArithmeticSubsecuences: " + test1.getNumberOfArithmeticSubsecuences(new int[] { 1, 2, 3, 4, 5, 6 }));
        System.out.println();

        System.out.println("getNumberOfArithmeticSubsecuences: " + test1.getNumberOfArithmeticSubsecuences(new int[] { -1, 1, 3, 4, 5, 6, 2, 1, 0 }));
        System.out.println();

        System.out.println("getNumberOfArithmeticSubsecuences: " + test1.getNumberOfArithmeticSubsecuences(new int[] { 1, 3, 5, 7, 9 }));
        System.out.println();

        System.out.println("getNumberOfArithmeticSubsecuences: " + test1.getNumberOfArithmeticSubsecuences(new int[] { 7, 7, 7, 7 }));
        System.out.println();

    }

}
```
