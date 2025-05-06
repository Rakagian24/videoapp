import React from 'react'; 
import { getCsrfToken, signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignIn({ csrfToken }) {
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const res = await signIn('credentials', {
      redirect: false,
      username: e.target.username.value,
      password: e.target.password.value,
    });

    if (res.error) {
      setError(res.error);
    } else {
      window.location.href = '/';
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded w-full max-w-sm">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <h1 className="text-2xl text-white mb-6 text-center font-bold">Sign In</h1>
        {error && <p className="bg-red-500 p-2 mb-4 text-center rounded">{error}</p>}
        <input name="username" type="text" placeholder="Username" className="w-full p-2 mb-4 rounded bg-gray-700 text-white" required />
        <input name="password" type="password" placeholder="Password" className="w-full p-2 mb-4 rounded bg-gray-700 text-white" required />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">Sign In</button>
        <p className="text-center mt-4 text-gray-400">No account? <a href="/auth/register" className="text-blue-500 underline">Register</a></p>
      </form>
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    }
  }
}
