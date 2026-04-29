# Test 2

**Origin:** Amazon &nbsp;|&nbsp; **Topics:** Arrays

*Source:* `anio2022/amazon/test2.java`

## Solution

```java
public class test2 {

    // findMaxProducts
    public static long max(int[] products) {
        // Write your code here
        // start from the end and rest 1 to each pile and check the max products
        // then start from the end - 1 and do the same until start position

        int max = 0;
        for (int i = products.length - 1; i >= 0; i--) {
            int lastNumber = products[i];

            int currentMax = lastNumber;
            System.out.println("peak: " + lastNumber);
            for (int j = i - 1; j >= 0; j--) {
                System.out.println("lastNumber: " + lastNumber);
                int currentNumber = products[j];
                System.out.println("currentNumber: " + currentNumber);
                if (currentNumber < lastNumber) {
                    System.out.println("plus: " + currentNumber);
                    currentMax += currentNumber;
                } else {
                    currentNumber = lastNumber - 1;
                    System.out.println("currentNumber updated: " + currentNumber);
                    if (currentNumber > 0) {
                        System.out.println("more : " + currentNumber);
                        currentMax += currentNumber;
                    }
                }
                lastNumber = currentNumber;
            }
            max = currentMax > max ? currentMax : max;
            System.out.println("currentMax" + currentMax);
            System.out.println("max" + max);
            System.out.println("");
        }
        return max;
    }

    public static void main(String[] args) {
        // System.out.println(new test2().max(new int[] { 2, 5, 6, 7 })); // 20

        // System.out.println(new test2().max(new int[] { 6, 2, 9, 4, 7, 5, 2 })); 17 -
        // 16
        System.out.println(new test2().max(new int[] { 2, 9, 4, 7, 5, 2 })); // 16 OK

    }

}
```
