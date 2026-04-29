# Contar ocurrencias de K en array ordenado

> Array ordenado con posibles duplicados. Contar cuántas veces aparece `K`. **O(log n)** con dos binary searches: leftmost y rightmost, después restar.

## Preguntas clarificadoras

- ¿Ordenado ascendente? (Sí para binary search.)
- ¿Distintos o duplicados permitidos? (Duplicados necesarios para que el problema sea interesante.)
- ¿Devolver -1, 0, o throw si K no aparece?

## Solución — leftmost y rightmost binary search

```java
public int countOccurrences(int[] a, int k) {
    int first = firstOccurrence(a, k);
    if (first == -1) return 0;
    int last  = lastOccurrence(a, k);
    return last - first + 1;
}

private int firstOccurrence(int[] a, int k) {
    int lo = 0, hi = a.length - 1, res = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == k) { res = mid; hi = mid - 1; }   // seguir hacia izquierda
        else if (a[mid] < k) lo = mid + 1;
        else                 hi = mid - 1;
    }
    return res;
}

private int lastOccurrence(int[] a, int k) {
    int lo = 0, hi = a.length - 1, res = -1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == k) { res = mid; lo = mid + 1; }   // seguir hacia derecha
        else if (a[mid] < k) lo = mid + 1;
        else                 hi = mid - 1;
    }
    return res;
}
```

Dos búsquedas `O(log n)` → total `O(log n)`.

## Por qué "trackear el resultado" es más limpio que el bias-mid

Podés escribir un solo binary search con mid sesgado a derecha para `lastOccurrence` — pero es un patrón notoriamente bug-prone. La estructura de "recordar el último match, seguir buscando" es mecánicamente confiable.

## Versión scan lineal (cuándo mencionarla)

```java
int count = 0;
for (int v : a) if (v == k) count++;
return count;
```

Baseline O(n). Mencionalo y después superalo. Saltar directo a binary search arriesga que parezcas no ver lo obvio.

## Edge cases

- K no está → 0.
- Todos iguales a K → devuelve el largo.
- Array vacío → 0.
- Un solo elemento que matchea → 1.

## Follow-ups

- **Primer y último índice de K** (LeetCode 34) — devolver ambos, este problema sin el paso de resta.
- **Contar ocurrencias en matriz ordenada** — extender el staircase walk.
- **Índice de K-ésima ocurrencia** — variante de binary search.
