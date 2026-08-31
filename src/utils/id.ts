// GradeTrack Pro — ID Generator
// Lightweight, dependency-free unique ID generator for local records.
// Not cryptographically secure — doesn't need to be, this is only
// ever used as a local primary key inside the user's own device storage.

export function generateId(prefix = 'id'): string {
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${time}_${rand}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}
