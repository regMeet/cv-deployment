# Saga pattern (transacciones distribuidas)

> Reemplazar ACID global con una secuencia de transacciones locales + compensaciones.

## El problema

En microservicios, cada servicio es dueño de su propia DB. No hay un `BEGIN TRANSACTION` que abarque servicios. ¿Cómo mantenés consistencia entre un flujo de orden que toca inventory, payment y shipping?

## La respuesta del Saga

Descomponer el flujo en pasos independientes. Cada paso:

- Commitea localmente.
- Si un paso posterior falla, **acciones de compensación** deshacen los anteriores.

## Ejemplo — checkout de e-commerce

1. **Reservar stock** — commit local.
2. **Procesar pago** — commit local.
3. **Crear orden** — commit local.

Si **falla el pago**:
- Ejecutar compensación → **liberar el stock reservado**.

No hay rollback automático como en una DB. El "undo" lo diseñás explícitamente.

## Dos sabores

### Orquestada

Un servicio central ("orquestador") coordina los pasos y decide cuándo llamar a las compensaciones.

- ✅ Fácil de debuggear — el flujo vive en un lugar.
- ❌ Más acoplamiento. El orquestador se vuelve un hot spot.

### Coreografiada (event-driven)

Los servicios reaccionan a eventos (`OrderCreated`, `PaymentFailed`, etc.). Sin coordinador central.

- ✅ Desacoplado. Los servicios no se conocen entre sí.
- ❌ Más difícil de seguir. Flujo implícito disperso entre servicios.

## Regla práctica

- Pocos pasos → orquestado es más simple.
- Muchos productores/consumidores independientes → coreografía escala mejor.

## Frase para entrevista

> "Sagas trade strict ACID for availability. Each step commits locally, and we design compensations for the rollback paths. I lean orchestrated for short flows where debuggability matters, choreographed for high-volume event-driven systems."
