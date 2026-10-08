// Works whether BASE_PATH is set with or without a trailing slash
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function mediaUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${BASE}/storage/${path.replace(/^\//, '')}`;
}
