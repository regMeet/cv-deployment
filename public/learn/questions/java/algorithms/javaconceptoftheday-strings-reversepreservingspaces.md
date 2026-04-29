# Reverse Preserving Spaces

**Origin:** JavaConceptOfTheDay &nbsp;|&nbsp; **Topics:** Strings

*Source:* `javaConceptOfTheDay/strings/ReversePreservingSpaces.java`

## Problem

@author Alan

## Solution

```java
public class ReversePreservingSpaces {

    public static void reverseString(String inputString) {

        String copyOfString = inputString.replace(" ", "");
        String reverseCopyOfString = new StringBuffer(copyOfString).reverse().toString();

        char[] resultArray = new char[inputString.length()];

        for (int i = 0, j = 0; i < inputString.length(); i++) {
            char charAt = inputString.charAt(i);
            if (charAt == ' ') {
                resultArray[i] = ' ';
            } else {
                char reverseCharAt = reverseCopyOfString.charAt(j++);
                resultArray[i] = reverseCharAt;
            }
        }

        System.out.println(inputString + " ---> " + String.valueOf(resultArray));

    }

    public static void main(String[] args) {
        reverseString("I Am Not String");
    }

}
```
