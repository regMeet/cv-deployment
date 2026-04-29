# Day 4 — Class vs. Instance

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Design / OOP

*Source:* `alan/hackerrank/day4.java`

## Solution

```java
import java.util.Scanner;

public class day4 {

}

class Person2 {
    private int age;

    public Person2(int initialAge) {
        // Add some more code to run some checks on initialAge
        if (initialAge < 0) {
            System.out.println("Age is not valid, setting age to 0.");
            age = 0;
        } else {
            age = initialAge;
        }
    }

    public void amIOld() {
        // Write code determining if this person's age is old and print the correct statement:
        String status = "";
        if (age < 13) {
            status = "You are young.";
        } else if (age >= 13 && age < 18) {
            status = "You are a teenager.";
        } else {
            status = "You are old.";
        }

        System.out.println(status);
    }

    public void yearPasses() {
        // Increment this person's age.
        age++;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int T = sc.nextInt();
        for (int i = 0; i < T; i++) {
            int age = sc.nextInt();
            Person2 p = new Person2(age);
            p.amIOld();
            for (int j = 0; j < 3; j++) {
                p.yearPasses();
            }
            p.amIOld();
            System.out.println();
        }
        sc.close();
    }
}
```
