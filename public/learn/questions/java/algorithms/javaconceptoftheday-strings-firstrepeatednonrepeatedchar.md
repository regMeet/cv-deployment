# First Repeated Non Repeated Char

**Origin:** JavaConceptOfTheDay &nbsp;|&nbsp; **Topics:** Hash Map, Strings

*Source:* `javaConceptOfTheDay/strings/FirstRepeatedNonRepeatedChar.java`

## Solution

```java
import java.util.HashMap;

public class FirstRepeatedNonRepeatedChar {

    static void firstRepeatedNonRepeatedChar(String s) {

        String nonRepeated = null;
        String repeated = null;
        String copy;

        for (int i = 0; i < s.length(); i++) {
            char charAt = s.charAt(i);
            copy = s.replaceAll("" + charAt, "");
            if (repeated == null && s.length() - copy.length() > 1) {
                repeated = "" + charAt;
            } else if (nonRepeated == null && s.length() - copy.length() == 1) {
                nonRepeated = "" + charAt;
            } else if (repeated != null && nonRepeated != null) {
                System.out.println(String.format("%s/%s", i, s.length()));
                break;
            }
        }
        System.out.println("nonRepeated: " + nonRepeated);
        System.out.println("repeated: " + repeated);

    }

    static void firstRepeatedNonRepeatedChar2(String inputString) {
        // Creating a HashMap containing char as a key and occurrences as a value

        HashMap<Character, Integer> charCountMap = new HashMap<Character, Integer>();

        // Converting inputString to char array

        char[] strArray = inputString.toCharArray();

        // Checking each char of strArray

        for (char c : strArray) {
            if (charCountMap.containsKey(c)) {
                // If char is present in charCountMap, incrementing it's count by 1

                charCountMap.put(c, charCountMap.get(c) + 1);
            } else {
                // If char is not present in charCountMap,
                // adding this char in charCountMap with 1 as it's value

                charCountMap.put(c, 1);
            }
        }

        // checking for first non-repeated character

        for (char c : strArray) {
            if (charCountMap.get(c) == 1) {
                System.out.println("First Non-Repeated Character In '" + inputString + "' is '" + c + "'");

                break;
            }
        }

        // checking for first repeated character

        for (char c : strArray) {
            if (charCountMap.get(c) > 1) {
                System.out.println("First Repeated Character In '" + inputString + "' is '" + c + "'");

                break;
            }
        }
    }

    public static void main(String[] args) {
        firstRepeatedNonRepeatedChar("JavaConceptOfTheDay");
        firstRepeatedNonRepeatedChar("alalalon");

        firstRepeatedNonRepeatedChar2("JavaConceptOfTheDay");
        firstRepeatedNonRepeatedChar2("alalalon");
    }
}
```
