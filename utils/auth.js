export const verifySession = async () => {
  try {
    console.log('[DEBUG] Verifying session with backend...');
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
