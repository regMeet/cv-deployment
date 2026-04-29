# React Testing Library philosophy

> "The more your tests resemble the way your software is used, the more confidence they can give you." — Kent C. Dodds

## Core idea

Test from the **user's perspective**, not the implementation. Don't reach into state, props, or class names. Find elements by what users see (text, label, role).

## Query priorities (use them in this order)

1. **Accessible to everyone** — `getByRole`, `getByLabelText`, `getByPlaceholderText`, `getByText`.
2. **Semantic queries** — `getByAltText`, `getByTitle`.
3. **Test IDs** — `getByTestId`. Last resort.

If you can find it by role, do that. `getByTestId` is for cases where nothing else works (and that's a code smell).

## Example

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

You're not testing "does the input have value 'a@b.com'?". You're testing the **observable behavior**.

## What to avoid

- **Snapshot tests** for everything — they break on cosmetic changes and tell you nothing about behavior. Use sparingly.
- **Testing implementation details** — internal state, lifecycle, classnames. Refactor breaks tests, no real bug.
- **Querying by classname or DOM structure** — fragile.
- **`act()` confusion** — when in doubt, use `await` with `userEvent` and `findBy*` queries. Modern RTL handles `act` for you.

## Use `userEvent` (not `fireEvent`) where possible

`userEvent` simulates real interactions (focus, keyboard, hover sequences). `fireEvent` just dispatches a single event. `userEvent` catches more bugs.

## Senior framing

> "I write tests that look like the user's actions. Find by role and label, drive with `userEvent`, assert on what the user would observe. I avoid testing internal state — refactors shouldn't break tests unless behavior actually changed."
