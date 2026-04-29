# Baseball

**Origin:** Amazon &nbsp;|&nbsp; **Topics:** Misc

*Source:* `alan/amazon/interview/Baseball.java`

## Solution

```java
public class Baseball {

    // METHOD SIGNATURE BEGINS, THIS METHOD IS REQUIRED
    public static int totalScore(String[] blocks, int n) {
        int totalScore = 0;
        int lastScore = 0;
        int previousLastScore = 0;
        int newScore = 0;

        for (String value : blocks) {
            if (value != null) {

                try {
                    newScore = Integer.valueOf(value);
                } catch (NumberFormatException e) {

                    switch (value) {
                    case "Z":
                    case "z":
                        newScore = -lastScore;
                        break;
                    case "+":
                        newScore = previousLastScore + lastScore;
                        break;
                    case "X":
                    case "x":
                        newScore = lastScore;
                        break;
                    default:
                        newScore = 0;
                    }
                }
                totalScore += newScore;
                previousLastScore = lastScore;
                lastScore = newScore;
            }
        }

        return totalScore;
    }

    public static void main(String[] args) {
        String[] blocks = new String[] { "5", "-2", "4", "Z", "X", "9", "+", "+" };
        int totalScore = totalScore(blocks, 8);
        System.out.println(totalScore);

        blocks = new String[] { "1", "2", "+", "z", null };
        totalScore = totalScore(blocks, 8);
        System.out.println(totalScore);
    }

}
```
