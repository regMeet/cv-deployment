# ¿Qué pasa si un thread se bloquea en WebFlux?

> WebFlux corre sobre un pool chico y fijo de threads event-loop (Netty, por defecto ≈ cantidad de cores de CPU). Un solo llamado bloqueante en uno de esos threads traba **todos** los requests agendados en él — no solo el actual.

## Por qué es tan dañino

- MVC: N threads, 1 thread bloqueado → los otros N-1 siguen sirviendo requests. Degrada de forma gradual.
- WebFlux: ~cantidad de cores en threads, cada uno multiplexando muchos requests. Bloquear **un solo** thread event-loop (un llamado JDBC, `Thread.sleep`, un `HttpURLConnection` bloqueante, I/O de archivos síncrono) → todos los requests asignados a ese loop **se encolan detrás**. La latencia se dispara, después caen timeouts en cascada, y toda la instancia parece no saludable aunque el uso de CPU sea bajo.
- Es silencioso: sin excepción, sin línea de log obvia — solo un thread dump mostrando un thread event-loop (`reactor-http-nio-N`) trabado en un llamado bloqueante mientras el p99 se dispara.

## Cómo detectarlo

- **BlockHound** — instrumenta la JVM en tests/dev para tirar una excepción cuando ocurren llamados bloqueantes en un thread de Reactor/Netty. La forma estándar de atrapar esto antes de prod.
- Thread dump bajo carga: buscar threads `reactor-http-nio-*` en `BLOCKED`/`WAITING` sobre un driver JDBC, un bloque `synchronized`, o I/O bloqueante.
- Métricas: latencia de cola del event-loop / métricas del scheduler vía Micrometer; una app WebFlux sana tiene delay de scheduling cercano a cero.

## Cómo arreglarlo

1. **Usar drivers no bloqueantes en toda la cadena**: R2DBC en vez de JDBC, clientes reactivos de Redis/Mongo, `WebClient` en vez de `RestTemplate`.
2. **Si un llamado bloqueante es inevitable** (librería legacy, SDK bloqueante), sacarlo explícitamente del event loop:

```java
Mono<Result> result = Mono.fromCallable(() -> legacyBlockingCall())
    .subscribeOn(Schedulers.boundedElastic()); // pool dedicado para trabajo bloqueante
```

3. Nunca llamar `.block()` dentro de una cadena reactiva corriendo en un thread event-loop — es la versión accidental más común de este bug (usualmente por mezclar una utilidad bloqueante vieja en un handler de WebFlux).
4. Mantener también el trabajo CPU-heavy (no I/O) fuera del event loop, vía `publishOn(Schedulers.parallel())`, para que no le quite capacidad a la multiplexación de I/O.

## Frase para entrevista

> "En WebFlux el event loop es un pool chico y fijo — bloquear un thread no solo frena un request, traba todos los requests agendados en ese loop. Lo atraparía en CI con BlockHound, y si un llamado bloqueante es inevitable lo aislaría con `subscribeOn(Schedulers.boundedElastic())` en vez de dejarlo correr inline en el event loop."
