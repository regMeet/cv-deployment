# Fb

**Origin:** Facebook &nbsp;|&nbsp; **Topics:** Strings

*Source:* `fb/Fb.java`

## Solution

```java
public class Fb {

    public static void main(String[] args) {
        // System.out.println("Result: " + balancePhrase("(a)"));
        System.out.println("Result: " + balancePhrase(")(((a)()"));

        System.out.println("Result: " + balancePhrase(")(((a))()"));

        System.out.println("Result: " + balancePhrase("()(((a))()"));

        System.out.println("Result: " + balancePhrase("a((("));
    }

    public static String balancePhrase(String phrase) {
        StringBuilder sb = new StringBuilder(phrase);
        int counter = 0;

        for (int i = 0; i < phrase.length() -1 ; i++) {
            Character c = phrase.charAt(i);
            if (c.equals('(')){
                counter++;
            } else if (c.equals(')')) {
                if (counter == 0) {
                    sb.deleteCharAt(i);
                } else {
                    counter--;
                }
            }
        }

        if (counter > 0) {
            String toLeft = sb.toString();
            counter = 0;

            for (int i = toLeft.length() - 1; i >= 0; i--) {
                Character c = toLeft.charAt(i);
                if (c.equals(')')){
                    counter++;
                } else if (c.equals('(')) {
                    if (counter == 0) {
                        sb.deleteCharAt(i);
                    } else {
                        counter--;
                    }
                }
            }


        }
        return sb.toString();
    }

}
```
