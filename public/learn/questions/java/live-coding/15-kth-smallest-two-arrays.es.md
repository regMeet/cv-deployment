# K-ésimo más chico en la unión de dos arrays ordenados

> Dos arrays ordenados de tamaños M, N. Devolver el K-ésimo más chico de la unión. **O(log(min(K, M, N)))** con el algoritmo correcto.

## Preguntas clarificadoras

- ¿K en 1-index o 0-index? (Gran fuente de bugs off-by-one.)
- ¿K puede exceder M+N? (Validar input.)
- ¿Duplicados entre arrays? (Sí, tratar como multiset.)
- ¿Mediana (caso especial K = (M+N)/2) o general?

## Naive — mergear hasta haber visto K elementos

O(K) tiempo, trivial. Mencionarlo como baseline.

```java
public int kthMerge(int[] a, int[] b, int k) {
    int i = 0, j = 0, count = 0, last = 0;
    while (count < k) {
        if (i < a.length && (j == b.length || a[i] <= b[j])) last = a[i++];
        else                                                  last = b[j++];
        count++;
    }
    return last;
}
```

## O(log K) — binary partition

Comparar los K/2-ésimos de cada array; descartar la mitad baja del array cuyo K/2-ésimo es menor.

```java
public int kth(int[] a, int aStart, int[] b, int bStart, int k) {
    if (aStart >= a.length) return b[bStart + k - 1];
    if (bStart >= b.length) return a[aStart + k - 1];
    if (k == 1) return Math.min(a[aStart], b[bStart]);

    int half  = k / 2;
    int aIdx  = Math.min(aStart + half, a.length) - 1;
    int bIdx  = Math.min(bStart + half, b.length) - 1;

    if (a[aIdx] <= b[bIdx]) {
        return kth(a, aIdx + 1, b, bStart, k - (aIdx - aStart + 1));
    } else {
        return kth(a, aStart, b, bIdx + 1, k - (bIdx - bStart + 1));
    }
}
```

Cada llamada elimina ~K/2 candidatos → profundidad log K, trabajo constante por nivel.

## Por qué descartar el lower-K/2 es seguro

Si `a[K/2-1] < b[K/2-1]`, todo elemento de `a[0..K/2-1]` tiene a lo sumo `K/2 - 1` de `a` y `K/2 - 1` de `b` más chicos — entonces su rank es a lo sumo K - 1 en la unión. Ninguno puede ser el K-ésimo. A la basura.

## Edge cases

- Un array vacío → respuesta es `b[k-1]`.
- K = 1 → mínimo de las dos cabezas.
- K = M + N → máximo de las dos colas.
- K fuera de rango → throw.

## Follow-ups

- **Mediana de dos arrays ordenados** (LeetCode 4) — misma idea de partition pero alrededor de encontrar el corte.
- **K-ésimo en N arrays ordenados** — min-heap con las cabezas, pop K veces → O(K log N).
