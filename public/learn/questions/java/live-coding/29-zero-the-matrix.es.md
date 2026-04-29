# Cerar filas y columnas de una matriz

> Matriz N×N de 0s y 1s. Cuando encuentres un 0, cerar toda su fila y su columna. Naive: O(N²) espacio extra. Senior: **O(1) espacio extra** reutilizando la primera fila y la primera columna como flags.

## Preguntas clarificadoras

- ¿Modificar in-place o devolver matriz nueva?
- ¿La matriz es solo 0s y 1s, o enteros arbitrarios? (Algoritmo igual; valores distintos.)
- ¿Hace falta scannear múltiples veces si se crea un 0 durante el write? **No** — solo los 0s *originales* marcan filas/columnas.

## Naive — dos arrays booleanos

```java
public void zero(int[][] m) {
    int r = m.length, c = m[0].length;
    boolean[] rowZero = new boolean[r];
    boolean[] colZero = new boolean[c];
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++)
            if (m[i][j] == 0) { rowZero[i] = true; colZero[j] = true; }
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++)
            if (rowZero[i] || colZero[j]) m[i][j] = 0;
}
```

O(R + C) extra. Claro, fácil de escribir — empezá por acá.

## O(1) espacio — usar primera fila/columna como markers

```java
public void zeroInPlace(int[][] m) {
    int r = m.length, c = m[0].length;
    boolean firstRowZero = false, firstColZero = false;

    for (int j = 0; j < c; j++) if (m[0][j] == 0) firstRowZero = true;
    for (int i = 0; i < r; i++) if (m[i][0] == 0) firstColZero = true;

    for (int i = 1; i < r; i++)
        for (int j = 1; j < c; j++)
            if (m[i][j] == 0) { m[i][0] = 0; m[0][j] = 0; }

    for (int i = 1; i < r; i++)
        for (int j = 1; j < c; j++)
            if (m[i][0] == 0 || m[0][j] == 0) m[i][j] = 0;

    if (firstRowZero) for (int j = 0; j < c; j++) m[0][j] = 0;
    if (firstColZero) for (int i = 0; i < r; i++) m[i][0] = 0;
}
```

El truco: la fila 0 y la columna 0 cargan los flags para todos los demás. Dos booleans (`firstRowZero`, `firstColZero`) cargan los flags para la fila 0 y columna 0 mismas.

## Por qué hacen falta tres pasadas

1. Capturar si la primera fila/columna originalmente tenía algún cero.
2. Marcar ceros en fila 0 y columna 0 según los ceros de las otras celdas.
3. Cerar las celdas del cuerpo leyendo las filas/columnas marker.
4. Finalmente, cerar primera fila/columna según los booleans capturados.

Si te salteás los booleans, perdés información: cuando procesás fila 0, fila 0 ya puede haber sido sobreescrita con markers, así que no sabés si la fila 0 *original* tenía un cero.

## Edge cases

- Matriz sin ceros → sin cambio.
- Todo ceros → sigue todo ceros.
- 1×N o N×1 → el approach booleano es más simple; el in-place degenera.

## Follow-ups

- **Matriz sparse** — guardar índices de fila/col en dos sets, no hace falta scan por celda.
- **Distinto centinela** (ej. -1 en vez de 0) — mismo algoritmo, cambio de una línea.
