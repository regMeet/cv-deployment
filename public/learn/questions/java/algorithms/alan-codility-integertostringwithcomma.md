# Integer To String With Comma

**Origin:** Codility &nbsp;|&nbsp; **Topics:** Strings

*Source:* `alan/codility/IntegerToStringWithComma.java`

## Problem

Devise a function that takes an input 'n' (integer) and returns a string that is the
decimal representation of that number grouped by commas after every 3 digits. You can't
solve the task using a built-in formatting function that can accomplish the whole
task on its own.

Assume: 0 <= n < 1000000000

1 -> "1"
10 -> "10"
100 -> "100"
1000 -> "1,000"
10000 -> "10,000"
100000 -> "100,000"
1000000 -> "1,000,000"
35235235 -> "35,235,235"

## Solution

```java
public class IntegerToStringWithComma {

    private static String intToString(int n) {
        if (n == 0) {
            return "0";
        } else if (n >= 1000000000) {
            return "";
        }

        StringBuilder reverseNumber = new StringBuilder();

        for (int i = 1; n > 0; i++) {
            reverseNumber.append(n % 10);
            n /= 10;

            if (i % 3 == 0 && n > 0) {
                reverseNumber.append(",");
            }
        }

        return reverseNumber.reverse().toString();
    }

    public static void main(String[] args) {
        int n = 1234567;
        System.out.println(intToString(n));

    }

}
```
