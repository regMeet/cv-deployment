# Controlled vs uncontrolled inputs

> **Controlled:** React owns the value. **Uncontrolled:** the DOM owns the value.

## Controlled

```jsx
const [value, setValue] = useState('');
<input value={value} onChange={e => setValue(e.target.value)} />
```

- Single source of truth (React state).
- Easy to validate, transform, mask, debounce.
- Easy to reset, prefill, programmatically change.
- Re-renders on every keystroke (cheap individually; can pile up in big forms).

## Uncontrolled

```jsx
const ref = useRef(null);
<input defaultValue="hello" ref={ref} />

// read on submit
ref.current.value;
```

- DOM owns the value; React doesn't re-render per keystroke.
- Closer to plain HTML semantics.
- Harder to validate / transform mid-typing.
- Easier integration with **non-React libraries** that mutate the DOM.

## When to use which

- **Controlled** by default — most apps need to react to value changes.
- **Uncontrolled** for performance-critical forms with many fields (or use a library that does this for you — see RHF).
- **Uncontrolled** for simple submit-only forms where you only read values on submit.

## File inputs are always uncontrolled

```jsx
<input type="file" ref={ref} />
// ref.current.files
```

You can't set `.value` on a file input from JS for security reasons.

## React Hook Form blends both

RHF uses **uncontrolled inputs by default** (registers via `ref`) but gives you a controlled-feeling API. That's why it's so fast at scale — no per-keystroke re-renders unless you ask for them.

## Senior framing

> "Controlled gives me one source of truth and easy validation; uncontrolled is closer to the DOM and faster for big forms. For real-world forms I use React Hook Form, which is uncontrolled under the hood but gives me a controlled API where I need it."
