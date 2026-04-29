# Accessibility essentials in React

> Most a11y is **just HTML**. React is HTML output, so the rules don't change. The pieces that *are* React-specific revolve around focus, dynamic regions, and dialogs.

## Semantics first

- Use real elements: `<button>`, `<a href>`, `<nav>`, `<main>`, `<form>`, `<label>`. Don't roll your own with `<div onClick>`.
- A `<div onClick>` isn't focusable, isn't keyboard-operable, isn't read as interactive by screen readers. Either use a real element or add `role`, `tabIndex`, key handlers — at which point you should've just used the element.

## Form labels

```jsx
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

Or wrap:

```jsx
<label>
  Email
  <input type="email" />
</label>
```

`useId()` gives you stable IDs across SSR.

## Focus management

- Move focus to the **first focusable element** when a dialog opens.
- Restore focus to the **trigger** when the dialog closes.
- Trap focus inside modals (or use Radix / Headless UI which handles this).
- After route changes in a SPA, **announce** and move focus to the new content.

## Keyboard navigation

- Every interactive element must be keyboard-operable.
- Visible **focus rings** — don't `outline: none` without replacing.
- Standard shortcuts: Esc to close dialogs, Enter / Space to activate buttons.

## ARIA — only when necessary

> "The first rule of ARIA is: don't use ARIA."

If a real element does the job, use it. ARIA fills gaps when there's no semantic HTML element for what you're building (e.g., custom listbox).

Common helpful attributes:

- `aria-label`, `aria-labelledby`, `aria-describedby`
- `aria-live="polite"` for non-urgent dynamic updates (toasts, status).
- `aria-expanded`, `aria-controls` for disclosures.
- `aria-invalid` + `aria-describedby` linking to error messages.

## Live regions for async updates

When data refreshes or a toast appears, screen readers won't notice unless you put it in a live region:

```jsx
<div aria-live="polite" aria-atomic="true">
  {message}
</div>
```

## Use a primitive library

Don't reinvent dialogs, menus, comboboxes. Use **Radix UI** or **Headless UI** — they handle focus management, ARIA, keyboard interactions correctly. Wrap with your styling.

## Tooling

- **eslint-plugin-jsx-a11y** — catches a11y issues in JSX at build time.
- **axe DevTools** — manual / automated a11y audits.
- **Storybook** has an a11y addon.

## Senior framing

> "Most a11y is just using the right HTML element. The React-specific pieces are focus management on dialogs and route changes, and live regions for async updates. For complex widgets I lean on Radix or Headless UI — they're correct out of the box and save a lot of mistakes."
