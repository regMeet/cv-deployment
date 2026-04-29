# Heavy Decimal Count

**Origin:** Personal &nbsp;|&nbsp; **Topics:** Misc

*Source:* `alan/todo/heavy_decimal_count.java`

## Problem

A non-negative integer is called heavy if the average value of its digits in decimal representation exceeds 7. Assume that 0 has an average value of its digits equal to 0.

For example, the number 8,698 is heavy because the average value of its digits is (8+6+9+8)/4 = 7.75.
The number 53,141 has an average value of its digits of (5+3+1+4+1)/5 = 2.8, so it is not heavy.

Write a function:

function heavy_decimal_count($A,$B);

that, given two non-negative integers A and B, returns the number of heavy integers within the interval [A..B] (both ends included).

Assume that:

A is an integer within the range [0..200,000,000];
B is an integer within the range [0..200,000,000];
A ≤ B.
For example, given A=8,675 and B=8,689 the function should return 5, because there are five heavy integers within the range [8,675..8,689]:

8675    avg=6.50
8676    avg=6.75
8677    avg=7.00
8678    avg=7.25    HEAVY
8679    avg=7.50    HEAVY
8680    avg=5.50
8681    avg=5.75
8682    avg=6.00
8683    avg=6.25
8684    avg=6.50
8685    avg=6.75
8686    avg=7.00
8687    avg=7.25    HEAVY
8688    avg=7.50    HEAVY
8689    avg=7.75    HEAVY
Complexity:

expected worst-case time complexity is O((log(A)+log(B))3);
expected worst-case space complexity is O(log(A)+log(B)).

## Solution

```java
public class heavy_decimal_count {

    // tiene que haber una cuenta matematica
    // recorrer todos los nros viendo que tan lejos estoy de 7, al terminar sumar 1, tiene que ser > 7
    // si el valor es mayor a 9 devolver 0.
    // sino ver como se llega a 7

    public int solution(int a, int b) {
        int count = 0;

        for (int number = a; number <= b; number++) {
            int maximumNotAllowedSum = lengthOf(number) * 7;
            int sum = sumOfDigitsOf(number);
            if (sum > maximumNotAllowedSum) {
                count++;
            } else {
                number += maximumNotAllowedSum - sum;
            }
        }

        return count;
    }

    public int sumOfDigitsOf(int number) {
        int sum = 0;
        while (number > 0) {
            sum += number % 10;
            number /= 10;
        }
        return sum;
    }

    public int lengthOf(int number) {
        int length = 0;
        while (number > 0) {
            length++;
            number /= 10;
        }
        return length;
    }

}
```
