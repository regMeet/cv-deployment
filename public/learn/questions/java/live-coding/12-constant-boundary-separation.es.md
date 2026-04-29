# Par con diferencia dada en array ordenado

> Array ordenado `A`, entero `k`. Encontrar dos valores `a, b ∈ A` con `a - b == k`. **O(n) tiempo, O(1) espacio.** Técnica de dos punteros.

## Preguntas clarificadoras

- ¿Índices o valores? (Spec; clarificar.)
- ¿`k = 0` permitido? (Si sí, decidir si `a == b` requiere índices distintos.)
- ¿Duplicados en el array — está OK?
- ¿`k` negativo? (Flip trivial — solo swappear `a` y `b`. Generalmente: asumir `k ≥ 0`.)

## Solución — dos punteros, fast y slow

```java
public int[] findPair(int[] a, int k) {
    if (a == null || a.length < 2) return new int[]{-1, -1};
    int i = 0, j = 1;                        // j estrictamente adelante de i
    while (j < a.length) {
        int diff = a[j] - a[i];
        if (diff == k && i != j) return new int[]{i, j};
        if (diff < k) j++;                   // necesita más gap
        else if (i == j) j++;                // mantener j adelante
        else i++;                            // gap muy grande, achicar
    }
    return new int[]{-1, -1};
}
```

Ambos índices solo avanzan → O(n).

## Por qué ambos punteros van para adelante (no convergen)

Distinto de "par con suma": para suma, los extremos del array ordenado convergen. Para **diferencia** en array ordenado, tanto `a[i]` como `a[j]` necesitan crecer juntos para mantener el gap, entonces ambos punteros se mueven *a derecha*. Bug común: escribir la versión convergente por reflejo.

## Edge cases

- `k == 0` — si se permite mismo índice, todo elemento matchea; si no, hace falta duplicado consecutivo.
- Largo < 2 → no hay par posible.
- Todos iguales → solo matchea `k == 0`.
- `k` negativo → conceptualmente `b - a == |k|`, mismo algoritmo con output swappeado.

## Follow-ups

- **Contar todos los pares** — mismo scan sin break en match; avanzar con cuidado en duplicados.
- **Input desordenado** — `Set` de `a[i] - k` mientras scanneás, O(n) tiempo, O(n) espacio.
- **Par con suma N** — two-pointer convergente (otro problema de la misma familia).
