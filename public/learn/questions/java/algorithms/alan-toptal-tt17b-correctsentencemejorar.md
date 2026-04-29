# Correct Sentence Mejorar

**Origin:** Toptal &nbsp;|&nbsp; **Topics:** Misc

*Source:* `alan/toptal/tt17b/CorrectSentenceMejorar.java`

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
public class CorrectSentenceMejorar {

    public static void main(String[] args) {
        System.out.println(CorrectSentenceMejorar.capitalization("first,solve the problem.then,write the code."));

        System.out.println(CorrectSentenceMejorar.capitalization("this is a test?yes"));

        System.out.println(CorrectSentenceMejorar.capitalization("this is a test... and another test."));
        //
        System.out.println(CorrectSentenceMejorar.capitalization("the conference has people who have come from Moscow,Idaho; Paris,Texas;London,Ohio; and other places as well."));

        System.out.println(CorrectSentenceMejorar.capitalization("do.or  do not. there is not try."));

        System.out.println(CorrectSentenceMejorar.capitalization("Hola           Alan."));
    }

    // use different methods
    // first upper case,
    // add space after simbols

    private static String capitalization(String phrase) {
        return null;
    }

}
```
