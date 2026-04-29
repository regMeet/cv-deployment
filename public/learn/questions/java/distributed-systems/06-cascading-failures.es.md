# ¿Cómo evitás cascading failures?

> Un downstream lento no debería matar al resto del sistema. Diseñá para fallos parciales.

## Patrones

### Circuit breaker

Después de N fallas consecutivas, el breaker **se abre**: las llamadas siguientes fallan rápido por X segundos sin tocar la dependencia que falla. Después pasa a **half-open** (un trial call) antes de cerrarse de nuevo.

- Frena la carga en cascada sobre una dependencia enferma.
- Herramientas: **Resilience4j**, Hystrix (legacy).

### Timeouts agresivos

Si tu p99 a la dependencia X es 500ms, no dejes que un call espere 30s. Un timeout corto libera el thread y deja al caller fallar rápido.

> Regla: el timeout del caller debe ser **< el timeout del caller upstream**, así fallás antes que ellos.

### Bulkheads

Threadpools separados por dependencia. Un `serviceA` lento consume solo su propio pool — el pool para `serviceB` queda sano.

- Conceptualmente: compartimentos del casco de un barco.
- En Java: `ExecutorService` dedicado por dependencia.

### Retry con backoff y jitter

Las fallas transitorias se reintentan, pero:

- **Backoff exponencial** — no martilles al servicio que se recupera.
- **Jitter** — que no todos los clientes reintenten en el mismo instante (estampida sincronizada).
- **Cap de retries** — eventualmente rendite; si no, construís una queue que no podés drenar.

### Fallbacks

Si una dependencia está caída, devolver un response **degradado** en lugar de erorrear:

- Valor cacheado anterior.
- Valor default.
- Feature recortado.

### Load shedding

Bajo saturación, descartar o despriorizar tráfico de baja prioridad en lugar de aceptar todo y encolar para siempre.

## Combinando

```
[caller]
  ├── timeout (500ms)
  ├── circuit breaker (open después de 5 fallas)
  ├── bulkhead (thread pool de 20)
  ├── retry (3x con exp backoff + jitter)
  └── fallback (valor cacheado)
       ↓
   [dependency]
```

## Frase para entrevista

> "Cascading failures usually come from one slow dependency saturating the caller's threads. I prevent that with timeouts that match SLOs, bulkheads to isolate dependencies, circuit breakers to fail fast on sick services, retry with jitter to avoid stampedes, and fallbacks for graceful degradation."
