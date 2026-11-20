const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function send(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed with ${res.status}`);
  }
  return data;
}

export const api = {
  getFeed: () => send('/feed'),
  swipe: (profileId, action) => send('/swipe', { method: 'POST', body: JSON.stringify({ profileId, action }) }),
  getMatches: () => send('/matches'),
  getMe: () => send('/me'),
  resetDemo: () => send('/reset', { method: 'POST' })
};
