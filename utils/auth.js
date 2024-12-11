import Cookies from 'js-cookie';

/**
 * Retrieves the authentication token from cookies.
 * @returns {string | undefined} The authentication token or undefined if not found.
 */
export const getAuthToken = () => {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'authToken') {
      return decodeURIComponent(value);
    }
  }
  return null;
};
