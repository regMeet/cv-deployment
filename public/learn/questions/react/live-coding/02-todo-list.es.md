# Lista de tareas (agregar / toggle / quitar)

> Pone a prueba disciplina de inmutabilidad + manejo de keys. La mitad de los candidatos mutan el estado.

## Problema

Hacé una lista de tareas:
- Input + botón Agregar
- Mostrar items con checkbox para marcar como hechos
- Botón quitar por item
- Usar un `key` estable y único

## Solución

```jsx
import { useState } from 'react';

export function TodoList() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  function add() {
    const t = text.trim();
    if (!t) return;
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text: t, done: false }]);
    setText('');
  }

  function toggle(id) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function remove(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div>
      <form onSubmit={(e) => { e.preventDefault(); add(); }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="¿Qué hay que hacer?" />
        <button type="submit">Agregar</button>
      </form>
      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <label>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
              <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
            </label>
            <button onClick={() => remove(t.id)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Qué miran los entrevistadores

- **`key={t.id}` y no `key={index}`.** Las keys por índice rompen si reordenás o sacás del medio.
- **Inmutabilidad.** `prev.map(...)`, `prev.filter(...)`, `[...prev, x]`. Nunca `prev.push` ni `t.done = !t.done`.
- **Submit handler del form** con `e.preventDefault()` para que funcione Enter.
- **Trim + guard de vacío** antes de agregar.

## Follow-ups comunes

- **"Persistilo en localStorage."** Envolvelo en un `useLocalStorage` (ver esa pregunta).
- **"Agregá filtros (todas / activas / hechas)."** Subí el estado del filtro y derivá `visible = todos.filter(...)`.
- **"Editar en el lugar."** Agregá un `editingId` + swap a un input controlado.
