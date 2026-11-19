const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Common fetch helper with error handling and consistent response format.
 */
async function fetchClient(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.message || `Request failed with status ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please ensure the backend is running on port 5000.');
    }
    throw err;
  }
}

export const api = {
  // Fetch profiles demo user hasn't swiped on yet
  getFeed: () => fetchClient('/feed'),

  // Submit a swipe action: 'LIKE' or 'PASS'
  swipe: (profileId, action) =>
    fetchClient('/swipe', {
      method: 'POST',
      body: JSON.stringify({ profileId, action })
    }),

  // Fetch list of mutual matches
  getMatches: () => fetchClient('/matches'),

  // Fetch demo user profile info
  getMe: () => fetchClient('/me'),

  // Reset demo swipes and matches (convenient for testing & demo replays)
  resetDemo: () =>
    fetchClient('/reset', {
      method: 'POST'
    })
};
