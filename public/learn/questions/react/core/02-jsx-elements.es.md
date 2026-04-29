# JSX y React elements

> JSX es **syntax sugar** para `React.createElement`. Lo que fluye por React no es HTML — es un árbol de objetos planos.

## A qué compila JSX

```jsx
const el = <div className="card">Hello</div>;
```

Compila a:

```js
const el = React.createElement('div', { className: 'card' }, 'Hello');
// → { type: 'div', props: { className: 'card', children: 'Hello' }, ... }
```

(El JSX transform moderno usa `jsx`/`jsxs` de `react/jsx-runtime`, misma idea.)

## Qué es ese objeto

Un **React element** — descripción liviana e inmutable de qué debería aparecer en pantalla. No es el DOM. No es una instancia de componente.

## Componentes vs elements

- Un **componente** es una función (o clase) que devuelve elements.
- Un **element** es un objeto describiendo un componente (o nodo del host).

```jsx
function Greet({ name }) { return <h1>Hi {name}</h1>; }

<Greet name="Ana" />
// element: { type: Greet, props: { name: 'Ana' } }
```

React llama a `Greet` durante la reconciliación para expandirlo en más elements.

## Takeaways senior

- JSX no son templates — son expresiones. Cualquier cosa entre `{}` es JS real.
- `<Foo />` (F mayúscula) → componente; `<foo />` → element del host (tag DOM).
- `key` y `ref` son **especiales** — no se forwardean a tu componente como props.
- `children` es solo una prop. Podés pasar cualquier React node, incluyendo funciones (render-props).

## Por qué importa

Entender que los componentes devuelven datos (elements), no DOM, hace clickear por qué:

- React puede re-correr un componente barato (es solo una función).
- El renderizado condicional es solo JavaScript (`cond && <X />`).
- La composición funciona — podés pasar elements de un lado para el otro.
