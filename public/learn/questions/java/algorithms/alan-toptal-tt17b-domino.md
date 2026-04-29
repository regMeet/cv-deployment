# Domino

**Origin:** Toptal &nbsp;|&nbsp; **Topics:** Strings

*Source:* `alan/toptal/tt17b/Domino.java`

## Solution

```java
public class Domino {

    public static int domino(String s) {
        int max = 1;

        String[] dominos = s.split(",");

        int count = 1;
        for (int i = 1; i < dominos.length; i++) {
            String previousDomino = dominos[i - 1];
            char previousNumber = previousDomino.charAt(previousDomino.length() - 1);
            char currentNumber = dominos[i].charAt(0);

            if (previousNumber == currentNumber) {
                count++;
                max = Math.max(max, count);
            } else {
                count = 1;
            }

        }

        return max;
    }

    public static void main(String[] args) {

        System.out.println(Domino.domino("6-3"));

        System.out.println(Domino.domino("4-3,5-1,2-2,1-3,4-4"));

        System.out.println(Domino.domino("1-1,3-5,5-2,2-3,2-4"));

        System.out.println(Domino.domino("3-2,2-1,1-4,4-4,5-4,4-2,2-1"));
        
        System.out.println(Domino.domino("5-5,5-5,4-4,5-5,5-5,5-5,5-5,5-5,5-5,5-5"));
    }

}
```
