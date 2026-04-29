# Day 11 — 2D Arrays (Hourglass sum)

**Origin:** HackerRank &nbsp;|&nbsp; **Topics:** Arrays

*Source:* `alan/hackerrank/day11_HourGlass.java`

## Solution

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

public class day11_HourGlass {

    public static void printGrid(int a[][]) {
        for (int i = 0; i < a.length; i++) {
            for (int j = 0; j < a[0].length; j++) {
                System.out.printf("%5d ", a[i][j]);
            }
            System.out.println();
        }
    }

    public static void printGrid2(int a[][]) {
        for (int i = 0; i < a.length; i++) {
            for (int j = 0; j < a[0].length; j++) {
                System.out.print(a[i][j] + " ");
            }
            System.out.println();
        }
    }

    public static List<HourGlass> createHourGlasses(int a[][]) {
        List<HourGlass> hourGlasses = new ArrayList<>();
        for (int i = 0; i < a.length - 2; i++) {
            for (int j = 0; j < a[0].length - 2; j++) {
                HourGlass hg = new HourGlass(a[i][j], a[i][j + 1], a[i][j + 2],
                                                      a[i + 1][j + 1], 
                                             a[i + 2][j], a[i + 2][j + 1], a[i + 2][j + 2]);
                hourGlasses.add(hg);
            }
        }
        return hourGlasses;
    }

    public static int getBiggestSumFromHourGlasses(List<HourGlass> hourGlasses) {
        int biggest = -63;
        for (HourGlass hourGlass : hourGlasses) {
            int value = hourGlass.getValue();
            if (value > biggest) {
                biggest = value;
            }
        }
        return biggest;
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int arr[][] = new int[6][6];
        for (int i = 0; i < 6; i++) {
            for (int j = 0; j < 6; j++) {
                arr[i][j] = in.nextInt();
            }
        }
        List<HourGlass> hourGlasses = createHourGlasses(arr);
        int biggestSumFromHourGlasses = getBiggestSumFromHourGlasses(hourGlasses);

        System.out.println(biggestSumFromHourGlasses);
        
        in.close();
    }
}

class HourGlass {
    List<Integer> numbers = new ArrayList<>();

    public HourGlass(Integer... values) {
        this.numbers = Arrays.asList(values);
    }

    public int getValue() {
        int sum = 0;
        for (Integer number : numbers) {
            sum += number;
        }
        return sum;
    }
}
```
