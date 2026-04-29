# Accordion (compound components)

> Pone a prueba **compound components** con Context — el patrón production-grade para APIs flexibles.

## Problema

Hacé un accordion donde el consumer compone:

```jsx
<Accordion defaultOpen="b">
  <Accordion.Item id="a">
    <Accordion.Header>Uno</Accordion.Header>
    <Accordion.Panel>Contenido A</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item id="b">
    <Accordion.Header>Dos</Accordion.Header>
    <Accordion.Panel>Contenido B</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

Modo single-open (clickear otro cierra el anterior).

## Solución

```jsx
import { createContext, useContext, useState } from 'react';

const AccordionCtx = createContext(null);
const ItemCtx = createContext(null);

export function Accordion({ defaultOpen = null, children }) {
  const [openId, setOpenId] = useState(defaultOpen);
  const toggle = (id) => setOpenId((cur) => (cur === id ? null : id));
  return (
    <AccordionCtx.Provider value={{ openId, toggle }}>
      <div className="accordion">{children}</div>
    </AccordionCtx.Provider>
  );
}

function Item({ id, children }) {
  const { openId } = useContext(AccordionCtx);
  return (
    <ItemCtx.Provider value={{ id, isOpen: openId === id }}>
      <div className="accordion-item">{children}</div>
    </ItemCtx.Provider>
  );
}

function Header({ children }) {
  const { id, isOpen } = useContext(ItemCtx);
  const { toggle } = useContext(AccordionCtx);
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls={`panel-${id}`}
      id={`header-${id}`}
      onClick={() => toggle(id)}
    >
      {children}
    </button>
  );
}

function Panel({ children }) {
  const { id, isOpen } = useContext(ItemCtx);
  return (
    <div
      id={`panel-${id}`}
      role="region"
      aria-labelledby={`header-${id}`}
      hidden={!isOpen}
    >
      {children}
    </div>
  );
}

Accordion.Item = Item;
Accordion.Header = Header;
Accordion.Panel = Panel;
```

## Por qué compound y no props

La API naïve:

```jsx
<Accordion items={[{ title: 'Uno', content: <X /> }, ...]} />
```

Te obliga a inventar una prop por cada customización (íconos en el header, subtítulo, padding custom…). Los compound components dejan al consumer componer libremente mientras vos mantenés una única fuente de verdad en Context.

## Qué demuestra

- **Dos contexts** — el de afuera para el accordion (cuál está abierto), el de adentro para el item actual (su id + open state). Evita prop-drilling de `id` a Header/Panel.
- **`aria-expanded`, `aria-controls`, `aria-labelledby`** — cableado a11y correcto sin pensarlo de nuevo.
- **Propiedades estáticas** (`Accordion.Item`) — una forma idiomática de namespace-ar la API.

## Follow-ups

- **"Multi-open."** Reemplazá `openId` por un `Set<string>`. `toggle(id)` agrega/saca.
- **"Animá el panel al abrir."** `hidden` → CSS `max-height` + `transition`. O usá `AnimatePresence` de Framer Motion.
- **"Modo controlado."** Aceptá `openId` + `onOpenChange` como props además de `defaultOpen`.
