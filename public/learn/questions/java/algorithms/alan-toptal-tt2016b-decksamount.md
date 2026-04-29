# Decks Amount

**Origin:** Toptal &nbsp;|&nbsp; **Topics:** Strings, Arrays, Design / OOP

*Source:* `alan/toptal/tt2016b/DecksAmount.java`

## Problem

In a casino all the playing cards got mixed up, some of them got lost. You have to
collect as many full decks as possible.

You get N mixed up French playing cards as your input.

The cards are of the following ranks:
1,2,3,4,5,6,7,8,9,T,J,Q,K,A

The four suits are:
Spade(♠), Club(♣), Heart(♥), and Diamond(♦)

The cards are given using their rank followed by their suit:

2 of Spades: 2S
Ace of Clubs: AC
10 of Hearts: TH

Example: ["9C","KS","AC","AH","8D","4C","KD","JC","7D","9D","2H","7C","3C","7

## Solution

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * In a casino all the playing cards got mixed up, some of them got lost. You have to
 * collect as many full decks as possible.
 * 
 * You get N mixed up French playing cards as your input.
 * 
 * The cards are of the following ranks:
 * 1,2,3,4,5,6,7,8,9,T,J,Q,K,A
 * 
 * The four suits are:
 * Spade(♠), Club(♣), Heart(♥), and Diamond(♦)
 * 
 * The cards are given using their rank followed by their suit:
 * 
 * 2 of Spades: 2S
 * Ace of Clubs: AC
 * 10 of Hearts: TH
 * 
 * Example: ["9C","KS","AC","AH","8D","4C","KD","JC","7D","9D","2H","7C","3C","7
 *
 */
public class DecksAmount {

    public static void main(String[] args) {

        // String cartas =
        // "5C,5C,2S,JS,TC,JC,2H,9C,QH,2D,7H,2H,QS,KD,3D,4C,QS,8S,8H,5H,7D,9D,QH,5C,TD,KS,AH,3C,AS,4C,6C,TH,KC,AH,AC,2C,JC,4S,QD,4C,9S,KD,8C,TC,TS,AC,TC,JH,9D,3D,TH,7H,7D,KH,QC,2D,KH,AH,JH,TC,JS,6H,3C,TS,TH,TC,TC,4D,KC,QD,9D,3D,4C,TD,7H,5S,8S,8C,6S,TD,KC,5S,7S,6S,4H,4H,3D,QC,6S,AC,AD,3H,TC,5H,6C,2H,6S,6S,6H,4C,7H,8D,4D,TH,JC,AH,2H,7C,AD,2H,6D,KD,6C,7D,5D,QS,QD,TS,5S,2H,5H,3H,3S,3D,2H,3H,JD,3C,7C,4S,AC,KS,9C,8D,2C,KH,2D,6C,TC,JS,AD,KC,5C,9H,AC,9H,QS,8H,2H,7D,TS";
        String cartas2 = "1S,1C,1H,1D,2S,2C,2H,2D,3S,3C,3H,3D,4S,4C,4H,4D,5S,5C,5H,5D,6S,6C,6H,6D,7S,7C,7H,7D,8S,8C,8H,8D,9S,9C,9H,9D,TS,TC,TH,TD,JS,JC,JH,JD,QS,QC,QH,QD,KS,KC,KH,KD,AS,AC,AH,AD";

        String[] input = cartas2.split(",");
        // String[] cards = new String[] { "9C", "KS", "AC", "AH", "8D", "4C", "KD", "JC", "7D", "9D", "2H", "7C", "3C" };

        int countDecks = countDecks(input);
        System.out.println(countDecks);
    }

    public static int countDecks(String[] cards) {
        List<String> list = new ArrayList<String>(Arrays.asList(cards));

        int numberDecks = 0;
        List<String> fullDeck = getFullDeck2();
        System.out.println(fullDeck);

        // solution 1
        inner: while (true) {
            for (String card : fullDeck) {
                boolean remove = list.remove(card.trim());
                if (!remove) {
                    break inner;
                }
            }
            numberDecks++;
        }

        // solution 2
        // create a hash with the cards and its count,
        // if someone is zero inmediately return 0,
        // then find the minimum value OR iterate them, minus 1 all of them and count one plus deck

        return numberDecks;
    }

    public static List<String> getFullDeck2() {
        String[] ranks = "1,2,3,4,5,6,7,8,9,T,J,Q,K,A".split(",");
        String[] suits = "S,C,H,D".split(",");

        List<String> fullDeck = new ArrayList<>();

        for (String rank : ranks) {
            for (String suit : suits) {
                String card = rank + suit;
                fullDeck.add(card);
            }
        }
        return fullDeck;
    }

//    public static List<String> getFullDeck1() {
//        List<String> fullDeck = new ArrayList<>();
//
//        for (values v : values.values()) {
//            String value = v.getValue();
//
//            for (type t : type.values()) {
//                String type = t.getType();
//                String card = value + type;
//
//                fullDeck.add(card);
//            }
//        }
//
//        return fullDeck;
//    }
//
//    public enum values {
//        one("1"),
//        two("2"),
//        three("3"),
//        four("4"),
//        five("5"),
//        six("6"),
//        seven("7"),
//        eigth("8"),
//        nine("9"),
//        T("T"),
//        J("J"),
//        Q("Q"),
//        K("K"),
//        A("A");
//
//        private String value;
//
//        values(String value) {
//            this.value = value;
//        }
//
//        public String getValue() {
//            return value;
//        }
//
//    }
//
//    public enum type {
//        S("S"),
//        C("C"),
//        H("H"),
//        D("D");
//
//        private String type;
//
//        private type(String type) {
//            this.type = type;
//        }
//
//        public String getType() {
//            return type;
//        }
//    }

}
```
