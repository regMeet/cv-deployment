# Reglas de los Hooks (y por qué existen)

> Dos reglas. Las dos vienen de cómo React trackea hooks **por orden de llamada**.

## Las reglas

1. **Solo llamar hooks en el top level.**
   No adentro de condicionales, loops o funciones anidadas.

2. **Solo llamar hooks desde funciones React.**
   Componentes funcionales o otros hooks custom. No funciones JS regulares.

## Por qué — orden de llamada

Internamente, React guarda el state de los hooks en un array por componente. Cada render recorre el array **en el mismo orden**:

```js
// pseudo
[useState, useEffect, useMemo]   // render 1
[useState, useEffect, useMemo]   // render 2 — debe coincidir
```

Si saltás un hook condicionalmente, el orden se desplaza → el próximo hook lee el slot equivocado → bugs raros.

## Mal

```jsx
function Foo({ flag }) {
  if (flag) {
    const [x, setX] = useState(0); // 💥 condicional
  }
  const [y, setY] = useState(0);
}
```

## Bien — gateá el *comportamiento*, no la *llamada al hook*

```jsx
function Foo({ flag }) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    if (!flag) return;
    // ...
  }, [flag]);
}
```

## Encuadre senior

> "The rules exist because React tracks hooks by call order. Skipping a hook conditionally would shift the indices and corrupt state. The mental fix is: hooks always run in the same order; gate the *logic* inside, not the call itself."

## Bonus

El `eslint-plugin-react-hooks` (`react-hooks/rules-of-hooks` y `exhaustive-deps`) detecta ambas reglas y errores de dependencias — encendelo como error, no como warning.
