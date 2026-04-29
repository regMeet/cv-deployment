# Records (Java 16+)

> Immutable data carriers. Auto-generates constructor, accessors, `equals`, `hashCode`, `toString`. No boilerplate.

## Use when

- DTOs.
- API responses / requests.
- Simple data holders.
- Anywhere you'd write a "data class".

## Code

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

> **Difference:**
> - **Record** → defines data.
> - **Record pattern** → extracts data.

## Notes

- Implicitly `final`. Cannot be extended.
- Components are `final` — immutable by design.
- Can implement interfaces, but cannot extend other classes.
- You can add static factories, validation in compact constructors:

```java
record User(String name, int age) {
    public User {
        if (age < 0) throw new IllegalArgumentException();
    }
}
```
