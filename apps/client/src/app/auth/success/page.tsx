'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // Save JWT for later API calls (optional if using cookies)
      localStorage.setItem('jwt', token);
    }

    // Redirect to homepage after short delay
    const timeout = setTimeout(() => {
      router.push('/');
    }, 1000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
      }}
    >
      <h2>✅ Logged in successfully!</h2>
      <p>Redirecting to home...</p>
    </div>
  );
}
