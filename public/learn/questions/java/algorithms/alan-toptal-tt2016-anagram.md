# Anagram

**Origin:** Toptal &nbsp;|&nbsp; **Topics:** Hash Set, Strings, Arrays

*Source:* `alan/toptal/tt2016/Anagram.java`

## Problem

"Anagram": An anagram is a type of word play, the result of rearranging the letters of a word or phrase to produce a new
word or phrase using all the original letters exactly once; for example, the letters from 'icon' can be rearranged into
'coin'. The word is NOT an anagram of itself.
Devise a function that takes one parameter W and returns all the anagrams of W from the file wl.txt.
anagrams("beat") should return ["beta", "bate"]
==============================
Test cases:
"able" => ["abel", "bale", "beal"]
"apple" => ["appel"]
"spot" => ["post", "pots", "stop", "tops"]
"reset" => ["steer", "trees"]

## Solution

```java
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeSet;

/**
 * "Anagram": An anagram is a type of word play, the result of rearranging the letters of a word or phrase to produce a new
 * word or phrase using all the original letters exactly once; for example, the letters from 'icon' can be rearranged into
 * 'coin'. The word is NOT an anagram of itself.
 * Devise a function that takes one parameter W and returns all the anagrams of W from the file wl.txt.
 * anagrams("beat") should return ["beta", "bate"]
 * ==============================
 * Test cases:
 * "able" => ["abel", "bale", "beal"]
 * "apple" => ["appel"]
 * "spot" => ["post", "pots", "stop", "tops"]
 * "reset" => ["steer", "trees"]
 *
 */
public class Anagram {

    static public Set<String> permutation(String input) {
        return permutation("", input);
    }

    private static Set<String> permutation(String prefix, String str) {
        Set<String> permutations = new HashSet<String>();
        int n = str.length();
        if (n == 0) {
            permutations.add(prefix);
        } else {
            for (int i = 0; i < n; i++) {
                permutations.addAll(permutation(prefix + str.charAt(i), str.substring(i + 1, n) + str.substring(0, i)));
            }
        }
        return permutations;
    }

    public static void main(String[] args) {
        Set<String> dictionary = getWords("wl.txt");

        findAnagrams("able", dictionary);
        findAnagrams("apple", dictionary);
        findAnagrams("spot", dictionary);
        findAnagrams("reset", dictionary);
        findAnagrams("beat", dictionary);
    }

    private static void findAnagrams(String input, Set<String> dictionary) {
        Set<String> permutations = permutation(input);
        permutations.remove(input);

        Set<String> anagrams = getIntersection(permutations, dictionary);

        for (String anagram : anagrams) {
            System.out.println(anagram);
        }
        System.out.println("==========");
    }

    private static Set<String> getIntersection(Set<String> permutations, Set<String> words) {
        SortedSet<String> intersection = new TreeSet<String>();

        for (String permutation : permutations) {
            if (words.contains(permutation)) {
                intersection.add(permutation);
            }
        }

        return intersection;
    }

    private static Set<String> getWords(String fileName) {
        Set<String> wordsInFile = new HashSet<String>();

        BufferedReader reader = null;

        try {
            // Creating BufferedReader object
            File file = new File(fileName);
            reader = new BufferedReader(new FileReader(file));

            // Reading the first line into currentLine

            String currentLine = reader.readLine();

            while (currentLine != null) {
                // Getting number of words in currentLine

                String[] words = currentLine.split(" ");

                wordsInFile.addAll(Arrays.asList(words));

                // Reading next line into currentLine
                currentLine = reader.readLine();
            }

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                reader.close(); // Closing the reader
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return wordsInFile;
    }

}
```
