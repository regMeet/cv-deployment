# Search en matriz ordenada por filas y columnas

> Matriz 2D ordenada tanto por filas como por columnas (cada fila ordenada izq→der, cada columna arriba→abajo). Buscar una key. **O(m + n)** con el staircase walk.

## Preguntas clarificadoras

- ¿Filas + columnas ordenadas, pero sin relación entre filas? (Ej. el primer elemento de la fila 2 puede ser menor que el último de la fila 1. Caso común.)
- ¿Índice de cualquier match, o primera ocurrencia?
- Versión estrictamente más fuerte: el primer elemento de cada fila ≥ último de la fila previa → otro problema, soluble en O(log(mn)).

## Solución — staircase desde top-right

```java
public int[] search(int[][] m, int key) {
    if (m == null || m.length == 0 || m[0].length == 0) return new int[]{-1, -1};
    int r = 0, c = m[0].length - 1;
    while (r < m.length && c >= 0) {
        if (m[r][c] == key) return new int[]{r, c};
        if (m[r][c] > key)  c--;     // valor actual muy grande → izquierda
        else                r++;     // muy chico → abajo
    }
    return new int[]{-1, -1};
}
```

En cada paso eliminamos toda una fila o toda una columna. Total: m + n movimientos.

## Por qué top-right (o bottom-left), no esquinas en la diagonal

Desde top-left, ambos movimientos (derecha y abajo) crecen los valores — no hay cómo decidir. Desde top-right, los dos movimientos salientes van en direcciones *opuestas*: izquierda decrece, abajo crece. Eso es lo que le da decisión al algoritmo.

## Edge cases

- Matriz vacía → -1.
- Key menor que todo → loop termina con `c = -1`.
- Key mayor que todo → loop termina con `r = m.length`.
- Una sola fila / una sola columna → degenera a scan lineal.

## Follow-ups

- **Contar ocurrencias** — mismo staircase, incrementar counter en match y avanzar ambos `r++, c--` (con orden estricto, key tiene a lo sumo un match por fila).
- **Orden estrictamente mayor (start de cada fila > end de la previa)** — flattenear coordenadas y binary search en `[0, m·n)`. O(log(mn)).
- **K-ésimo más chico en tal matriz** — heap o binary search sobre valor.
