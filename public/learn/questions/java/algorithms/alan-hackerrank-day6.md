# Day 6 — Let's Review (even/odd chars)

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Strings

*Source:* `alan/hackerrank/day6.java`

## Problem

Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution.

## Solution

```java
import java.util.ArrayList;
import java.util.Scanner;

public class day6 {

    public static void main(String[] args) {
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution. */
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        in.nextLine();

        ArrayList<String> words = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            String word = in.nextLine();
            words.add(word);
        }

        for (String word : words) {
            printOddValues(word);
            printEvenValues(word);
            System.out.println();
        }
        in.close();
    }

    private static void printOddValues(String word) {
        int length = word.length();
        for (int i = 0; i < length; i++) {
            if (i % 2 == 0) {
                System.out.print(word.charAt(i));
            }
        }
        System.out.print(" ");
    }

    private static void printEvenValues(String word) {
        int length = word.length();
        for (int i = 0; i < length; i++) {
            if (i % 2 == 1) {
                System.out.print(word.charAt(i));
            }
        }
        System.out.print(" ");
    }

}
```
