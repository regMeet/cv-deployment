# Modal con createPortal (esc + clic fuera)

> Pone a prueba **portals**, manejo de focus, y ciclo de vida de eventos.

## Problema

Hacé un modal que:
- Renderice en `document.body` (escapa de ancestros con overflow:hidden)
- Cierre con **Esc**
- Cierre con clic afuera
- Devuelva el focus al trigger después de cerrarse

## Solución

```jsx
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export function Modal({ open, onClose, children, labelledBy = 'modal-title' }) {
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement;
    dialogRef.current?.focus();

    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      onClick={onClose} // backdrop
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center' }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()} // no cerrar si clickean adentro
        style={{ background: 'white', padding: 20, borderRadius: 8, minWidth: 320 }}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
```

## Uso

```jsx
function App() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Abrir</button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <h2 id="modal-title">Confirmar</h2>
        <p>¿Estás seguro?</p>
        <button onClick={() => setOpen(false)}>OK</button>
      </Modal>
    </>
  );
}
```

## Qué demuestra

- **`createPortal`** — los children renderizan en `document.body` así el modal no queda trabado por `overflow: hidden` o stacking context de algún ancestro.
- **`onClick` en backdrop + `stopPropagation` en dialog** — clic afuera cierra, clic adentro no.
- **Listener de `Escape` en `document`** — captura independientemente del focus.
- **Focus trap (básico)** — enfoca el dialog al abrir, restaura el focus previo al cerrar.
- **`role="dialog"` + `aria-modal="true"`** — los screen readers saben que es modal.

## Qué agregarías para producción

- **Focus trap real** — Tab cicla adentro del dialog. Usá `focus-trap-react` o armalo con `tabbable`.
- **Scroll lock** del `<body>` mientras está abierto.
- **Múltiples modales** — manejo de z-index, esc cierra sólo el de arriba.
- En apps reales, usá **Radix Dialog** o HeadlessUI. Construir esto desde cero en producción es un footgun.
