# Convert Int To String

**Origin:** JavaConceptOfTheDay &nbsp;|&nbsp; **Topics:** Strings

*Source:* `javaConceptOfTheDay/strings/ConvertIntToString.java`

## Solution

```java
public class ConvertIntToString {

    private static String convertIntToString(int n) {
        if (n == 0)
            return "0";
        StringBuilder sb = new StringBuilder();

        for (int i = 0; n > 0; i++) {
            int curr = n % 10;
            n = n / 10;
            sb.append(curr);

            if ((i + 1) % 3 == 0) {
                sb.append(",");
            }
        }

        // reverse the number
        String s = sb.substring(0);
        sb = new StringBuilder();
        for (int i = s.length() - 1; i >= 0; i--) {
            sb.append(s.charAt(i));
        }
        return sb.substring(0);
    }

    public static void main(String[] args) {
        System.out.println(convertIntToString(1234567890));
    }

}
```
