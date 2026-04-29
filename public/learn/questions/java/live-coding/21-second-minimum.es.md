# Segundo mínimo en menos de 2N comparaciones

> Encontrar el segundo más chico. La respuesta naive es 2N − 3 comparaciones (encontrar min, después min del resto). La respuesta senior usa el **método torneo**: N + log₂N − 2 comparaciones.

## Preguntas clarificadoras

- ¿Elementos distintos? (Si hay duplicados, definir "segundo min" — segundo valor distinto, o segundo por posición?)
- ¿Realmente importa el count de comparaciones, o es informativo? (En código Java real, O(n) plain está OK.)
- ¿Count estricto o solo asintótico?

## Naive — dos pasadas, 2N − 3 comparaciones

```java
public int secondMin(int[] a) {
    int min = Integer.MAX_VALUE, second = Integer.MAX_VALUE;
    for (int v : a) {
        if (v < min)          { second = min; min = v; }
        else if (v < second && v != min) second = v;
    }
    return second;
}
```

Una pasada — N − 1 comparaciones contra `min`, más N − 1 contra `second` (peor caso) ≈ 2N. Práctico, claro, sirve para la mayoría de las entrevistas.

## Torneo — N + log₂N − 2 comparaciones

Armá un bracket: compará en pares, avanzá ganadores, repetí. El mínimo gana todo; el **segundo min debe haber perdido contra el min en algún momento**, entonces está entre los log₂N elementos que perdieron directamente contra el min. Tomá el min de ese set.

```java
public int secondMinTournament(int[] a) {
    int n = a.length;
    int[] winners = a.clone();
    List<List<Integer>> losers = new ArrayList<>();
    for (int i = 0; i < n; i++) losers.add(new ArrayList<>());

    while (countLive(winners) > 1) {
        for (int i = 0; i + 1 < winners.length; i += 2) {
            int a1 = winners[i], a2 = winners[i + 1];
            if (a1 <= a2) { losers.get(i).add(a2);     winners[i + 1] = Integer.MAX_VALUE; }
            else          { losers.get(i + 1).add(a1); winners[i] = Integer.MAX_VALUE; }
        }
        winners = compact(winners);
    }
    int champion = winners[0];
    int championIdx = indexOf(a, champion);
    return Collections.min(losers.get(championIdx));
}
```

Esto es más código del que vale la pena escribir en 45 minutos. **Explicá el algoritmo verbal y escribí la versión simple** — el entrevistador queda impresionado solo con la explicación. Implementarlo es frágil.

## Por qué log₂N, no log₂N + 1

El min gana log₂N rondas. El segundo min es el más chico de los log₂N valores que perdieron contra él — encontrar el min de ese set lleva log₂N − 1 comparaciones. Total: (N − 1) por el torneo + (log₂N − 1) por el runoff = N + log₂N − 2.

## Edge cases

- N < 2 → throw.
- Todos iguales → no hay segundo min distinto (clarificar qué devolver).
- Min en índice 0 vs N−1 → al algoritmo no le importa.

## Follow-ups

- **K-ésimo más chico** en menos de O(N log N) — Quickselect, O(N) esperado.
- **Encontrar min y max** en 3N/2 comparaciones — aparear elementos primero, comparar el menor del par contra running min, el mayor contra running max.
