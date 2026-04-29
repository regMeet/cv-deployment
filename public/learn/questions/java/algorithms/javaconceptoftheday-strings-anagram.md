# Anagram

**Origin:** JavaConceptOfTheDay &nbsp;|&nbsp; **Topics:** Sorting

*Source:* `javaConceptOfTheDay/strings/Anagram.java`

## Solution

```java
import java.util.Arrays;

public class Anagram {

    public static void main(String[] args) {
        isAnagramWithSortAndEquals("Mother In Law", "Hitler Woman");

        isAnagramWithSortAndEquals("keEp", "peeK");

        isAnagramWithSortAndEquals("SiLeNt CAT", "LisTen AcT");

        isAnagramWithSortAndEquals("Debit Card", "Bad Credit");

        isAnagramWithSortAndEquals("School MASTER", "The ClassROOM");

        isAnagramWithSortAndEquals("DORMITORY", "Dirty Room");

        isAnagramWithSortAndEquals("ASTRONOMERS", "NO MORE STARS");

        isAnagramWithSortAndEquals("Toss", "Shot");

        isAnagramWithSortAndEquals("joy", "enjoy");
    }

    static void isAnagramWithSortAndEquals(String s1, String s2) {
        // Removing all white spaces from s1 and s2

        String copyOfs1 = s1.replaceAll("\\s", "");

        String copyOfs2 = s2.replaceAll("\\s", "");

        // Initially setting status as true

        boolean status = true;

        if (copyOfs1.length() != copyOfs2.length()) {
            // Setting status as false if copyOfs1 and copyOfs2 doesn't have same length

            status = false;
        } else {
            // Changing the case of characters of both copyOfs1 and copyOfs2 and converting them to char array

            char[] s1Array = copyOfs1.toLowerCase().toCharArray();

            char[] s2Array = copyOfs2.toLowerCase().toCharArray();

            // Sorting both s1Array and s2Array

            Arrays.sort(s1Array);

            Arrays.sort(s2Array);

            // Checking whether s1Array and s2Array are equal

            status = Arrays.equals(s1Array, s2Array);
        }

        // Output

        if (status) {
            System.out.println(s1 + " and " + s2 + " are anagrams");
        } else {
            System.out.println(s1 + " and " + s2 + " are not anagrams");
        }
    }

    static void isAnagramIterative(String s1, String s2) {
        // Removing white spaces from s1 and s2 and changing case to lower

        String copyOfs1 = s1.replaceAll("\\s", "").toLowerCase();

        String copyOfs2 = s2.replaceAll("\\s", "").toLowerCase();

        // Initially setting status as true

        boolean status = true;

        if (copyOfs1.length() != copyOfs2.length()) {
            // Setting status as false if copyOfs1 and copyOfs2 doesn't have same length

            status = false;
        } else {
            // Converting copyOfs1 to char array

            char[] s1ToArray = copyOfs1.toCharArray();

            // Checking whether each character of s1ToArray is present in copyOfs2

            for (char c : s1ToArray) {
                int index = copyOfs2.indexOf(c);

                if (index != -1) {
                    // If character is present in copyOfs2, removing that char from copyOfs2

                    copyOfs2 = copyOfs2.substring(0, index) + copyOfs2.substring(index + 1, copyOfs2.length());
                } else {
                    // If character is not present in copyOfs2, setting status as false and breaking the loop

                    status = false;

                    break;
                }
            }
        }

        // Output

        if (status) {
            System.out.println(s1 + " and " + s2 + " are anagrams");
        } else {
            System.out.println(s1 + " and " + s2 + " are not anagrams");
        }
    }

    static void isAnagramWithStringBuilder(String s1, String s2) {
        // Removing white spaces from s1 and s2 and converting case to lower

        String copyOfs1 = s1.replaceAll("\\s", "").toLowerCase();

        String copyOfs2 = s2.replaceAll("\\s", "").toLowerCase();

        // Initially setting status as true

        boolean status = true;

        if (copyOfs1.length() != copyOfs2.length()) {
            // Setting status as false if copyOfs1 and copyOfs2 doesn't have same length

            status = false;
        } else {
            // Converting copyOfs1 to char array

            char[] s1Array = copyOfs1.toCharArray();

            // Constructing StringBuilder from copyOfs2

            StringBuilder sb = new StringBuilder(copyOfs2);

            // Checking whether each character of s1Array is present in sb

            for (char c : s1Array) {
                int index = sb.indexOf("" + c);

                if (index != -1) {
                    // If present, removing that character from sb

                    sb = sb.deleteCharAt(index);
                } else {
                    // If not present, setting status as false and breaking the loop

                    status = false;

                    break;
                }
            }
        }

        // Output

        if (status) {
            System.out.println(s1 + " and " + s2 + " are anagrams");
        } else {
            System.out.println(s1 + " and " + s2 + " are not anagrams");
        }
    }

}
```
