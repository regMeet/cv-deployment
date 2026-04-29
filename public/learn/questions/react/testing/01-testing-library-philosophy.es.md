# Filosofía de React Testing Library

> "The more your tests resemble the way your software is used, the more confidence they can give you." — Kent C. Dodds

## Idea core

Testear desde la **perspectiva del usuario**, no la implementación. No alcances al state, props o classnames. Encontrá elementos por lo que los usuarios ven (texto, label, role).

## Prioridades de queries (usar en este orden)

1. **Accesibles a todos** — `getByRole`, `getByLabelText`, `getByPlaceholderText`, `getByText`.
2. **Queries semánticas** — `getByAltText`, `getByTitle`.
3. **Test IDs** — `getByTestId`. Último recurso.

Si lo podés encontrar por role, hacelo. `getByTestId` es para casos donde nada más funciona (y eso es un code smell).

## Ejemplo

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('submits email on click', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();

  render(<SignupForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText(/email/i), 'a@b.com');
  await user.click(screen.getByRole('button', { name: /sign up/i }));

  expect(onSubmit).toHaveBeenCalledWith({ email: 'a@b.com' });
});
```

No estás testeando "¿el input tiene valor 'a@b.com'?". Estás testeando el **comportamiento observable**.

## Qué evitar

- **Snapshot tests** para todo — rompen ante cambios cosméticos y no te dicen nada del comportamiento. Usar con moderación.
- **Testear detalles de implementación** — state interno, lifecycle, classnames. Refactor rompe tests, sin bug real.
- **Querear por classname o estructura DOM** — frágil.
- **Confusión con `act()`** — cuando hay duda, usá `await` con `userEvent` y queries `findBy*`. RTL moderno maneja `act` por vos.

## Usar `userEvent` (no `fireEvent`) cuando se pueda

`userEvent` simula interacciones reales (focus, teclado, secuencias hover). `fireEvent` solo dispara un único evento. `userEvent` detecta más bugs.

## Encuadre senior

> "I write tests that look like the user's actions. Find by role and label, drive with `userEvent`, assert on what the user would observe. I avoid testing internal state — refactors shouldn't break tests unless behavior actually changed."
