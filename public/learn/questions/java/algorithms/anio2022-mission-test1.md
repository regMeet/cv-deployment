# Test 1

**Origin:** Mission &nbsp;|&nbsp; **Topics:** Arrays

*Source:* `anio2022/mission/test1.java`

## Solution

```java
public class test1 {

    public int solution(int[] A) {
        int sum = 0;
        for (int i : A) {
            if (i % 4 == 0) {
                sum += i;
            }
        }
        return sum;
    }

    public static void main(String[] args) {
        test1 test = new test1();
        int[] numbers = { -6, -91, 1011, -100, 84, -22, 0, 1, 473 };
        int response = test.solution(numbers);
        System.out.println(response);
    }

}
```
