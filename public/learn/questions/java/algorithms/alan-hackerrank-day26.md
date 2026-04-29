# Day 26 — Nested Logic (library fine)

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Misc

*Source:* `alan/hackerrank/day26.java`

## Solution

```java
import java.util.Scanner;

public class day26 {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);

        int actualDay = in.nextInt();
        int actualMonth = in.nextInt();
        int actualYear = in.nextInt();

        int expectedDay = in.nextInt();
        int expectedMonth = in.nextInt();
        int expectedYear = in.nextInt();

        in.close();

        int fine = computeFine(actualDay, actualMonth, actualYear, expectedDay, expectedMonth, expectedYear);

        System.out.println(fine);
    }

    static int computeFine(int actualDay, int actualMonth, int actualYear, int expectedDay, int expectedMonth, int expectedYear) {

        int fine = 0;

        if (actualYear > expectedYear) {
            fine = 10000;
        } else if (actualYear == expectedYear) {

            if (actualMonth > expectedMonth) {
                fine = (actualMonth - expectedMonth) * 500;
            } else if (actualMonth == expectedMonth) {

                if (actualDay > expectedDay) {
                    fine = (actualDay - expectedDay) * 15;
                }
            }
        }
        
//        if(actualYear <= expectedYear){
//            if(actualMonth <= expectedMonth){
//                if(returnDay <= dueDay){
//                    fine = 0;
//                }else{
//                    fine = (actualDay - expectedDay) * 15;
//                }
//            }else{
//                fine = (actualMonth - expectedMonth) * 500;
//            }
//        }else{
//            fine = 10000;
//        }

        return fine;
    }

}
```
