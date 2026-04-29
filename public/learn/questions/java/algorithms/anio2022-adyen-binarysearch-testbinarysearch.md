# Test Binary Search

**Origin:** Adyen &nbsp;|&nbsp; **Topics:** Binary Search, Sorting

*Source:* `anio2022/adyen/binarysearch/testBinarySearch.java`

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

public class testBinarySearch {

    public static Person binarySearchAge(Person[] people, int age) {
        Person found = null;
        int first = 0;
        int last = people.length - 1;

        while (first <= last) {
            int mid = (first + last) / 2;
            int midAge = people[mid].getAge();
            if (age == midAge) {
                found = people[mid];
                break;
            }
            if (midAge < age) {
                first = mid + 1;
            } else {
                last = mid - 1;
            }
        }

        return found;
    }

    public static Person binarySearchName(Person[] people, String name) {
        Person found = null;
        int first = 0;
        int last = people.length - 1;

        while (first <= last) {
            int mid = (first + last) / 2;
            String midName = people[mid].getName();
            if (name.equals(midName)) {
                found = people[mid];
                break;
            }
            if (midName.compareTo(name) < 0) {
                first = mid + 1;
            } else {
                last = mid - 1;
            }
        }
        return found;
    }

    public static void main2(String[] args) {
        Person[] people = {
                new Person("alan", 36),
                new Person("stefi", 26),
                new Person("dari", 30),
                new Person("denis", 30),
                new Person("jazmin", 1),
                new Person("loba", 14),
                new Person("kevin", 11),
        };
        Arrays.sort(people);
        // System.out.println(Arrays.toString(people));
        System.out.println("Person found: " + binarySearchAge(people, 26));

        Arrays.sort(people, Person::compareName);
        System.out.println("Person found: " + binarySearchName(people, "alan"));
        // System.out.println(Arrays.toString(people));

        // Arrays.sort(people, (a, b) -> a.getName().compareTo(b.getName()));

    }

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
            if (found == null) {
                BinRange lastRange = cache.get(first);
                String startRange = lastRange.start;
                String endRange = lastRange.end;

                if (startRange.compareTo(cardNumber) <= 0 && endRange.compareTo(cardNumber) > 0) {
                    return lastRange.cardType;
                }
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

        List<BinRange> binRanges = Arrays.asList(new BinRange("100", "120", "visa"), new BinRange("130", "150", "mc"),
                new BinRange("160", "180", "ae"));

        CardTypeCache cache = buildCache(binRanges);
        System.out.println(cache);

        System.out.println(cache.get("160"));

    }

}
```
