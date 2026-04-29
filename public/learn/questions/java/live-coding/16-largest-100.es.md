# Top-K más grandes de un stream que no entra en memoria

> Archivo con 10^8 enteros, uno por línea. Encontrar los 100 más grandes. No se puede cargar todo a la vez. **Min-heap de tamaño K — O(N log K) tiempo, O(K) espacio.**

## Preguntas clarificadoras

- ¿Duplicados permitidos? ¿El top-K los incluye?
- Valores empatados en el borde del K-ésimo — ¿devolver todos los empates o exactamente K?
- Presupuesto de memoria — ¿O(K) (unos cientos de ints) está OK? Generalmente sí.
- ¿Una sola máquina o input distribuido? (Otro algoritmo para esto.)

## Solución — min-heap acotado

```java
import java.util.PriorityQueue;
import java.util.Iterator;

public int[] topK(Iterator<Integer> stream, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>(k);   // min-heap
    while (stream.hasNext()) {
        int v = stream.next();
        if (heap.size() < k) {
            heap.offer(v);
        } else if (v > heap.peek()) {
            heap.poll();
            heap.offer(v);
        }
    }
    int[] out = new int[heap.size()];
    int i = 0;
    while (!heap.isEmpty()) out[i++] = heap.poll();   // orden ascendente
    return out;
}
```

El min-heap siempre contiene los **K más grandes vistos hasta ahora**. El top del heap es el más chico de esos K — cualquier valor más grande lo reemplaza; cualquier valor más chico se ignora.

## Por qué min-heap (no max-heap)

Queremos acceso rápido al *umbral* (el más chico entre los actuales K). Reemplazar el umbral y re-heapificar es O(log K). Un max-heap forzaría un scan lineal para encontrar el más chico.

## Alternativa con sort — y por qué está mal acá

Ordenar todo el stream, tomar top K → O(N log N) tiempo, O(N) espacio. **El espacio O(N) no entra en la restricción** de no poder cargar todo. Mencionar el sort como respuesta obvia incorrecta para mostrar awareness.

## Edge cases

- N < K → devolver todo.
- Todos iguales → devuelve K copias (o todos si N < K).
- Stream con solo negativos → sigue funcionando, sin casos especiales.

## Follow-ups

- **Distribuido en muchos shards** — cada shard computa su top-K, nodo central mergea (heap de K candidatos por shard, total O(S·K) memoria).
- **Solo el K-ésimo más grande (no toda la lista)** — mismo heap, devolver su peek al final.
- **Quickselect** — O(N) esperado si tenés el data en memoria; inútil acá porque no se puede.
