# Percentiles de latencia — p50/p95/p99

> Los promedios esconden outliers. Los percentiles muestran la distribución real. **Optimizá p95/p99**, no p50.

## Qué significa cada uno

- **p50 (mediana)** — la mitad de tus requests son más rápidas que esto.
- **p95** — 95% son más rápidas, 5% más lentas (≈ 1 cada 20).
- **p99** — 99% son más rápidas, 1% más lentas (≈ 1 cada 100).

## Por qué los promedios mienten

Ejemplo: 99 requests a 100ms + 1 request a 10s.
- Promedio ≈ **200ms** (consuelo falso).
- p99 = **10s** (la verdad).

## Tail latency

El 1% lento — tu p99 — es lo que:

- Rompe UX (los usuarios ven una app colgada).
- Rompe SLAs.
- Dispara cascadas de timeout en servicios upstream.

## Qué optimizar primero

> **p99**, después p95. Mejorar p50 sin mover p99 significa que el sistema sigue siendo malo para algunos usuarios — y los timeouts upstream siguen disparándose.

## Tooling

Datadog, Grafana, New Relic muestran distribuciones:

- p50 → experiencia "normal".
- p95 → degradación.
- p99 → comportamiento crítico / outlier.

## Frase para entrevista

> "I use percentiles (p50, p95, p99) to understand latency distribution. Averages hide outliers, so I focus on p95/p99 to identify tail latency and optimize the cases that actually impact users."

## Pivot staff-level

> "If you improve p50 but not p99, the system still feels broken to a meaningful slice of users. Improving p99 lifts the whole experience — and reduces upstream timeout cascades."
