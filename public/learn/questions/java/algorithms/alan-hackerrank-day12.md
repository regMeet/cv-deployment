# Day 12 — Inheritance (Person → Student)

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Design / OOP

*Source:* `alan/hackerrank/day12.java`

## Solution

```java
import java.util.Scanner;

public class day12 {

}

class Person {
    protected String firstName;
    protected String lastName;
    protected int idNumber;

    // Constructor
    Person(String firstName, String lastName, int identification) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.idNumber = identification;
    }

    // Print person data
    public void printPerson() {
        System.out.println("Name: " + lastName + ", " + firstName + "\nID: " + idNumber);
    }
}

class Student extends Person {
    private int[] testScores;

    public Student(String firstName, String lastName, Integer id, int[] scores) {
        super(firstName, lastName, id);
        this.testScores = scores;
    }

    private int getAverageScore() {
        int sum = 0;
        for (int score : testScores) {
            sum += score;
        }
        return sum / testScores.length;
    }

    public char calculate() {
        int averageScore = getAverageScore();

        char gradingScale;
        if (90 <= averageScore && averageScore <= 100) {
            gradingScale = 'O';
        } else if (80 <= averageScore && averageScore < 90) {
            gradingScale = 'E';
        } else if (70 <= averageScore && averageScore < 80) {
            gradingScale = 'A';
        } else if (55 <= averageScore && averageScore < 70) {
            gradingScale = 'P';
        } else if (40 <= averageScore && averageScore < 55) {
            gradingScale = 'D';
        } else { // averageScore < 40
            gradingScale = 'T';
        }
        return gradingScale;
    }

    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        String firstName = scan.next();
        String lastName = scan.next();
        int id = scan.nextInt();
        int numScores = scan.nextInt();
        int[] testScores = new int[numScores];
        for (int i = 0; i < numScores; i++) {
            testScores[i] = scan.nextInt();
        }
        scan.close();

        Student s = new Student(firstName, lastName, id, testScores);
        s.printPerson();
        System.out.println("Grade: " + s.calculate());
    }

}
```
