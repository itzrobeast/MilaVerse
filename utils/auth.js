import Cookies from 'js-cookie';

/**
 * Retrieves the authentication token from cookies.
 * @returns {string | undefined} The authentication token or undefined if not found.
 */
export const getAuthToken = () => {
  const token = Cookies.get('authToken'); // Retrieve the token from cookies
  console.log('[DEBUG] Retrieved Token from Cookies:', token);
  return token;
};
