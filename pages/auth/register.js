import React from 'react'; 
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
  const [error, setError] = useState(null);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const body = {
      username: e.target.username.value,
      password: e.target.password.value,
    };

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push('/auth/signin');
    } else {
      const data = await res.json();
      setError(data.error || 'Error creating account');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded w-full max-w-sm">
        <h1 className="text-2xl text-white mb-6 text-center font-bold">Register</h1>
        {error && <p className="bg-red-500 p-2 mb-4 text-center rounded">{error}</p>}
        <input name="username" type="text" placeholder="Username" className="w-full p-2 mb-4 rounded bg-gray-700 text-white" required />
        <input name="password" type="password" placeholder="Password" className="w-full p-2 mb-4 rounded bg-gray-700 text-white" required minLength={6} />
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded">Register</button>
        <p className="text-center mt-4 text-gray-400">Have an account? <a href="/auth/signin" className="text-blue-500 underline">Sign In</a></p>
      </form>
    </div>
  );
}
