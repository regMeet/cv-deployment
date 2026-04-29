# Domino

**Origin:** Toptal &nbsp;|&nbsp; **Topics:** Strings

*Source:* `alan/toptal/tt17/domino.java`

## Problem

* =======================
Domino 15 minutes *
=======================

"Domino": We are given an S string, representing a domino tile chain. Each tile has an L-R format,
where L and R are numbers from the 1..6 range. The tiles are separated by a comma. Some examples of a
valid S chain are:

1. 1-4,4-2,3-1
2. 6-3
3. 4-3,5-1,2-2,1-3,4-4

Devise a function that given an S string, returns the number of tiles in the longest matching group within
S. A matching group is a set of tiles that match and that are subsequent in S. Domino tiles match,
if the right side of a tile is the same as the left side of the following tile. 2-4,4-1 are matching tiles,
but 5-2,1-6 are not.

domino("1-1,3-5,5-2,2-3,2-4") should return 3.

## Solution

```java
public class domino {

    private static int solution(String s) {
        String[] dominos = s.split(",");

        int max = 1;
        int count = 1;
        for (int i = 1; i < dominos.length; i++) {
            char current = dominos[i].charAt(0);
            char previuous = dominos[i - 1].charAt(dominos[i - 1].length() - 1);

            if (current == previuous) {
//                count++;
//                if (count > max) {
//                    max = count;
//                }
                max = Math.max(++count, max);
            } else {
                count = 1;
            }

        }

        return max;
    }

    public static void main(String[] args) {
        System.out.println(solution("1-1,3-5,5-2,2-3,2-4"));
        System.out.println(solution("1-4,4-2,3-1"));
        
        System.out.println(solution("1-4"));
        
        System.out.println(solution("1-4,4-2,2-2,4-4,4-4,4-4,4-4"));
    }

}
```
