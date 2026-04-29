# Reverse Each Word

**Origin:** JavaConceptOfTheDay &nbsp;|&nbsp; **Topics:** Strings

*Source:* `javaConceptOfTheDay/strings/ReverseEachWord.java`

## Solution

```java
public class ReverseEachWord {

    static void reverseEachWordOfString(String inputString) {
        String[] words = inputString.split(" ");

        String reverseString = reverseWords(words);

        System.out.println(inputString);

        System.out.println(reverseString);

        System.out.println("-------------------------");
    }

    private static String reverseWords(String[] words) {
        String reverseString = "";

        for (int i = 0; i < words.length; i++) {
            String reverseWord = reverseWord(words[i]);

            reverseString = reverseString + reverseWord + " ";
        }
        return reverseString;
    }

    private static String reverseWord(String word) {
        String reverseWord = "";

        for (int j = word.length() - 1; j >= 0; j--) {
            reverseWord = reverseWord + word.charAt(j);
        }
        return reverseWord;
    }

    public static void main(String[] args) {
        reverseEachWordOfString("Java Concept Of The Day");

        reverseEachWordOfString("Java J2EE JSP Servlets Hibernate Struts");

        reverseEachWordOfString("I am string not reversed");

        reverseEachWordOfString("Reverse Me");
    }
}
```
