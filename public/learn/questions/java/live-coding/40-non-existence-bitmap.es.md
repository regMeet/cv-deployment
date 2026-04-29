# Verificar ausencia de un número en lista ordenada en disco usando bitmap

> Archivo ordenado de N enteros en rango `[0, M)`, M ≫ N, demasiado grande para cargar. Hay que responder "¿está X en el archivo?" rápido. **Bitmap** de M bits en memoria: O(N) build, O(1) query.

## Preguntas clarificadoras

- M ≫ N ¿cuánto? (ej. N = 10⁹, M = 10¹² → bitmap es 125 GB; no entra. M = 10⁹, N = 10⁶ → bitmap es 125 MB; entra.)
- ¿Muchas queries o solo una? (Para una sola, scan del stream; para muchas, construir el índice.)
- ¿Archivo read-only o mutable?

## Solución — construir bitmap, después query

```java
public class BitmapSet {
    private final long[] bits;
    private final long   m;

    public BitmapSet(long m) {
        this.m = m;
        this.bits = new long[(int) ((m + 63) / 64)];
    }

    public void add(long value) {
        int idx = (int) (value >>> 6);            // value / 64
        long mask = 1L << (value & 63);            // posición de bit en la palabra
        bits[idx] |= mask;
    }

    public boolean contains(long value) {
        int idx = (int) (value >>> 6);
        long mask = 1L << (value & 63);
        return (bits[idx] & mask) != 0;
    }
}
```

Build: streamear el archivo una vez, `add(v)` por cada valor → O(N) tiempo.
Query: O(1) con dos ops aritméticas y un AND.

Memoria: `M / 8` bytes. Para M = 10⁹, son 125 MB — OK en un server.

## Cuando el bitmap no entra

Si `M / 8` excede la memoria, opciones:

- **Bloom filter** — O(N) bits por elemento con tasa de falsos positivos pequeña. Falsos negativos nunca pasan, así que "ausente" es confiable; "presente" necesita verificación en disco.
- **Binary search externo** en el archivo ordenado — O(log N) seeks de disco por query. OK si los seeks son baratos (SSD).
- **Representación sparse** — array ordenado o B-tree de valores presentes. Memoria ∝ N, no M.

## Por qué el orden del archivo es irrelevante para el bitmap

La sortedness es un hint de que el archivo es muy grande para hashear en `Set<Long>`. El bitmap tampoco *necesita* sortedness — es una estructura de membership desordenada. Mencionarlo en entrevista para mostrar que notaste la spec.

## Edge cases

- `M = 0` → dominio vacío; nada que chequear.
- Duplicados en archivo — bitmap dedupea silenciosamente (bit seteado dos veces sigue seteado).
- `value >= M` en query → fuera de bounds; capear o throw.

## Follow-ups

- **Contar valores distintos** — `Long.bitCount` sobre todas las palabras.
- **Range queries** — trabajo extra; bitmap no soporta directamente range counts en O(1).
- **Updates** (inserciones en archivo) — llamar `add(v)` con el nuevo valor; muy rápido.
