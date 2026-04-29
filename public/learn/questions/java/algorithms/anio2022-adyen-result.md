# Result

**Origin:** Adyen &nbsp;|&nbsp; **Topics:** Sorting

*Source:* `anio2022/adyen/Result.java`

## Problem

@param cardNumber 12 to 23 digit card number.

@return the card type for this cardNumber or null if the card number does not
        fall into any valid bin ranges.

## Solution

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class Result {

    static final class BinRange implements Comparable<BinRange> {
        final String start;
        final String end;
        final String cardType;

        BinRange(String start, String end, String cardType) {
            this.start = start;
            this.end = end;
            this.cardType = cardType;
        }

        @Override
        public int compareTo(BinRange b) {
            return start.compareTo(b.start);
        }

        @Override
        public String toString() {
            return "Card: " + cardType + ". Starts: " + start + ". Ends: " + end;
        }
    }

    interface CardTypeCache {
        /**
         * @param cardNumber 12 to 23 digit card number.
         * 
         * @return the card type for this cardNumber or null if the card number does not
         *         fall into any valid bin ranges.
         */
        String get(String cardNumber);
    }

    static class Cache implements CardTypeCache {
        List<BinRange> cache = new ArrayList<>();

        Cache(List<BinRange> binRanges) {
            this.cache = binRanges;
            System.out.println(binRanges);
        }

        @Override
        public String get(String cardNumber) {
            String found = null;
            int first = 0;
            int last = cache.size() - 1;

            while (first < last) {
                int mid = (first + last) / 2;
                String midValue = cache.get(mid).start;

                if (midValue.compareTo(cardNumber) < 0) {
                    first = mid + 1;
                } else {
                    last = mid - 1;
                }
            }

            BinRange lastRange = cache.get(first);

            if (cardNumber.compareTo(lastRange.start) >= 0 && cardNumber.compareTo(lastRange.end) < 0) {
                found = lastRange.cardType;
            }

            return found;
        }
    }

    /**
     * @param binRanges the list of card bin ranges to build a cache from.
     *
     * @return an implementation of CardTypeCache.
     */
    public static CardTypeCache buildCache(List<BinRange> binRanges) {
        Cache cache = new Cache(binRanges);
        Collections.sort(binRanges);
        return cache;
    }

    public static void main(String[] args) {

        List<BinRange> binRanges = Arrays.asList(
                new BinRange("100", "120", "visa"),
                new BinRange("130", "150", "mc"),
                new BinRange("160", "180", "ae"));

        CardTypeCache cache = buildCache(binRanges);

        String card = "100";
        String result = cache.get(card);

        System.out.println("Result: '" + result + "' for card number: " + card);

    }

}
```
