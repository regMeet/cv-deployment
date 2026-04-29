# Encontrar el peak en un array bitónico

> Array de enteros distintos que crece estrictamente y después decrece estrictamente. Encontrar el índice `K` del peak. O(log n) — binary search modificado.

## Preguntas clarificadoras

- ¿Estrictamente creciente/decreciente? (Sin plateaus → binary search estándar funciona.)
- ¿Siempre tiene peak? (¿Un array puramente creciente o decreciente cuenta como bitónico degenerado? Clarificar.)
- ¿Elementos distintos?

## Solución — binary search comparando con vecino

```java
public int peakIndex(int[] a) {
    int lo = 0, hi = a.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] < a[mid + 1]) lo = mid + 1;   // ascendente → peak a la derecha
        else                     hi = mid;       // descendente o peak → respuesta es mid o izquierda
    }
    return lo;
}
```

La invariante: el peak está siempre en `[lo, hi]`. Cada iteración divide el rango por 2. Cuando `lo == hi`, es el peak.

## Por qué comparar con `mid + 1` (no `mid - 1`)

Una sola comparación decide la pendiente:
- `a[mid] < a[mid+1]` → todavía ascendente → peak estrictamente después de mid.
- `a[mid] > a[mid+1]` → descendente → peak ≤ mid.

Comparar con ambos vecinos también funciona pero duplica las comparaciones.

## Edge cases

- Largo 1 → devolver 0.
- Largo 2 → devolver índice del mayor.
- Peak en índice 0 (puramente descendente) — manejado si `a[0] > a[1]` dispara la segunda rama de una.
- Peak en índice n-1 (puramente ascendente) — la primera rama sigue avanzando `lo`.

## Follow-ups

- **Buscar un target en array bitónico** — encontrar el peak primero (O(log n)), después binary search en cada lado.
- **Bitónico con duplicados** — degenera a O(n) en peor caso, como rotated-sorted-con-duplicados.
- **Encontrar máximo de función unimodal** — ternary search (caso continuo).
