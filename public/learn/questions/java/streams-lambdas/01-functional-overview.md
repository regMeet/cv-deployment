# Functional programming in Java

> Java evolved toward less boilerplate, more declarative code, better concurrency, and safer code (immutability).

## Core idea

> **Describe what you want, not how to do it.**

## Key principles

- **Pure functions** — no side effects.
- **Immutability** — data doesn't change in place.
- **Composition** — small functions combined into pipelines.

## Why it matters

- Streams + lambdas → pipelines that read top-down like a recipe.
- Records + sealed classes → safer data modeling.
- Virtual threads → concurrency without callback hell.

## Interview line

> "Java's functional features improve readability and composability, especially in business logic. They have some overhead, so for performance-critical hot paths I still prefer traditional loops."
