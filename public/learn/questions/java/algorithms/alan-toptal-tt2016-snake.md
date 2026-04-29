# Snake

**Origin:** Toptal &nbsp;|&nbsp; **Topics:** Hash Set, Arrays

*Source:* `alan/toptal/tt2016/Snake.java`

## Problem

public int submit(int[] array){
}

recibis un array de int el primer indice indica cuantos pasos se mueve hacia arriba,
el siguiente hacia la derecha
el tercero hacia abajo
y el cuarto hacia la izq
y asi sucesivamente
Si en algun indice se choca con su cola por asi decirlo se devuelve ese indice sino se choca nunca se devuelve 0

## Solution

```java
import java.util.LinkedHashSet;
import java.util.Set;

/**
 * public int submit(int[] array){
 * }
 * 
 * recibis un array de int el primer indice indica cuantos pasos se mueve hacia arriba,
 * el siguiente hacia la derecha
 * el tercero hacia abajo
 * y el cuarto hacia la izq
 * y asi sucesivamente
 * Si en algun indice se choca con su cola por asi decirlo se devuelve ese indice sino se choca nunca se devuelve 0
 *
 */
public class Snake {
    private final static int UP = 0;
    private final static int RIGHT = 1;
    private final static int DOWN = 2;
    private final static int LEFT = 3;

    public static int submit(int[] array) {
        int x = 0;
        int y = 0;

        int index = 0;

        LinkedHashSet<String> points = new LinkedHashSet<String>();
        addCoordenate(x, y, points);

        for (int i = 0; i < array.length; i++) {

            int direction = i % 4;
            int times = array[i];

            for (int j = 0; j < times; j++) {
                boolean hit = false;

                switch (direction) {
                case UP:
                    hit = checkNewCoordenate(x, ++y, points);

                    break;
                case RIGHT:
                    hit = checkNewCoordenate(++x, y, points);
                    break;
                case DOWN:
                    hit = checkNewCoordenate(x, --y, points);
                    break;
                case LEFT:
                    hit = checkNewCoordenate(--x, y, points);
                    break;
                }
                if (hit) {
                    return i;
                }
                addCoordenate(x, y, points);
            }
        }

        System.out.println("x: " + x);
        System.out.println("y: " + y);
        System.out.println(points);

        return index;
    }

    private static boolean checkNewCoordenate(int x, int y, Set<String> points) {
        String newPoint = x + "/" + y;
        if (points.contains(newPoint)) {
            return true;
        }

        return false;
    }

    private static void addCoordenate(int x, int y, Set<String> points) {
        String newPoint = x + "/" + y;
        points.add(newPoint);
    }

    public static void main(String[] args) {

        // System.out.println(submit(new int[] { 1, 1, 2, 3, 5, 8 }));
        System.out.println(submit(new int[] { 2, 2, 1, 1, 2 }));

    }

}
```
