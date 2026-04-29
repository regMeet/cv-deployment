# Lambdas — behavior as data

> Anonymous functions you can pass around like values.

## Example

```java
Function<String,Integer> length = s -> s.length();
length.apply("hello"); // 5
```

## Common functional interfaces

| Interface | Purpose |
|---|---|
| `Function<T,R>` | transform `T` → `R` |
| `Predicate<T>` | test (boolean) |
| `Consumer<T>` | side effect (no return) |
| `Supplier<T>` | provide a `T`, no input |
| `BiFunction<T,U,R>` | two inputs → result |

## Where they're used

- Streams (`filter`, `map`, `forEach`, etc.).
- Comparators (`Comparator.comparing(User::age)`).
- Callbacks / event handlers.
- Strategy pattern without verbose anonymous classes.

## Method references

Cleaner than lambdas when you're just calling a method:

```java
list.stream().map(String::toUpperCase);
list.forEach(System.out::println);
```
