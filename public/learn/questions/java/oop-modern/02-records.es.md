# Records (Java 16+)

> Carriers de datos inmutables. Auto-genera constructor, accessors, `equals`, `hashCode`, `toString`. Sin boilerplate.

## Usar cuando

- DTOs.
- Responses / requests de APIs.
- Holders de datos simples.
- Cualquier lugar donde escribirías una "data class".

## Código

```java
record User(String name, int age) {}

var u = new User("Ana", 30);
u.name();   // accessor
u.age();
u.equals(new User("Ana", 30)); // true
```

## Record patterns (Java 21) — destructuring

```java
if (obj instanceof User(String name, int age)) {
    System.out.println(name + " is " + age);
}
```

> **Diferencia:**
> - **Record** → define datos.
> - **Record pattern** → extrae datos.

## Notas

- Implícitamente `final`. No se pueden extender.
- Los componentes son `final` — inmutables por diseño.
- Pueden implementar interfaces, pero no extender otras clases.
- Podés agregar factories estáticas, validación en compact constructors:

```java
record User(String name, int age) {
    public User {
        if (age < 0) throw new IllegalArgumentException();
    }
}
```
