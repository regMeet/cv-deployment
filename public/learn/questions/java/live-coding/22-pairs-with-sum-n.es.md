# Todos los pares en array ordenado que suman N

> Array ordenado, entero N. Encontrar todos los pares `(a, b)` con `a + b == N`. **Two-pointer convergente — O(n) tiempo, O(1) espacio.**

## Preguntas clarificadoras

- ¿Índices o valores?
- ¿Pares de índices `(i, j)` con `i < j`, o valores sin importar posición?
- ¿Se permite usar el mismo elemento dos veces (`2·a == N`)? Respuesta estándar: no — índices distintos.
- ¿Duplicados — devolver todas las instancias, o pares de valores distintos?

## Solución — two-pointer convergente

```java
import java.util.ArrayList;
import java.util.List;

public List<int[]> pairsWithSum(int[] a, int n) {
    List<int[]> out = new ArrayList<>();
    int lo = 0, hi = a.length - 1;
    while (lo < hi) {
        int sum = a[lo] + a[hi];
        if (sum == n) {
            out.add(new int[]{a[lo], a[hi]});
            lo++;
            hi--;
        } else if (sum < n) lo++;
        else                hi--;
    }
    return out;
}
```

Cada puntero solo avanza hacia adentro, así que cada índice se visita una vez → O(n) total.

## Por qué two-pointer le gana al hashing acá

Desordenado: lookup en HashSet → O(n) tiempo, O(n) espacio. Ordenado: two-pointer → O(n) tiempo, **O(1) espacio**. La sortedness te da un orden para explotar; no lo desperdicies.

## Pares distintos vs todas las instancias

Si el input tiene duplicados y querés solo **pares de valores distintos**:

```java
if (sum == n) {
    out.add(new int[]{a[lo], a[hi]});
    int lv = a[lo], hv = a[hi];
    while (lo < hi && a[lo] == lv) lo++;
    while (lo < hi && a[hi] == hv) hi--;
}
```

Skipeás duplicados de ambos lados tras un hit.

## Edge cases

- Vacío / un elemento → sin pares.
- Todos del mismo valor, `2·v == N` → muchos pares (`(n choose 2)`).
- N muy grande o muy chico → loop termina limpio.

## Follow-ups

- **3-sum** (LeetCode 15) — fijar un elemento, two-pointer el resto. O(n²).
- **Par más cercano a N** (sin requerir exactitud) — mismo scan, trackear delta más chico.
- **Input desordenado** — HashSet de `N - a[i]` mientras scanneás. O(n) tiempo, O(n) espacio.
