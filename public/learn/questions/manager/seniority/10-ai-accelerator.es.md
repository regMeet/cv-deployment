# IA como acelerador de desarrollo

> Tema muy en tendencia. Mostrá que usás IA **con criterio**, no a ciegas.

## Respuesta sólida

Uso IA como **acelerador de desarrollo, no como reemplazo del criterio de ingeniería**.

Me ayuda a moverme más rápido cuando estoy **prototipando, explorando soluciones alternativas o manejando tareas repetitivas** como boilerplate o generación inicial de tests.

Esto me permite enfocarme más en **decisiones de alto valor** como diseño de sistemas, trade-offs e impacto en el negocio.

Dicho esto, siempre **valido las salidas de IA** — reviso correctness, seguridad y alineación con nuestra arquitectura — antes de integrarlas en código de producción.

En general, lo veo como una forma de **aumentar la velocidad de iteración manteniendo calidad y control**.

## En qué la uso realmente, día a día

- **Scaffolding y boilerplate** — endpoints nuevos, DTOs, clases de config, interfaces de repositorio — cualquier cosa mecánica donde el patrón ya está establecido en el codebase.
- **Generación de tests** — un primer pase de unit tests / edge cases para un método que acabo de escribir, que después reviso y extiendo (la IA es buena para cobertura amplia, no siempre para elegir el assertion *correcto*).
- **Debugging y triage de logs** — pegar un stack trace o un log ruidoso y preguntar "cuál es la causa probable" acota la búsqueda rápido, sobre todo en partes del codebase que no conozco bien.
- **Leer código desconocido** — resumir qué hace realmente un módulo legacy o una librería de terceros antes de tocarlo.
- **Refactors con spec clara** — "extraé esto a un strategy pattern", "convertí esta cadena de callbacks a virtual threads" — describo la forma objetivo y reviso el diff con cuidado.
- **Docs, descripciones de PR, mensajes de commit** — convertir un diff en una descripción clara del *por qué*, no solo del *qué*.
- **Aprender herramientas/APIs nuevas más rápido** — en vez de leer toda la documentación de un framework, hago preguntas puntuales y verifico contra la doc oficial antes de confiar en la respuesta.
- **Un primer revisor de código** — antes de abrir un PR, le pido que revise mi propio diff por problemas obvios, así el tiempo del reviewer humano se enfoca en diseño/arquitectura, no en typos o null checks olvidados.

## Señales a transmitir

- IA = leverage, no piloto automático.
- Siempre validar las salidas (correctness, seguridad, encaje arquitectónico).
- Te mantiene enfocado en el trabajo que requiere criterio.
- Ejemplos concretos > "uso mucho IA" — te están chequeando que la integraste de verdad a un flujo de trabajo, no que probaste ChatGPT una vez.
