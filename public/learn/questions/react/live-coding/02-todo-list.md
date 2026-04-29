# Todo list (add / toggle / remove)

> Tests immutability discipline + key handling. Half of candidates mutate state.

## Problem

Build a todo list:
- Input + Add button
- Show items with a checkbox to toggle done
- Remove button per item
- Use a stable, unique `key`

## Solution

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
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="What needs doing?" />
        <button type="submit">Add</button>
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

## What interviewers watch for

- **`key={t.id}` not `key={index}`.** Index keys break if you re-order or remove from the middle.
- **Immutability.** `prev.map(...)`, `prev.filter(...)`, `[...prev, x]`. Never `prev.push` or `t.done = !t.done`.
- **Form submit handler** with `e.preventDefault()` so Enter works.
- **Trim + empty guard** before adding.

## Common follow-ups

- **"Persist to localStorage."** Wrap in a `useLocalStorage` hook (see that question).
- **"Add filtering (all / active / done)."** Lift filter state, derive `visible = todos.filter(...)`.
- **"Edit in place."** Add an `editingId` + a controlled input swap.
