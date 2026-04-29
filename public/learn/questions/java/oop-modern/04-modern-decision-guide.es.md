# Guía de decisión Java moderno

> Cheat sheet de "¿qué construct uso?"

## Tabla de decisión

| Necesidad | Usar |
|---|---|
| Solo comportamiento | Interface |
| Herencia múltiple | Interface |
| Estado compartido | Abstract class |
| Clase base con lógica | Abstract class |
| Datos inmutables | Record |
| Jerarquía controlada | Sealed class |

## Frase para entrevista

> "In modern Java, I prefer **interfaces for behavior**, **records for data**, **sealed classes for controlled hierarchies**, and **abstract classes when I need shared state or base logic**."

## Modelo mental

- **Interface** → rol / capacidad.
- **Abstract** → "is-a" fuerte con estado compartido.
- **Record** → "esto es solo datos".
- **Sealed** → "solo existen estos N subtipos, siempre".
