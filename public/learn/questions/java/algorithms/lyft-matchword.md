# Match Word

**Origin:** Lyft &nbsp;|&nbsp; **Topics:** Misc

*Source:* `lyft/MatchWord.java`

## Solution

```java
// I would make it a maven project and then add lombok dependency for the getters and setters
public class MatchWord implements Comparable<MatchWord> {
    private final String matchingWord;
    private final Integer priority;

    public MatchWord(String matchingWord, Integer priority) {
        this.matchingWord = matchingWord;
        this.priority = priority;
    }

    public String getMatchingWord() {
        return matchingWord;
    }

    public Integer getPriority() {
        return priority;
    }

    @Override
    public int compareTo(MatchWord otherWord) {
        return (this.getPriority() - otherWord.getPriority());
    }
}
```
