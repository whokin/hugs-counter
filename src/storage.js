// All persistence lives here so swapping localStorage for a backend later is one file.
const KEY = 'hugs-counter'
const VERSION = 1

const empty = () => ({ version: VERSION, profiles: [], activeId: null })

// Keep only well-formed profiles; anything else in saved data is dropped.
function validate(data) {
  if (!data || typeof data !== 'object' || !Array.isArray(data.profiles)) return empty()
  const profiles = data.profiles
    .filter(
      (p) =>
        p &&
        typeof p.id === 'string' &&
        typeof p.name === 'string' &&
        p.name.trim() &&
        Number.isFinite(p.count),
    )
    .map((p) => ({ id: p.id, name: p.name.trim().slice(0, 20), count: Math.max(0, Math.floor(p.count)) }))
  const activeId = profiles.some((p) => p.id === data.activeId) ? data.activeId : null
  return { version: VERSION, profiles, activeId }
}

export function load() {
  try {
    return validate(JSON.parse(localStorage.getItem(KEY)))
  } catch {
    return empty()
  }
}

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // storage full or blocked (private mode): the app keeps working, just unsaved
  }
}
