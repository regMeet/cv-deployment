# Fixed point en array ordenado

> Array ordenado de enteros distintos. Encontrar cualquier índice `i` donde `a[i] == i`, o devolver -1. Scan naive es O(n); con array ordenado y valores distintos, se puede hacer en **O(log n)**.

## Preguntas clarificadoras

- ¿Elementos distintos garantizados? (Con duplicados, binary search rompe; clarificar.)
- ¿Estrictamente ascendente? (Sí para que funcione binary search.)
- ¿Cualquier fixed point, o específicamente el primero/último?

## Solución — binary search

```java
public int fixedPoint(int[] a) {
    int lo = 0, hi = a.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == mid) return mid;
        if (a[mid] < mid)  lo = mid + 1;
        else               hi = mid - 1;
    }
    return -1;
}
```

## Por qué funciona

Con enteros distintos ordenados, `a[i+1] ≥ a[i] + 1`, entonces `f(i) = a[i] - i` es no-decreciente. Buscamos `f(i) == 0`. Binary search encuentra el cero de una función monótona.

- Si `a[mid] < mid`, entonces para todo `i ≤ mid`, `a[i] < i` también — descartar izquierda.
- Si `a[mid] > mid`, simétrico — descartar derecha.

## Con duplicados

Binary search **no funciona** para no-estrictamente ascendente. El truco estándar es recursivo: buscar en ambas mitades pero podar por bounds de valor.

```java
private int find(int[] a, int lo, int hi) {
    if (lo > hi) return -1;
    int mid = lo + (hi - lo) / 2;
    if (a[mid] == mid) return mid;
    int leftEnd  = Math.min(mid - 1, a[mid]);
    int leftRes  = find(a, lo, leftEnd);
    if (leftRes != -1) return leftRes;
    int rightStart = Math.max(mid + 1, a[mid]);
    return find(a, rightStart, hi);
}
```

Peor caso O(n) pero típicamente mucho más rápido.

## Edge cases

- Array vacío → -1.
- Todos negativos → no hay fixed point si `a[n-1] < 0` (devuelve -1 sin drama).
- Todos ≥ n → no hay fixed point; binary search descarta todo.

## Follow-ups

- **Fixed point más chico** — sesgar la búsqueda a izquierda cuando `a[mid] == mid`.
- **Fixed point más grande** — sesgar a derecha.
