# Intermedio

**Origin:** Hackealo &nbsp;|&nbsp; **Topics:** Sorting

*Source:* `hackealo/Intermedio.java`

## Problem

Un grupo de científicos está analizando una forma de vida inteligente extraterrestre en la reconocida área 52. Han descubierto que, sorprendentemente, estos
usan las mismas letras que nosotros (26 letras, excluyendo la ñ) aunque su alfabeto posee un orden distinto. Se nos encomienda la tarea de reordenar un
diccionario en español para que los extraterrestres puedan buscar palabras en nuestra lengua más fácilmente. Diseñar un algoritmo que dada un string que
representa todas las letras del alfabeto ordenadas según los extraterrestres y una lista de palabras, devuelva una lista de palabras ordenadas (en el orden
que entiendan los extraterrestres)

// Para testear tu código en nuestros servidores debes mantener la estructura expuesta abajo.
// Eres libre de crear nuevas funciones/procedimientos.
// Recuerda que el código que escribas podrá ser visto por las empresas a las que te postules.

## Solution

```java
import java.util.Arrays;
import java.util.Comparator;

/*
 * Un grupo de científicos está analizando una forma de vida inteligente extraterrestre en la reconocida área 52. Han descubierto que, sorprendentemente, estos
 * usan las mismas letras que nosotros (26 letras, excluyendo la ñ) aunque su alfabeto posee un orden distinto. Se nos encomienda la tarea de reordenar un
 * diccionario en español para que los extraterrestres puedan buscar palabras en nuestra lengua más fácilmente. Diseñar un algoritmo que dada un string que
 * representa todas las letras del alfabeto ordenadas según los extraterrestres y una lista de palabras, devuelva una lista de palabras ordenadas (en el orden
 * que entiendan los extraterrestres)
 * 
 * // Para testear tu código en nuestros servidores debes mantener la estructura expuesta abajo.
 * // Eres libre de crear nuevas funciones/procedimientos.
 * // Recuerda que el código que escribas podrá ser visto por las empresas a las que te postules.
 * 
 */
public class Intermedio {

    public static String[] ordenar_extraterrestre(String desordenadas[], String orden_alfabeto) {
        Arrays.sort(desordenadas, new StrangeAlphabeticalStringSort(orden_alfabeto));
        return desordenadas;
    }

    public static void main(String[] args) {
        String lista[] = { "miel", "extraterrestre", "al", "automovil", "auto", "revestir" };
        String alfabeto = "zyxwvutsrqponmlkjihgfedcba";

        String[] palabrasOrdenadas = ordenar_extraterrestre(lista, alfabeto);
        System.out.println(Arrays.toString(palabrasOrdenadas));
        // "revestir", "miel", "extraterrestre", "auto", "automovil", "al"

        System.out.println(Arrays.toString(ordenar_extraterrestre(new String[] { "alan", "zeta", "casa" }, alfabeto)));
        System.out.println(Arrays.toString(ordenar_extraterrestre(new String[] { "alann", "alan" }, alfabeto)));
    }
}

class StrangeAlphabeticalStringSort implements Comparator<String> {
    private final StrangeAlphabeticalCharacterSort comparator;

    public StrangeAlphabeticalStringSort(String alphabeticalOrder) {
        comparator = new StrangeAlphabeticalCharacterSort(alphabeticalOrder);
    }

    @Override
    public int compare(String a, String b) {
        int length = 0;
        int aLength = a.length();
        int bLength = b.length();

        if (bLength <= aLength) {
            length = bLength;
        } else {
            length = aLength;
        }

        for (int i = 0; i < length; i++) {
            Character ca = a.charAt(i);
            Character cb = b.charAt(i);
            int compare = comparator.compare(ca, cb);
            if (compare == 0) {
                continue;
            } else {
                return compare;
            }
        }

        return aLength - bLength;
    }
}

class StrangeAlphabeticalCharacterSort implements Comparator<Character> {
    private final String alphabeticalOrder;

    public StrangeAlphabeticalCharacterSort(String alphabeticalOrder) {
        this.alphabeticalOrder = alphabeticalOrder;
    }

    @Override
    public int compare(Character o1, Character o2) {
        int v1 = getValue(o1);
        int v2 = getValue(o2);

        return v1 - v2;
    }

    private int getValue(Character o1) {
        for (int i = 0; i < alphabeticalOrder.length(); i++) {
            if (o1.equals(alphabeticalOrder.charAt(i))) {
                return i + 1;
            }
        }

        return 0;
    }

}
```
