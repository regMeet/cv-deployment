# Detectar issues antes de que los usuarios los vean

> Alertar sobre indicadores **leading** (predictivos) más que **lagging** (ya fallaron).

## Lagging vs leading

- **Lagging** — spike de tasa de errores, latencia pasada del SLO, transacciones fallidas. Dolor real-user ya sucediendo.
- **Leading** — saturación creciendo, profundidad de queue subiendo, latencia con tendencia al alza. Dolor por suceder.

El objetivo es arreglarlo antes de que el indicador lagging dispare.

## Indicadores leading prácticos

- **Tendencia de latencia** — p99 +50% en la última hora, incluso si está bajo SLO.
- **Saturación** — thread pool > 80%, DB connection pool > 80%, heap > 85% post-GC.
- **Profundidad de queue creciendo** — lag de consumer Kafka subiendo, queue interna sin drenar.
- **Ratio de tasa de error** — 5xx pasando de 0.1% a 0.5% (pequeño, pero un cambio 5×).
- **Degradación de dependencias** — p99 downstream se duplicó.

## Herramientas más allá de alertas

### Canary deploys

Mandar un slice chico (5%) de tráfico a la versión nueva. Comparar métricas clave (latencia, tasa de errores) contra el grupo de control **antes de full rollout**. Mal canary → rollback automático.

### Synthetic monitoring

Un bot pega a endpoints críticos cada N segundos desde fuera de tu red. Detecta issues incluso cuando ningún usuario pegó por ese path.

### Error budgets de SLO

Si tu SLO es 99.9% en 30 días, tu "error budget" es 0.1% (~43 minutos). Trackeá el burn rate — si estás consumiendo budget muy rápido, frená cambios riesgosos.

## Frase para entrevista

> "Lagging alerts wake you up after the user is already angry. I prefer leading indicators — saturation, latency trends, queue depth — combined with canary deploys and synthetic monitoring. The goal is to catch the problem before the SLO is breached, not after."
