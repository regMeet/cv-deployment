# Modal with createPortal (esc + outside click)

> Tests **portals**, focus management, and event lifecycle.

## Problem

Build a modal that:
- Renders into `document.body` (escapes overflow:hidden ancestors)
- Closes on **Esc**
- Closes on **outside click**
- Returns focus to the trigger after closing

## Solution

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
        onClick={(e) => e.stopPropagation()} // don't close when clicking inside
        style={{ background: 'white', padding: 20, borderRadius: 8, minWidth: 320 }}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
```

## Usage

```jsx
function App() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <h2 id="modal-title">Confirm</h2>
        <p>Are you sure?</p>
        <button onClick={() => setOpen(false)}>OK</button>
      </Modal>
    </>
  );
}
```

## What this demonstrates

- **`createPortal`** — children render into `document.body` so the modal isn't trapped by ancestor `overflow: hidden` or stacking context.
- **`onClick` on backdrop + `stopPropagation` on dialog** — outside-click closes, inside-click doesn't.
- **`Escape` listener on `document`** — captures regardless of focus.
- **Focus trap (basic)** — focus the dialog on open, restore previous focus on close.
- **`role="dialog"` + `aria-modal="true"`** — screen readers know it's modal.

## What you'd add for production

- **Real focus trap** — Tab cycles inside the dialog. Use `focus-trap-react` or roll your own with `tabbable`.
- **Scroll lock** on `<body>` while open.
- **Multiple modals** — z-index management, esc closes only the top one.
- For real apps, just use **Radix Dialog** or HeadlessUI. Building this from scratch in production is a footgun.
