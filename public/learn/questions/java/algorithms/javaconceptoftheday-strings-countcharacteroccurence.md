# Count Character Occurence

**Origin:** JavaConceptOfTheDay &nbsp;|&nbsp; **Topics:** Misc

*Source:* `javaConceptOfTheDay/strings/CountCharacterOccurence.java`

## Solution

```java
public class CountCharacterOccurence {

    public static void main(String[] args) {
        String s = "Java is java again java again";

        char c = 'a';
        countCharacters(s, c);
    }

    private static void countCharacters(String s, char c) {
        int count = s.length() - s.replace("" + c, "").length();

        System.out.println("Number of occurances of " + c + " in " + s + " = " + count);
    }

}
```
