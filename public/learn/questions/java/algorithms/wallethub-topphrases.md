# Top Phrases

**Origin:** WalletHub &nbsp;|&nbsp; **Topics:** Hash Map, Strings

*Source:* `walletHub/TopPhrases.java`

## Problem

Given a large file that does not fit in memory (say 10GB), find the top 100000 most frequent phrases. The file has 50 phrases per line separated by a pipe (|). Assume
that the phrases do not contain pipe.
Example line may look like: Foobar Candy | Olympics 2012 | PGA | CNET | Microsoft Bing .... The above line has 5 phrases in visible region.

@author alan

## Solution

```java
import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Given a large file that does not fit in memory (say 10GB), find the top 100000 most frequent phrases. The file has 50 phrases per line separated by a pipe (|). Assume
 * that the phrases do not contain pipe.
 * Example line may look like: Foobar Candy | Olympics 2012 | PGA | CNET | Microsoft Bing .... The above line has 5 phrases in visible region.
 * 
 * @author alan
 * 
 */
public class TopPhrases {
    private static final int DEFAULT_LIMIT = 100000;

    /**
     * Finds the top phrases in a given input Stream
     * 
     * @param inputStream
     *            file to be processed
     * @return numberOfPhrases number of top phrases to be returned
     */
    private static Map<String, Integer> getTopPhrases(InputStream inputStream, int numberOfPhrases) {
        // Key: phrase, value: number ocurrences in the file
        Map<String, Integer> topPhrases = new LinkedHashMap<String, Integer>();

        try {
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));

            String line = null;
            while ((line = bufferedReader.readLine()) != null) {

                String[] phrases = line.split("\\|");

                // Read every phrase.
                for (String phrase : phrases) {
                    phrase = phrase.trim();

                    Integer ocurrenceNumber = topPhrases.get(phrase);

                    ocurrenceNumber = ocurrenceNumber != null ? ++ocurrenceNumber : 1;
                    topPhrases.put(phrase, ocurrenceNumber);
                }
            }

            // Limit the collection to DEFAULT_LIMIT constant.
            topPhrases = topPhrases.entrySet().stream().sorted(Map.Entry.comparingByValue(Comparator.reverseOrder())).limit(numberOfPhrases)
                    .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (v1, v2) -> v1, LinkedHashMap::new));

        } catch (FileNotFoundException e) {
            System.out.println("Exception thrown " + e);
        } catch (IOException e) {
            System.out.println("Exception thrown " + e);
        }

        return topPhrases;
    }

    public static void main(String[] args) {
        InputStream inputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream("phrases.txt");

        System.out.println("Top phrases from the file are:");
        System.out.println(getTopPhrases(inputStream, DEFAULT_LIMIT));
    }
}
```
