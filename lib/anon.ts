export function getOrCreateAnonId() {
  try {
    const key = "alphabot_anon_id";
    const existing = window.localStorage.getItem(key);
    if (existing && existing.trim()) return existing;
    const created =
      (globalThis.crypto?.randomUUID?.() ?? `anon_${Date.now()}_${Math.random()}`)
        .toString()
        .replace(/\s+/g, "");
    window.localStorage.setItem(key, created);
    return created;
  } catch {
    return null;
  }
}

