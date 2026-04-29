# Accordion (compound components)

> Tests **compound components** with Context — the production-grade pattern for flexible APIs.

## Problem

Build an accordion where the consumer composes:

```jsx
<Accordion defaultOpen="b">
  <Accordion.Item id="a">
    <Accordion.Header>One</Accordion.Header>
    <Accordion.Panel>Content A</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item id="b">
    <Accordion.Header>Two</Accordion.Header>
    <Accordion.Panel>Content B</Accordion.Panel>
  </Accordion.Item>
</Accordion>
```

Single-open mode (clicking another closes the previous).

## Solution

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

## Why compound, not props

The naïve API:

```jsx
<Accordion items={[{ title: 'One', content: <X /> }, ...]} />
```

Forces you to invent a prop for every customization (title icons, header subtitle, custom panel padding…). Compound components let the consumer compose freely while you keep a single source of truth in Context.

## What this demonstrates

- **Two contexts** — outer for the accordion (which is open), inner for the current item (its id + open state). Avoids prop-drilling `id` into Header/Panel.
- **`aria-expanded`, `aria-controls`, `aria-labelledby`** — proper a11y wiring without thinking about it again.
- **Static properties** (`Accordion.Item`) — an idiomatic way to namespace the API.

## Follow-ups

- **"Multi-open."** Replace `openId` with a `Set<string>`. `toggle(id)` adds/removes.
- **"Animate panel open."** `hidden` → CSS `max-height` + `transition`. Or use Framer Motion's `AnimatePresence`.
- **"Controlled mode."** Accept `openId` + `onOpenChange` as props alongside `defaultOpen`.
