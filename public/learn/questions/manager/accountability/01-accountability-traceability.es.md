# ¿Cómo asegurás accountability y trazabilidad del sistema?

> Pregunta nivel senior+. Quieren ver **observabilidad + procesos + ownership** todo entrelazado.

## Respuesta sólida

Aseguro accountability y trazabilidad a través de una combinación de **observabilidad, ownership claro y procesos estructurados**.

**En el lado del sistema**, me apoyo en **logs, métricas y distributed tracing** para tener visibilidad completa de lo que pasa en producción. Cada request puede ser trazado de punta a punta, lo que ayuda a identificar issues rápido y entender el comportamiento del sistema.

**En el lado del proceso**, me aseguro de que los cambios sean trazables a través de **control de versiones, pull requests y sistemas de tickets**, así toda decisión tiene contexto e historial.

También promuevo **ownership claro de los servicios**, así siempre se sabe quién es responsable de qué.

Esta combinación nos permite **detectar issues más rápido, entender root causes y mejorar el sistema continuamente**.

## Bloques fundamentales

### 1. Observabilidad (core técnico)

- Logs estructurados.
- Métricas — latencia, errores, throughput.
- Distributed tracing — flujo del request entre servicios.

> "If something breaks, we should be able to answer **what happened, where, and why**."

### 2. Trackability (historial de cambios)

- Commits + PRs.
- Tickets (Jira, Linear, etc.).
- Feature flags — para saber qué está activo.

> "Every change in the system should be **traceable to a decision**."

### 3. Accountability (ownership real)

- Owner por servicio.
- Rotación de on-call.
- Postmortems sin culpa.

> "Clear ownership ensures **faster decision-making and better system reliability**."

### 4. Incidentes

> "For incidents, I follow a structured approach: **quick mitigation, clear communication, and a blameless postmortem** to improve the system."

### 5. Métricas de éxito

- **MTTR** (mean time to recovery).
- Error rate.
- Uptime / disponibilidad.

## Versión staff-level

> "I think about accountability not only at the system level but also at the team level. Systems should be **observable by design**, but teams should also have **clear ownership and feedback loops**. That's what enables continuous improvement, not just incident reaction."

## Errores comunes a evitar

- Hablar solo de logs (suena junior).
- No mencionar ownership.
- No conectar con procesos.
- No conectar con impacto.
