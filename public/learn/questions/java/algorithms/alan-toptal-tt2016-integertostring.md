# Integer To String

**Origin:** Toptal &nbsp;|&nbsp; **Topics:** Strings

*Source:* `alan/toptal/tt2016/IntegerToString.java`

## Problem

Devise a function that takes an input 'n' (integer) and returns a string that is the decimal representation of the number grouped by
commas after every 3 digits.
Do not solve the task using a built-in formatting function that can accomplish the whole task on its own.
Assume: 0 <= n < 1000000000
1 -> "1"
10 -> "10"
100 -> "100"
1000 -> "1,000"
10000 -> "10,000"
100000 -> "100,000"
1000000 -> "1,000,000"
35235235 -> "35,235,235"
999999999 -> �999,999,999"

## Solution

```java
public class IntegerToString {

    private static String convertIntToString(int n) {
        if (n == 0) {
            return "0";
        } else if (n >= 1000000000) {
            return "-1";
        }

        StringBuilder reverseNumber = new StringBuilder();

        for (int i = 0; n > 0; i++) {
            reverseNumber.append(n % 10);
            n = n / 10;

            if ((i + 1) % 3 == 0 && n > 0) {
                reverseNumber.append(",");
            }
        }

        // reverse the number
        StringBuilder number = new StringBuilder();
        for (int i = reverseNumber.length() - 1; i >= 0; i--) {
            number.append(reverseNumber.charAt(i));
        }
        return number.toString();
    }

    public static void main(String[] args) {
        System.out.println(convertIntToString(1234567));
    }

}
```
