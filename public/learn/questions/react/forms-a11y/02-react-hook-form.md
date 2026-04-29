# React Hook Form vs Formik

> RHF is the modern default. Formik is older and slower. The difference shows up in big forms.

## React Hook Form (RHF)

```jsx
import { useForm } from 'react-hook-form';

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <input {...register('email', { required: 'Required' })} />
      {errors.email && <span>{errors.email.message}</span>}
      <input {...register('password', { minLength: 8 })} />
      <button type="submit">Sign up</button>
    </form>
  );
}
```

**Strengths**

- **Uncontrolled by default** — no re-render per keystroke. Big forms stay snappy.
- Tiny bundle.
- Excellent TypeScript inference.
- First-class **schema validation** (Zod, Yup, Joi via resolvers).
- Granular subscription via `useWatch` — only re-render where it matters.

## Formik

```jsx
<Formik initialValues={...} onSubmit={...}>
  {({ values, errors, handleChange }) => (
    <Form>
      <Field name="email" />
      <ErrorMessage name="email" />
    </Form>
  )}
</Formik>
```

**Costs**

- Controlled by default → re-renders the whole form on every keystroke.
- Slower at scale.
- Smaller community / less momentum lately.

## Schema validation with Zod

```jsx
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email(),
  age: z.number().int().min(18),
});

const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });
```

Type and validation come from one source. Use the inferred type elsewhere:

```ts
type FormValues = z.infer<typeof schema>;
```

## When to use plain `useState`

- 1–3 simple fields.
- No validation complexity.
- No reset / prefill / submit-on-blur logic.

Beyond that, RHF saves more time than it costs.

## Senior framing

> "I default to React Hook Form for any non-trivial form — it's uncontrolled under the hood, so big forms don't re-render on every keystroke, and it pairs cleanly with Zod for type-safe validation. Formik is fine but slower and feels older. For 1–3 trivial fields I'll use plain `useState`."
