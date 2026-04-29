# Avanzado

**Origin:** Hackealo &nbsp;|&nbsp; **Topics:** Misc

*Source:* `hackealo/Avanzado.java`

## Problem

Resuelve el siguiente desafío

El instituto geográfico nacional se encarga de, periódicamente, tomar fotografías aéreas para detectar cambios en el relieve terrestre. Para agilizar esta
tarea desean tener una herramienta que, dada una imagen, pueda detectar los bordes de las montañas. Las imágenes son representadas con matrices de números
enteros que representan la altura sobre el nivel del mar en metros en una posición determinada. Consideraremos a un estrato como a un conjunto conexo de
posiciones de la matriz con misma altura. Para que una parte de la imágen se considere el borde de una montaña debe ser un estrato mínimo local. Esto quiere
decir que es un estrato y que no posee ningún estrato vecino con altura menor. Diseñar un algoritmo que, dada una matriz, devuelva otra matriz con 0 en todas
sus posiciones excepto en los bordes de las montañas que encuentre.


// Para testear tu código en nuestros servidores debes mantener la estructura expuesta abajo.
// Eres libre de crear nuevas funciones/procedimientos.
// Recuerda que el código que escribas podrá ser visto por las empresas a las que te postules.

## Solution

```java
public class Avanzado {
    // int[][] relieve = { {9, 9, 2, 2, 3, 5}, {9, 8, 3, 2, 4, 5}, {9, 7, 2, 2, 4, 3}, {9, 9, 2, 4, 4, 3}, {9, 2, 3, 4, 3, 5}};
    public int[][] encontrar_bordes(int[][] relieve) {
        // int[][] array = { {0, 0, 0, 0, 0, 1}, {0, 0, 0, 0, 0, 0}, {0, 0, 1, 0, 0, 0}, {0, 0, 0, 0, 0, 0}, {0, 0, 1, 0, 0, 0 }};
        // return array;

        return null;
    }
}

// La función main() será ejecutada en nuestros servidores llamando a la expuesta arriba.
```
