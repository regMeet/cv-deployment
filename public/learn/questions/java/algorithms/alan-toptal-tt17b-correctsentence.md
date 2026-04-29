# Correct Sentence

**Origin:** Toptal &nbsp;|&nbsp; **Topics:** Strings

*Source:* `alan/toptal/tt17b/CorrectSentence.java`

## Problem

Write a program that will correct an input string to use proper capitalization and spacing.
Allowed punctuation are the period (.), question mark (?), and exclamation (!).
Make sure that commas (,), colons (:), semicolons (;) and all other punctuation are always
followed by spaced. The input string will be a valid English sentence.

Example: "first,solve the problem.then,write the code."
Output: "First, solve the problem. Then, write the code."

Example: "this is a test...and another test."
Output: "This is a test... And another test."

Test cases:
"hello. how are you today? great! i'm fine too."
"Hello. How are you today? Great! I'm fine too."

"do.or do not.there is no try."
"Do. Or do not. There is no try."

"the conference has people who have come from Moscow,Idaho;Paris,Texas;London,Ohio;and other places as well."
"The conference has people who have come from Moscow, Idaho; Paris, Texas; London, Ohio; and other places as well."

## Solution

```java
public class CorrectSentence {

    public static void main(String[] args) {
        System.out.println(CorrectSentence.capitalization("first,solve the problem.then,write the code."));

        System.out.println(CorrectSentence.capitalization("this is a test?yes"));

        System.out.println(CorrectSentence.capitalization("this is a test... and another test."));
        //
        System.out.println(CorrectSentence.capitalization("the conference has people who have come from Moscow,Idaho; Paris,Texas;London,Ohio; and other places as well."));

        System.out.println(CorrectSentence.capitalization("do.or  do not. there is not try."));

        System.out.println(CorrectSentence.capitalization("Hola           Alan."));
    }

    private static String capitalization(String phrase) {

        boolean capitalize = true;
        boolean addSpace = false;

        StringBuilder sb = new StringBuilder();

        char[] charArray = phrase.toCharArray();

        for (int i = 0; i < charArray.length; i++) {
            char current = charArray[i];

            if (current == '.') {
                while (i + 1 < charArray.length && charArray[i + 1] == '.') {
                    i++;
                    sb.append(charArray[i]);
                }
                capitalize = true;
            }

            if (current == ' ') {
                while (i + 1 < charArray.length && charArray[i + 1] == ' ') {
                    i++;
                    current = charArray[i];
                }
            }

            if (addSpace) {
                sb.append(" ");
            }
            if (capitalize) {
                sb.append(Character.toUpperCase(current));
            } else {
                sb.append(current);
            }

            if (current == '.' || current == '?' || current == '!') {
                capitalize = true;
                addSpace = true;
            } else if (current == ',' || current == ':' || current == ';') {
                addSpace = true;
                capitalize = false;
            } else if (current == ' ') {
                // do nothing
            } else {
                capitalize = false;
                addSpace = false;
            }

            if (i + 1 < charArray.length && charArray[i + 1] == ' ') {
                addSpace = false;
            }

        }

        return sb.toString();
    }

}
```
