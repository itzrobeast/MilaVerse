export async function apiFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  console.log('[DEBUG] Fetch URL:', url);
  console.log('[DEBUG] Request Options:', options);

  const defaultHeaders = { 'Content-Type': 'application/json' };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
}
