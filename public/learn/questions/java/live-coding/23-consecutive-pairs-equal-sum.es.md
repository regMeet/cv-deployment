# Pares consecutivos con suma igual entre dos arrays ordenados

> Dos arrays ordenados. Encontrar todos los pares de números consecutivos `(A[i], A[i+1])` y `(B[j], B[j+1])` tales que `A[i] + A[i+1] == B[j] + B[j+1]`. Two-pointer sobre las sumas de pares adyacentes de cada array. O(m + n).

## Preguntas clarificadoras

- "Consecutivos" significa índices adyacentes, ¿no? (Sí — `i, i+1`.)
- ¿Ambos arrays ordenados ascendente? (Si sí, las sumas de pares adyacentes son no-decrecientes.)
- ¿Hace falta índices o solo valores?
- ¿Se permite que el mismo `A[i..i+1]` matchee múltiples `B[j..j+1]` (y viceversa)?

## Solución — two-pointer sobre sumas de pares adyacentes

```java
public List<int[][]> consecutivePairsEqualSum(int[] a, int[] b) {
    List<int[][]> out = new ArrayList<>();
    int i = 0, j = 0;
    int p = a.length - 1, q = b.length - 1;
    while (i < p && j < q) {
        int sa = a[i] + a[i + 1];
        int sb = b[j] + b[j + 1];
        if (sa == sb) {
            out.add(new int[][]{{a[i], a[i + 1]}, {b[j], b[j + 1]}});
            i++;
            j++;
        } else if (sa < sb) i++;
        else                j++;
    }
    return out;
}
```

El "array implícito de sumas de pares" `S_a[i] = A[i] + A[i+1]` es no-decreciente porque A está ordenado. Lo mismo para B. Entonces aplica la técnica convergente de merge de listas ordenadas.

## Por qué no hace falta un loop anidado

Naive: para cada `i`, scannear todo `j` → O(m·n). La monotonía de las sumas de pares te permite descartar prefijos enteros — misma idea que merge de listas ordenadas. No caigas en la trampa del nested loop.

## Edge cases

- Cualquier array con menos de 2 elementos → sin pares; devolver vacío.
- Todos los valores iguales en ambos arrays → todo par i, j matchea; output O(min(m, n)).
- Sin matches → lista vacía.

## Follow-ups

- **Triples** con suma igual entre arrays — análogo, pero la monotonía de sumas de pares no extiende limpio. Mencionar como más difícil.
- **Mismo array, ventanas distintas de tamaño k** — generalización: las sumas de ventanas de tamaño k son no-decrecientes solo si los *cambios* son no-negativos; las sumas adyacentes en array ordenado preservan eso solo para k=2.
