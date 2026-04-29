# Modern Java decision guide

> One-liner cheat sheet for "what construct should I use?".

## Decision table

| Need | Use |
|---|---|
| Behavior only | Interface |
| Multiple inheritance | Interface |
| Shared state | Abstract class |
| Base class with logic | Abstract class |
| Immutable data | Record |
| Controlled hierarchy | Sealed class |

## Interview line

> "In modern Java, I prefer **interfaces for behavior**, **records for data**, **sealed classes for controlled hierarchies**, and **abstract classes when I need shared state or base logic**."

## Mental model

- **Interface** → role / capability.
- **Abstract** → strong "is-a" with shared state.
- **Record** → "this is just data".
- **Sealed** → "only these N subtypes exist, ever".
