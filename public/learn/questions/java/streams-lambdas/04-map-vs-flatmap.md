# `map` vs `flatMap`

> `map` transforms 1→1. `flatMap` transforms 1→N and flattens.

## map — 1 to 1

```java
List<String> names = users.stream()
    .map(User::name)         // User → String
    .toList();
```

## flatMap — 1 to many, flattened

```java
// users have many phones; want all phones in one list
List<String> phones = users.stream()
    .flatMap(u -> u.phones().stream())   // User → Stream<Phone>
    .toList();
```

Without `flatMap` you'd get `Stream<List<Phone>>` and have to unwrap manually.

## Visual

```
map:     [1, 2, 3] → [10, 20, 30]
flatMap: [[1,2], [3], [4,5]] → [1, 2, 3, 4, 5]
```

## Quick rule

- Single value out → `map`.
- Stream / list out → `flatMap`.
