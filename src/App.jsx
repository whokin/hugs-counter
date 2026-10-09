import { useEffect, useState } from 'react'
import { load, save } from './storage'

export default function App() {
  const [state, setState] = useState(load)
  const [name, setName] = useState('')

  useEffect(() => save(state), [state])

  const active = state.profiles.find((p) => p.id === state.activeId)

  const addProfile = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    const profile = { id: crypto.randomUUID(), name: trimmed.slice(0, 20), count: 0 }
    setState((s) => ({ ...s, profiles: [...s.profiles, profile], activeId: profile.id }))
    setName('')
  }

  const bump = (delta) =>
    setState((s) => ({
      ...s,
      profiles: s.profiles.map((p) =>
        p.id === s.activeId ? { ...p, count: Math.max(0, p.count + delta) } : p,
      ),
    }))

  const switchTo = (activeId) => setState((s) => ({ ...s, activeId }))

  const remove = (p) => {
    if (!window.confirm(`Delete ${p.name} and their ${p.count} hugs?`)) return
    setState((s) => ({
      ...s,
      profiles: s.profiles.filter((x) => x.id !== p.id),
      activeId: s.activeId === p.id ? null : s.activeId,
    }))
  }

  if (active) {
    return (
      <main className="app">
        <button className="link" onClick={() => switchTo(null)}>← Profiles</button>
        <h1>{active.name}</h1>
        <div className="count" aria-live="polite">{active.count}</div>
        <button className="hug" onClick={() => bump(1)}>🤗 Hug!</button>
        <button className="undo" onClick={() => bump(-1)} disabled={active.count === 0}>−1</button>
      </main>
    )
  }

  return (
    <main className="app">
      <h1>🤗 Hugs Counter</h1>
      <ul className="profiles">
        {state.profiles.map((p) => (
          <li key={p.id}>
            <button className="profile" onClick={() => switchTo(p.id)}>
              {p.name} <span>{p.count}</span>
            </button>
            <button className="link" aria-label={`Delete ${p.name}`} onClick={() => remove(p)}>✕</button>
          </li>
        ))}
      </ul>
      <form onSubmit={addProfile}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New name"
          maxLength={20}
          aria-label="New profile name"
        />
        <button>Add</button>
      </form>
    </main>
  )
}
