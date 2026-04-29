# Accesibilidad esencial en React

> La mayoría de a11y es **solo HTML**. React es output HTML, así que las reglas no cambian. Las piezas *específicas de React* giran alrededor de focus, regiones dinámicas y diálogos.

## Semántica primero

- Usá elementos reales: `<button>`, `<a href>`, `<nav>`, `<main>`, `<form>`, `<label>`. No te armes los tuyos con `<div onClick>`.
- Un `<div onClick>` no es focuseable, no es operable por teclado, no se lee como interactivo por screen readers. O usás un elemento real, o agregás `role`, `tabIndex`, key handlers — momento en el que deberías haber usado el elemento.

## Labels de form

```jsx
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

O wrappear:

```jsx
<label>
  Email
  <input type="email" />
</label>
```

`useId()` te da IDs estables entre SSR.

## Focus management

- Mover focus al **primer elemento focuseable** cuando un diálogo abre.
- Restaurar focus al **trigger** cuando el diálogo cierra.
- Atrapar focus dentro de modales (o usar Radix / Headless UI que lo maneja).
- Después de cambios de ruta en una SPA, **anunciá** y mové el focus al contenido nuevo.

## Navegación por teclado

- Cada elemento interactivo debe ser operable por teclado.
- **Focus rings visibles** — no `outline: none` sin reemplazar.
- Atajos estándar: Esc para cerrar diálogos, Enter / Space para activar botones.

## ARIA — solo cuando es necesario

> "La primera regla de ARIA es: no uses ARIA."

Si un elemento real hace el trabajo, usalo. ARIA llena gaps cuando no hay un elemento HTML semántico para lo que estás construyendo (ej: listbox custom).

Atributos comunes útiles:

- `aria-label`, `aria-labelledby`, `aria-describedby`
- `aria-live="polite"` para updates dinámicos no urgentes (toasts, status).
- `aria-expanded`, `aria-controls` para disclosures.
- `aria-invalid` + `aria-describedby` linkeando a mensajes de error.

## Live regions para updates async

Cuando los datos refrescan o aparece un toast, los screen readers no se enteran a menos que lo pongas en una live region:

```jsx
<div aria-live="polite" aria-atomic="true">
  {message}
</div>
```

## Usar una librería de primitivos

No reinventes diálogos, menús, comboboxes. Usá **Radix UI** o **Headless UI** — manejan focus management, ARIA, interacciones de teclado correctamente. Wrappealos con tu styling.

## Tooling

- **eslint-plugin-jsx-a11y** — detecta issues de a11y en JSX en build time.
- **axe DevTools** — audits manuales / automatizados de a11y.
- **Storybook** tiene un addon de a11y.

## Encuadre senior

> "Most a11y is just using the right HTML element. The React-specific pieces are focus management on dialogs and route changes, and live regions for async updates. For complex widgets I lean on Radix or Headless UI — they're correct out of the box and save a lot of mistakes."
