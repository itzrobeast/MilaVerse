import Cookies from 'js-cookie';


export const verifySession = async () => {
  try {
    console.log('[DEBUG] Verifying session with backend...');

    // Check if cookies are present
    const authToken = Cookies.get('authToken');
    const userId = Cookies.get('userId');

    if (!authToken || !userId) {
      throw new Error('Missing authentication cookies. Please log in again.');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Send cookies with request
    });

    if (!response.ok) {
      throw new Error(`Session verification failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[DEBUG] Session verified successfully:', data.user);

    return data.user; // Return user object
  } catch (error) {
    console.error('[ERROR] Session verification failed:', error.message);
    return null;
  }
};
