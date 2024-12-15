const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Wrapper function to make API requests with error handling.
 * @param {string} endpoint - The API endpoint (e.g., "/auth/login").
 * @param {Object} options - Fetch options (method, headers, body, etc.).
 * @returns {Promise<Object>} - Returns JSON response or throws an error.
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const defaultHeaders = { 'Content-Type': 'application/json' };

  try {
    console.log(`[DEBUG] API Fetch - URL: ${url}, Method: ${options.method || 'GET'}`);

    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Ensures cookies are sent with the request
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(
        `[ERROR] API Fetch Failed: ${response.status} ${response.statusText} - ${JSON.stringify(data)}`
      );
      throw new Error(data.error || response.statusText || 'API Error');
    }

    console.log(`[DEBUG] API Fetch Successful: ${url}`);
    return data;
  } catch (error) {
    console.error('[ERROR] API Fetch Error:', error.message || error);
    throw error;
  }
}
