# Programación funcional en Java

> Java evolucionó hacia menos boilerplate, código más declarativo, mejor concurrencia y código más seguro (inmutabilidad).

## Idea core

> **Describir qué querés, no cómo hacerlo.**

## Principios clave

- **Funciones puras** — sin efectos colaterales.
- **Inmutabilidad** — los datos no cambian in-place.
- **Composición** — funciones chicas combinadas en pipelines.

## Por qué importa

- Streams + lambdas → pipelines que se leen top-down como una receta.
- Records + sealed classes → modelado de datos más seguro.
- Virtual threads → concurrencia sin callback hell.

## Frase para entrevista

> "Java's functional features improve readability and composability, especially in business logic. They have some overhead, so for performance-critical hot paths I still prefer traditional loops."
