# Convert String To Integer

**Origin:** JavaConceptOfTheDay &nbsp;|&nbsp; **Topics:** Strings

*Source:* `javaConceptOfTheDay/strings/ConvertStringToInteger.java`

## Solution

```java
public class ConvertStringToInteger {

    static void convertString(String number) {
        // int i1 = Integer.parseInt(number);
        // System.out.println(i1);

        // int i2 = Integer.valueOf(number);
        // System.out.println(i2);

        boolean isNegative = false;

        int result = 0;
        int result2 = 0;

        int length = number.length();
        for (int i = 0; i < length; i++) {
            if (number.charAt(i) == '-') {
                isNegative = true;
                continue;
            }

            int pow = length - 1 - i;
            double pow2 = Math.pow(10, pow);
            int charAt = number.charAt(i) - '0';
            result += charAt * pow2;

            result2 = result2 * 10 + number.charAt(i) - '0';
        }

        if (isNegative) {
            result *= -1;
        }
        System.out.println(result);
        System.out.println(result2);

    }

    public static void main(String[] args) {
        convertString("-12345");
    }

}
```
