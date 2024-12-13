/**
 * Verifies the session using the Facebook access token.
 * @returns {Object | null} The user object if the session is valid, or null otherwise.
 */
export const verifySession = async () => {
  try {
    // Retrieve Facebook access token from localStorage
    const facebookAccessToken = localStorage.getItem('facebookAccessToken');
    if (!facebookAccessToken) {
      console.error('[ERROR] No Facebook access token found in localStorage.');
      return null; // No user session
    }

    console.log('[DEBUG] Verifying Facebook access token...');

    // Validate token with Facebook's Graph API
    const response = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${facebookAccessToken}&access_token=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}|${process.env.NEXT_PUBLIC_FACEBOOK_APP_SECRET}`
    );

    if (!response.ok) {
      throw new Error(`Facebook token validation failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[DEBUG] Facebook token validation response:', data);

    // Check if the token is valid
    if (!data || !data.data || !data.data.is_valid) {
      console.error('[ERROR] Facebook token is invalid or expired.');
      return null; // Invalid session
    }

    console.log('[DEBUG] Facebook Token Verified Successfully:', data.data);

    // Return user information if the session is valid
    return {
      fb_id: data.data.user_id,
      scopes: data.data.scopes,
    };
  } catch (error) {
    console.error('[ERROR] Verifying Facebook session failed:', error.message);
    return null; // Handle invalid or expired session
  }
};
