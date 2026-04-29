# Framework para preguntas clarificadoras

> Antes de escribir código en una entrevista de live-coding, hacer 2–4 preguntas filosas. Señaliza seniority y previene trabajo perdido.

## Frases de apertura

> "Before I start coding, a few clarifying questions:"
>
> "Let me make sure I understand the requirements..."
>
> "A few clarifying questions before I jump in..."
>
> "The answer depends on a few constraints — can I ask..."

## Preguntas de alto leverage

### 1. ¿Single-instance o distribuido?

La arquitectura cambia todo. Un counter en un solo pod es un array `synchronized`. Entre pods → Redis con ops atómicas, o un agregador streaming.

> "Is this single-instance or distributed (multiple pods)?"

### 2. ¿Exacto o aproximado?

Counts exactos son caros. Aproximaciones (sketches, sampling) son mucho más baratas a escala.

> "Do we need an exact count, or is an approximation acceptable?"

Si aproximado está OK → mencionar **Count-Min Sketch**, **HyperLogLog**, sampling.

### 3. ¿Escala esperada (QPS)?

Cientos, miles, cientos de miles? Distintos órdenes de magnitud → distintas soluciones.

> "What's the expected throughput? Hundreds, thousands, hundreds of thousands of QPS?"

### 4. ¿Consistencia estricta o eventual?

Si eventual está OK, tenés muchas más opciones baratas.

> "Do we need strict consistency, or is eventual consistency acceptable?"

### 5. Ratio read-to-write (bonus, muy senior)

Read-heavy → cachear agresivo. Write-heavy → optimizar el write path.

> "What's the read-to-write ratio?"

### 6. SLO de latencia

Maneja toda decisión interna.

> "Any latency SLO we need to hit? p99?"

## Por qué funciona

- **Single vs distribuido**: muestra que sabés que la arquitectura cambia todo.
- **Exacto vs aproximado**: muestra que conocés trade-offs (CMS, HLL, sampling).
- **QPS**: muestra que pensás en escala desde el primer minuto.
- **R/W ratio + SLO**: muestra que optimizás para el workload real.

## Pensamiento de cierre

Siempre cerrar con: "Given those constraints, here's how I'd approach it..." — eso te lleva limpio al diseño.
