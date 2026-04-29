# ¿Cómo hacés code reviews?

> Chequean **calidad técnica + estilo de colaboración**.

## Respuesta sólida

Trato a los code reviews como una **conversación, no como un gate**. El objetivo es mejorar el código y ayudar al autor a crecer, no demostrar que soy inteligente.

Cuando reviso, me enfoco en:

- **Correctness y lógica** primero.
- **Arquitectura y mantenibilidad** — ¿esto encaja en el sistema?, ¿va a ser fácil de evolucionar?
- **Edge cases** que el autor puede haberse perdido.
- **Legibilidad** — ¿alguien nuevo entendería este código?

Separo **must-fix** de **suggestion** explícitamente para que el autor no quede paralizado por cada comentario. Prefiero sugerir mejoras en lugar de dictarlas.

Para cambios complejos, suelo **hacer preguntas en lugar de afirmar** — a veces el autor tiene contexto que yo no.

También intento **revisar rápido**. Una review lenta bloquea al equipo más de lo que la mayoría se da cuenta.

## Evitar

- Nitpicking de estilo que el linter podría agarrar.
- Comentarios vagos ("esto podría ser mejor"); ser específico.
- Tono que pone al autor a la defensiva.
