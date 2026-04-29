# `map` vs `flatMap`

> `map` transforma 1→1. `flatMap` transforma 1→N y aplana.

## map — 1 a 1

```java
List<String> names = users.stream()
    .map(User::name)         // User → String
    .toList();
```

## flatMap — 1 a muchos, aplanado

```java
// los users tienen muchos teléfonos; querés todos los teléfonos en una sola lista
List<String> phones = users.stream()
    .flatMap(u -> u.phones().stream())   // User → Stream<Phone>
    .toList();
```

Sin `flatMap` te quedaría `Stream<List<Phone>>` y tendrías que desempaquetar manualmente.

## Visual

```
map:     [1, 2, 3] → [10, 20, 30]
flatMap: [[1,2], [3], [4,5]] → [1, 2, 3, 4, 5]
```

## Regla rápida

- Sale un único valor → `map`.
- Sale un stream / lista → `flatMap`.
