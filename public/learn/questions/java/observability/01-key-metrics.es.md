# ¿Qué métricas siempre monitoreás?

> Distribuciones, no promedios. Señales user-facing, más indicadores de saturación que avisan temprano.

## Las cuatro categorías

### 1. Latencia

- **p50 / p95 / p99** (nunca solo el promedio — esconde tail latency).
- Por endpoint, por dependencia.

### 2. Errores

- Tasa de 5xx.
- Tasa de exceptions por minuto.
- Transacciones de negocio fallidas (órdenes no creadas, pagos no procesados).

### 3. Throughput

- Requests / sec.
- Breakdown por endpoint — la saturación a menudo se esconde en una sola ruta.

### 4. Saturación

- CPU, memoria, tiempo de pausa de GC.
- **Uso de thread pool** (used / max).
- Uso de **DB connection pool**.
- Profundidad de queues (Kafka lag, RabbitMQ depth, queues internas).

## Frameworks

### USE — Utilization, Saturation, Errors
- Para recursos (CPU, memoria, discos, pools).
- "¿Está ocupado? ¿Está sobrecargado? ¿Está fallando?"

### RED — Rate, Errors, Duration
- Para servicios que manejan requests.
- "¿Cuántos requests, cuántos errores, cuánto tardan?"

> USE para recursos, RED para servicios. Usar ambos.

## Sobre qué alertar

- **Síntomas user-impacting** primero: tasa de errores, latencia p99.
- **Leading indicators**: saturación creciendo (pool > 80%, heap > 85%, queue lag subiendo).
- Evitar alertar sobre **infraestructura** (CPU > 90%) a menos que prediga impacto al usuario.

## Frase para entrevista

> "I monitor latency in percentiles (p50/p95/p99), error rate, throughput, and saturation. I prefer alerts on user-facing symptoms or leading indicators, not raw infrastructure metrics — alerting on CPU > 90% wakes you up for nothing if users aren't affected."
