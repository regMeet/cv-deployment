# Lift Test

**Origin:** Lyft &nbsp;|&nbsp; **Topics:** Strings, Arrays

*Source:* `lyft/LiftTest.java`

## Problem

This solution reads from the System input

## Solution

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

public class LiftTest {

    public static void main(String[] args) {
        LiftTest test = new LiftTest();

        // test.autocompletionWithScanner();

        // One way without reading the System input
        test.autocompletion();
    }

    /**
     * This solution reads from the System input
     */
    public void autocompletionWithScanner() {
        Scanner in = new Scanner(System.in);
        int dictionaryWordsSize = in.nextInt();
        int autocompleteWordsSize = in.nextInt();
        // this is because https://stackoverflow.com/questions/13102045/scanner-is-skipping-nextline-after-using-next-or-nextfoo
        in.nextLine();

        List<String> dictionary = new ArrayList<>();
        for (int i = 0; i < dictionaryWordsSize; i++) {
            String s = in.nextLine().trim().toLowerCase();
            dictionary.add(s);
        }
        List<String> autocompleteWords = new ArrayList<>();
        for (int i = 0; i < autocompleteWordsSize; i++) {
            String s = in.nextLine().trim().toLowerCase();
            autocompleteWords.add(s);
        }

        printMatchingWords(dictionary, autocompleteWords);
    }

    /**
     * This second solution just creates the list of words and the dictionary.
     */
    public void autocompletion() {
        List<String> input = Arrays.asList("14", "4", "art", "zone", "zip", "arts", "date", "z", "day",
                "articles", "data", "catch", "zoom", "article", "articulate", "articulation", "catc", "art", "da", "z");

        int dictionaryWordsSize = Integer.valueOf(input.get(0));
        int autocompleteWordsSize = Integer.valueOf(input.get(1));

        List<String> dictionary = new ArrayList<>();
        List<String> autocompleteWords = new ArrayList<>();

        for (int i = 0; i < dictionaryWordsSize; i++) {
            dictionary.add(input.get(i + 2));
        }

        for (int i = 0; i < autocompleteWordsSize; i++) {
            autocompleteWords.add(input.get(i + 2 + dictionaryWordsSize));
        }

        printMatchingWords(dictionary, autocompleteWords);
    }

    /**
     * Prints the matching words from the dictionary
     *
     * @param dictionary
     * @param words
     */
    public void printMatchingWords(List<String> dictionary, List<String> words) {
        for (String word : words) {
            List<MatchWord> matchWords = getMatchWords(dictionary, word);
            System.out.println(word + ":");
            for (MatchWord m : matchWords) {
                System.out.println(m.getMatchingWord() + " (" + m.getPriority() + ")");
            }
            System.out.println();
        }
    }

    /**
     * Gets the match words for a specific word
     * FIXME: Converting the dictionary into a tree would improve the seek of the value to a logarithm search instead of being lineal
     *
     * @param dictionary contains all the possible words
     * @param word       is the word that needs the autocompletion
     * @return
     */
    public List<MatchWord> getMatchWords(List<String> dictionary, String word) {
        List<MatchWord> matchWords = new ArrayList<>();

        for (int i = 0; i < dictionary.size(); i++) {
            String currentWord = dictionary.get(i);
            boolean contains = currentWord.contains(word);
            if (contains) {
                MatchWord matchWord = new MatchWord(currentWord, i + 1);
                matchWords.add(matchWord);
            }
            if (matchWords.size() == 5) {
                break;
            }
        }

        return matchWords;
    }
}
```
