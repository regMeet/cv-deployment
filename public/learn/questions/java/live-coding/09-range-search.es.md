# Range search en array ordenado

> Array ordenado define rangos: `[12, 20, 32, 40, 52]` define límites en índices 0..4. Dado un target `T`, devolver el índice `i` tal que `a[i] ≤ T < a[i+1]`. Por debajo del más chico → devolver 0 por convención; arriba del más grande → devolver `n-1`. O(log n).

## Preguntas clarificadoras

- Por debajo de `a[0]` y por encima de `a[n-1]` — ¿qué devolvemos? (Depende de la spec; clarificar.)
- ¿Duplicados en el array? (Afecta qué índice devolver — leftmost o rightmost.)
- ¿Los límites son inclusivos a izquierda, exclusivos a derecha? (Convención estándar acá.)

## Solución — binary search para el rightmost `a[i] ≤ T`

```java
public int rangeIndex(int[] a, int target) {
    if (a == null || a.length == 0) return -1;
    int lo = 0, hi = a.length - 1;

    while (lo < hi) {
        int mid = lo + (hi - lo + 1) / 2;   // bias a la derecha para evitar loop infinito
        if (a[mid] <= target) lo = mid;
        else                  hi = mid - 1;
    }
    return lo;
}
```

El mid sesgado a la derecha es el truco: cuando buscás el *último* elemento que cumple un predicado, calcular `mid` como `(lo + hi) / 2` te traba cuando `lo + 1 == hi`. Sumar 1 al numerador lo arregla.

## Equivalente — `Arrays.binarySearch` con post-procesamiento

```java
int idx = Arrays.binarySearch(a, target);
if (idx >= 0) return idx;             // match exacto
int ins = -idx - 1;                    // insertion point
return Math.max(0, ins - 1);
```

Más corto, pero el binary search a mano es lo que el entrevistador quiere verte escribir.

## Edge cases

- Array vacío → devolver -1 (o lo que diga la spec).
- Target < `a[0]` → devuelve 0 con la convención de arriba.
- Target > `a[n-1]` → devuelve `n-1`.
- Un solo elemento → devuelve 0.

## Follow-ups

- **Find insertion point exacto** — semántica `lower_bound` / `upper_bound`. Mismo loop con comparación estricta vs no-estricta.
- **Range con intervals que se solapan** — otro problema; sweep line o interval tree.
