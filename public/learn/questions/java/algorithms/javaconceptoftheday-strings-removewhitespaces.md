# Remove White Spaces

**Origin:** JavaConceptOfTheDay &nbsp;|&nbsp; **Topics:** Strings

*Source:* `javaConceptOfTheDay/strings/RemoveWhiteSpaces.java`

## Solution

```java
public class RemoveWhiteSpaces {

    public static void main(String[] args) {
        String str = "  Core Java jsp servlets             jdbc struts hibernate spring  ";

        // 1. Using replaceAll() Method
        method1(str);

        // 2. Without Using replaceAll() Method
        method2(str);
    }

    private static void method1(String str) {
        String strWithoutSpace = str.replaceAll("\\s", "");

        System.out.println(strWithoutSpace); // Output : CoreJavajspservletsjdbcstrutshibernatespring
    }

    private static void method2(String str) {
        char[] strArray = str.toCharArray();

        StringBuffer sb = new StringBuffer();

        for (int i = 0; i < strArray.length; i++) {
            if ((strArray[i] != ' ') && (strArray[i] != '\t')) {
                sb.append(strArray[i]);
            }
        }

        System.out.println(sb); // Output : CoreJavajspservletsjdbcstrutshibernatespring
    }

}
```
