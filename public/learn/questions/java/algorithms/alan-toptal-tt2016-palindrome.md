# Palindrome

**Origin:** Toptal &nbsp;|&nbsp; **Topics:** Strings

*Source:* `alan/toptal/tt2016/Palindrome.java`

## Problem

Write code in the language you prefer that detects whether a certain word is a palindrome
(returns true for palindromes and false for non palindromes).
Please note that you are not supposed to use built in functions that reverse a string/char array. Examples of palindromes:
dad
mom
radar
level

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
        System.out.println(isPalindrome("mom"));
        System.out.println(isPalindrome("radar"));
        System.out.println(isPalindrome("alan"));
    }

}
```
