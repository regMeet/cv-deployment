# React Hook Form vs Formik

> RHF es el default moderno. Formik es más viejo y más lento. La diferencia se nota en forms grandes.

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

**Fortalezas**

- **Uncontrolled por default** — sin re-render per keystroke. Forms grandes se mantienen snappy.
- Bundle chico.
- Excelente inferencia de TypeScript.
- **Validación schema** de primera (Zod, Yup, Joi vía resolvers).
- Suscripción granular vía `useWatch` — solo re-renderizar donde importa.

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

**Costos**

- Controlled por default → re-renderiza todo el form en cada keystroke.
- Más lento a escala.
- Comunidad más chica / menos momentum últimamente.

## Validación schema con Zod

```jsx
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email(),
  age: z.number().int().min(18),
});

const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });
```

Tipo y validación vienen de una sola fuente. Usá el tipo inferido en otros lados:

```ts
type FormValues = z.infer<typeof schema>;
```

## Cuándo usar `useState` plano

- 1–3 campos simples.
- Sin complejidad de validación.
- Sin lógica de reset / prefil / submit-on-blur.

Más allá de eso, RHF te ahorra más tiempo del que cuesta.

## Encuadre senior

> "I default to React Hook Form for any non-trivial form — it's uncontrolled under the hood, so big forms don't re-render on every keystroke, and it pairs cleanly with Zod for type-safe validation. Formik is fine but slower and feels older. For 1–3 trivial fields I'll use plain `useState`."
