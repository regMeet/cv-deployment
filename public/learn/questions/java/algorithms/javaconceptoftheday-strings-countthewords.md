# Count The Words

**Origin:** JavaConceptOfTheDay &nbsp;|&nbsp; **Topics:** Strings

*Source:* `javaConceptOfTheDay/strings/CountTheWords.java`

## Solution

```java
import java.util.Scanner;

public class CountTheWords {

    public static void main(String[] args) {
        System.out.println("Enter the string");

        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        sc.close();

        countWords(s);
    }

    private static void countWords(String s) {
        String[] words = s.trim().split(" ");

        System.out.println("Number of words in the string = " + words.length);
    }

    public static void countWords2(String s) {
        int count = 1;

        for (int i = 0; i < s.length() - 1; i++) {
            if ((s.charAt(i) == ' ') && (s.charAt(i + 1) != ' ')) {
                count++;
            }
        }

        System.out.println("Number of words in a string = " + count);
    }

}
```
