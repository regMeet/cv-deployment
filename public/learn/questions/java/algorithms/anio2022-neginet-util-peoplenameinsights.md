# People Name Insights

**Origin:** NegiNet &nbsp;|&nbsp; **Topics:** Strings

*Source:* `anio2022/neginet/util/PeopleNameInsights.java`

## Problem

This solution will iterate through all the lines in the file – allowing for processing of each line
without keeping references to them – in other words, without keeping them in memory

## Solution

```java
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PeopleNameInsights {
    // checks that lastName starts with a letter, follows by a comma, then space, then firstName, etc.
    // Grouping lastName and firstName in group 1 and group 2 for data gathering
    private final String regex = "(^[a-zA-Z]+), ([a-zA-Z]+) -- \\w+";
    private final Pattern pattern = Pattern.compile(regex);
    Top10Report fullNames = new Top10Report();
    Top10Report lastNames = new Top10Report();
    Top10Report firstNames = new Top10Report();
    ModifiedNamesReport modifiedNamesReport = new ModifiedNamesReport();

    /**
     * This solution will iterate through all the lines in the file – allowing for processing of each line
     * without keeping references to them – in other words, without keeping them in memory
     */
    public void readFile(String fileName) throws IOException {
        try (FileInputStream inputStream = new FileInputStream(fileName); Scanner sc = new Scanner(inputStream)) {
            while (sc.hasNextLine()) {
                processData(sc.nextLine());
            }
        }
    }

    private void processData(String line) {
        final Matcher matcher = pattern.matcher(line);
        if (matcher.find()) {
            String firstName = matcher.group(2);
            String lastName = matcher.group(1);
            sendData(firstName, lastName);
        }
    }

    public void sendData(String firstName, String lastName) {
        fullNames.addName(firstName.concat(" " + lastName));
        int firstNameCount = firstNames.addName(firstName);
        int lastNameCount = lastNames.addName(lastName);
        // only add unique firstNames and lastNames
        if (firstNameCount == 1 && lastNameCount == 1) {
            modifiedNamesReport.addNames(firstName, lastName);
        }
    }

    public void printReport() {
        System.out.println("Unique full name count: " + fullNames.getSize());
        System.out.println("Unique first name count: " + firstNames.getSize());
        System.out.println("Unique last name count: " + lastNames.getSize());
        System.out.println();
        System.out.println("Top 10 last names:");
        for (NameCount n : lastNames.getTopTen()) {
            System.out.println(n.getName() + ": " + n.getCount());
        }

        System.out.println();
        System.out.println("Top 10 first names:");
        for (NameCount n : firstNames.getTopTen()) {
            System.out.println(n.getName() + ": " + n.getCount());
        }

        System.out.println();
        System.out.println("Modified unique names:");
        for (String n : modifiedNamesReport.getModifiedNames()) {
            System.out.println(n);
        }
    }
}
```
