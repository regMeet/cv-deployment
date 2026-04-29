# Decimal Repr

**Origin:** Personal &nbsp;|&nbsp; **Topics:** Strings

*Source:* `alan/newest/decimal_repr.java`

## Solution

```java
// no lo entendi bien, asi que no se si esta bien
public class decimal_repr {

    public static String getDecimalRepresentation(int A, int B) {

        String result;
        int module = A % B;
        if (module != 0) {
            result = String.valueOf((float) A / B);
            if (result.length() > 4) {
                StringBuilder sb = new StringBuilder(result);
                sb.insert(4, "(");
                sb.insert(sb.length(), ")");
                result = sb.toString();
            }
        } else {
            result = String.valueOf(A / B);
        }

        System.out.println("result of " + A + "/" + B + " " + result);

        return result;
    }

    public static void main(String[] args) {
        String decimalRepresentation = getDecimalRepresentation(3, 28);
        System.out.println(decimalRepresentation);
        getDecimalRepresentation(1, 3); // should return 0.(3) instead of 0.33(333334)
        getDecimalRepresentation(5, 2);
        getDecimalRepresentation(6, 3);
    }

}
```
