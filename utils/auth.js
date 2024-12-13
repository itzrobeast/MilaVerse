/**
 * Verifies the Facebook session using the provided access token.
 * @param {string} accessToken - The Facebook access token.
 * @returns {Object | null} - The validated token data or null if invalid.
 */
export const verifySession = async (accessToken) => {
  try {
    console.log('[DEBUG] Verifying Facebook access token:', accessToken);
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    const response = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}|${process.env.NEXT_PUBLIC_FACEBOOK_APP_SECRET}`
    );

    if (!response.ok) {
      throw new Error(`Facebook token validation failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[DEBUG] Facebook Token Verified:', data);
    return data.data; // Return validated token data
  } catch (error) {
    console.error('[ERROR] Verifying Facebook session failed:', error.message);
    return null;
  }
};
