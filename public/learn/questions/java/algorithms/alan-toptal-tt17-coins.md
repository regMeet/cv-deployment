# Coins

**Origin:** Toptal &nbsp;|&nbsp; **Topics:** Arrays

*Source:* `alan/toptal/tt17/coins.java`

## Problem

* ================================
Vending machine 15 minutes *
================================

A vending machine has the following denominations: 1c, 5c, 10c, 25c, 50c, and $1.
Your task is to write a program that will be used in a vending machine to return change.
Assume that the vending machine will always want to return the least number of coins or notes.
Devise a function getChange(M, P) where M is how much money was inserted into the machine and P the price
of the item selected, that returns an array of integers representing the number of each denomination to return.

Example:
getChange(5, 0.99) should return [1,0,0,0,0,4]

## Solution

```java
import java.util.Arrays;

/**
 * * ================================
 * Vending machine 15 minutes *
 * ================================
 * 
 * A vending machine has the following denominations: 1c, 5c, 10c, 25c, 50c, and $1.
 * Your task is to write a program that will be used in a vending machine to return change.
 * Assume that the vending machine will always want to return the least number of coins or notes.
 * Devise a function getChange(M, P) where M is how much money was inserted into the machine and P the price
 * of the item selected, that returns an array of integers representing the number of each denomination to return.
 * 
 * Example:
 * getChange(5, 0.99) should return [1,0,0,0,0,4]
 *
 *
 */
public class coins {
    private static final int[] coins = { 1, 5, 10, 25, 50, 100 };

    private static int[] solution(double m, double p) {
        int money = (int) (m * 100);
        int price = (int) (p * 100);

        int[] change = new int[coins.length];

        int returnMoney = money - price;
        for (int i = coins.length - 1; i >= 0; i--) {

            change[i] = returnMoney / coins[i];
            returnMoney %= coins[i];
        }
        return change;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(solution(5, 0.99)));

        System.out.println(Arrays.toString(solution(4, 3.29)));

        System.out.println(Arrays.toString(solution(4, 3.22)));
        System.out.println(Arrays.toString(solution(4, 3.18)));

    }

}
```
