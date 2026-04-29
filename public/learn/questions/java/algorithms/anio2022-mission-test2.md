# Test 2

**Origin:** Mission &nbsp;|&nbsp; **Topics:** Arrays

*Source:* `anio2022/mission/test2.java`

## Solution

```java
public class test2 {

    public int checkReverseAmount(int[] A, int check) {
        int min = 0;

        for (int i : A) {
            if (i != check) {
                min += 1;
            }
            check = check == 0 ? 1 : 0;
        }
        return min;
    }

    public int solution(int[] A) {
        int min1 = checkReverseAmount(A, 0);
        int min2 = checkReverseAmount(A, 1);

        return Math.min(min1, min2);
    }

    public static void main(String[] args) {
        System.out.println(new test2().solution(new int[] { 1, 0, 1, 0, 1, 1 }));
        System.out.println(new test2().solution(new int[] { 1, 1, 0, 1, 1 }));
        System.out.println(new test2().solution(new int[] { 0, 1, 0 }));
        System.out.println(new test2().solution(new int[] { 0, 1, 1, 0 }));
    }

}
```
