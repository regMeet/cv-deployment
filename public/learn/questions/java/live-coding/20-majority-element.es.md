# Majority element — Boyer-Moore voting

> Elemento que aparece **más de n/2 veces**. **O(n) tiempo, O(1) espacio** con Boyer-Moore. El test clásico de "¿conocés el truco?" — sort (O(n log n)) y HashMap (O(n) espacio) son baselines a superar.

## Preguntas clarificadoras

- ¿Hay garantía de que existe un majority? (Si no, necesitás una pasada de verificación.)
- ¿Estrictamente más de n/2, o al menos n/2?
- ¿Múltiples candidatos posibles? (>n/2 ⇒ a lo sumo uno; >n/3 ⇒ a lo sumo dos — otro problema.)

## Algoritmo de Boyer-Moore voting

```java
public int majority(int[] a) {
    int candidate = 0, count = 0;
    for (int v : a) {
        if (count == 0)         { candidate = v; count = 1; }
        else if (v == candidate) count++;
        else                     count--;
    }
    // verificación — necesaria si no se garantiza majority
    count = 0;
    for (int v : a) if (v == candidate) count++;
    return count > a.length / 2 ? candidate : -1;
}
```

## La intuición

Apareá cada elemento majority con uno no-majority. Como el count del majority > n/2, siempre te van a sobrar — esos son los majority. El loop simula el apareamiento cancelando vecinos distintos.

`candidate` y `count` arman un tracker de "líder actual"; cada vez que `count` llega a 0, descartás el pasado y arrancás fresco. Crucialmente, el majority real sobrevive a todos esos resets.

## Por qué es famoso

Es el ejemplo canónico de **algoritmo streaming** — una pasada, O(1) de estado. Antes de Boyer-Moore, se asumía que esto requería sort o hashing. Mencionalo en entrevistas para dar contexto.

## Edge cases

- Sin majority — la pasada de verificación devuelve -1 (o throw, según spec).
- Todos iguales → `candidate` correcto desde la línea 1.
- Un solo elemento → trivialmente majority.
- Empate (exactamente n/2) → no es majority; la verificación rechaza.

## Follow-ups

- **Todos los que aparecen > n/3 veces** (LeetCode 229) — a lo sumo dos candidatos, Boyer-Moore generalizado con dos trackers.
- **General "más de n/k"** — k-1 trackers; misma lógica.
- **Majority distribuido** — combinar estados parciales de Boyer-Moore mergeando los dos `(candidato, count)` de cada shard.
