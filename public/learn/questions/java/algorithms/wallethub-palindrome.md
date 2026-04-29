# Palindrome

**Origin:** WalletHub &nbsp;|&nbsp; **Topics:** Strings

*Source:* `walletHub/Palindrome.java`

## Problem

Write an efficient algorithm to check if a string is a palindrome. A string is a palindrome if the string matches the reverse of string.
Example: 1221 is a palindrome but not 1121.

@author alan

## Solution

```java
public class Palindrome {

    public static boolean isPalindrome(String word) {

        int j = word.length();

        for (int i = 0; i < j; i++, j--) {
            if (word.charAt(i) != word.charAt(j - 1)) {
                return false;
            }
        }

        return true;
    }

    public static void main(String[] args) {
        String[] words = new String[] { "1221", "1121", "mom", "radar", "Alan", "Albertengo" };

        System.out.println("The following words are/aren't palindromes:");
        for (String word : words) {
            System.out.println(word + ": " + isPalindrome(word));
        }
    }
}
```
