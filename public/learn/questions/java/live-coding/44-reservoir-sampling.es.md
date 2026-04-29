# Elegir K elementos random de un stream de largo desconocido

> Linked list (o stream) de largo N. N es desconocido; no se puede pre-computar. Devolver K elementos uniformemente random. **Reservoir sampling — Algorithm R: O(N) tiempo, O(K) espacio, una pasada.**

## Preguntas clarificadoras

- ¿Sample con o sin reposición? (Estándar reservoir = sin.)
- ¿Cada elemento equally likely (uniforme), o ponderado? (Este problema: uniforme.)
- ¿Los duplicados en el stream se tratan como elementos distintos?
- ¿Reproducible (RNG seedeado)?

## Algorithm R — Reservoir Sampling

```java
import java.util.Random;
import java.util.Iterator;

public int[] sample(Iterator<Integer> stream, int k) {
    Random rng = new Random();
    int[] reservoir = new int[k];
    int i = 0;
    while (stream.hasNext() && i < k) reservoir[i++] = stream.next();   // llenar primeros k

    while (stream.hasNext()) {
        int v = stream.next();
        int j = rng.nextInt(i + 1);                                       // 0..i inclusivo
        if (j < k) reservoir[j] = v;
        i++;
    }
    return reservoir;
}
```

Para el i-ésimo elemento (0-indexed, tras los primeros K):

- Probabilidad de que el nuevo elemento termine en el reservoir: `K / (i + 1)`.
- Probabilidad de que un elemento actual sea *expulsado*: `(K / (i+1)) · (1/K) = 1 / (i+1)`.
- Entonces cada elemento sobrevive con probabilidad que decae exactamente a `K/N` al final.

## Bosquejo de demostración (un párrafo)

Inducción sobre `i`. Tras procesar `i+1` elementos, cada uno está en el reservoir con probabilidad `K / (i+1)`. El nuevo se suma con `K/(i+1)` (por el algoritmo). Cada elemento previo del reservoir sobrevive con `(K/(i+1)) · ((K-1)/K) + (1 − K/(i+1))` = `K/(i+1)` tras simplificar. Misma probabilidad para todos → muestra uniforme.

## Por qué "first fill, después probabilístico" es la estructura

Una vez vistos al menos K elementos, cada elemento siguiente recibe chance proporcional a `K / (count_actual)`. La fase de first-fill es degenerada: probabilidad 1 porque tenemos que tomarlos.

## Edge cases

- N < K → devolver los N elementos (`reservoir` parcialmente lleno).
- Un solo elemento, K = 1 → ese elemento con probabilidad 1.
- K = 0 → resultado vacío; trivial.
- Stream muy largo — O(N) sin importar.

## Follow-ups

- **Weighted reservoir sampling** (Algorithm A-Res / A-Chao) — asignar a cada elemento una clave `r^(1/w_i)` donde `r ~ Uniform(0,1)`, quedarse con las K claves más grandes.
- **Sample de 1 elemento** (K = 1) — mismo algoritmo; one-liner más limpio.
- **Reservoir distribuido** — particionar stream, correr reservoir por shard, mergear — cuidado: la concatenación simple es sesgada; usar weighted merge.
