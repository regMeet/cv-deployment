# Inputs controlled vs uncontrolled

> **Controlled:** React es dueño del valor. **Uncontrolled:** el DOM es dueño del valor.

## Controlled

```jsx
const [value, setValue] = useState('');
<input value={value} onChange={e => setValue(e.target.value)} />
```

- Single source of truth (state de React).
- Fácil de validar, transformar, mascarear, debouncear.
- Fácil de resetear, prefilear, cambiar programáticamente.
- Re-renderiza en cada keystroke (barato individualmente; puede acumular en forms grandes).

## Uncontrolled

```jsx
const ref = useRef(null);
<input defaultValue="hello" ref={ref} />

// leer al submit
ref.current.value;
```

- El DOM es dueño del valor; React no re-renderiza per keystroke.
- Más cerca de la semántica HTML pura.
- Más difícil de validar / transformar mientras tipean.
- Integración más fácil con **librerías no-React** que mutan el DOM.

## Cuándo usar cada uno

- **Controlled** por default — la mayoría de las apps necesitan reaccionar a cambios de valor.
- **Uncontrolled** para forms con muchos campos donde la performance importa (o usar una librería que lo hace por vos — ver RHF).
- **Uncontrolled** para forms simples submit-only donde solo leés valores al submit.

## File inputs siempre son uncontrolled

```jsx
<input type="file" ref={ref} />
// ref.current.files
```

No podés setear `.value` a un input de archivo desde JS por razones de seguridad.

## React Hook Form combina ambos

RHF usa **inputs uncontrolled por default** (registra vía `ref`) pero te da una API que se siente controlled. Por eso es tan rápido a escala — sin re-renders per keystroke a menos que lo pidas.

## Encuadre senior

> "Controlled gives me one source of truth and easy validation; uncontrolled is closer to the DOM and faster for big forms. For real-world forms I use React Hook Form, which is uncontrolled under the hood but gives me a controlled API where I need it."
