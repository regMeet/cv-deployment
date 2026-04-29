# ¿Cómo detectás un memory leak?

> Mirá el heap a lo largo del tiempo. Si Old Gen crece y no baja después de un Full GC → leak.

## Señales

- Uso del heap subiendo a través de días/semanas.
- Old Gen llena → Full GCs frecuentes → eventual `OutOfMemoryError`.
- Spikes de latencia correlacionados con pausas de GC.

## Herramientas

### 1. GC logs

```bash
-Xlog:gc*:file=gc.log
```

Plotteá heap-after-GC en el tiempo. Si la baseline post-GC sigue subiendo → leak.

### 2. Heap dumps

```bash
jmap -dump:live,file=heap.hprof <pid>
```

O automático en OOM:

```bash
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/tmp/heap.hprof
```

### 3. Eclipse MAT / VisualVM

Abrí el `.hprof`. **Leak Suspects Report** te muestra qué está dominando el heap.

### 4. Profilers en producción

- **Datadog APM** / **JFR (Java Flight Recorder)** pueden samplear allocaciones + estadísticas de GC en vivo.

## Workflow

1. Confirmar el leak desde GC logs (heap post-GC subiendo).
2. Disparar un heap dump cerca del peak sospechado.
3. Analizar con MAT — encontrar el dominator (el objeto con más retained heap).
4. Trazar la GC root path → ahí está rooteado el leak (frecuentemente una static collection o un `ThreadLocal`).

## Frase para entrevista

> "I confirm with GC logs first — if the post-GC baseline is climbing, that's a leak. Then a heap dump and MAT to find the dominator. Most leaks I've found traced back to static collections, unbounded caches, or `ThreadLocal` left in a thread pool."
