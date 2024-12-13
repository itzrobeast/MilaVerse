
/**
 * Verifies the session using the Facebook access token.
 * @returns {Object | null} The user object if session is valid, or null otherwise.
 */
export const verifySession = async () => {
  try {
    // Retrieve Facebook access token from localStorage
    const facebookAccessToken = localStorage.getItem('facebookAccessToken');
    if (!facebookAccessToken) {
      console.error('[ERROR] No Facebook access token found');
      return null; // No user session
    }

    // Validate token with Facebook's Graph API
    const response = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${facebookAccessToken}&access_token=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}|${process.env.NEXT_PUBLIC_FACEBOOK_APP_SECRET}`
    );

    if (!response.ok) {
      throw new Error(`Facebook token validation failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data || !data.data || !data.data.is_valid) {
      console.error('[ERROR] Facebook token is invalid or expired');
      return null; // Invalid session
    }

    console.log('[DEBUG] Facebook Token Verified:', data.data);

    // If token is valid, return user information
    return {
      fb_id: data.data.user_id,
      scopes: data.data.scopes,
    };
  } catch (error) {
    console.error('[ERROR] Verifying Facebook session:', error.message);
    return null; // Handle invalid or expired session
  }
};
