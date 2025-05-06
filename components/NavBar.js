import React from 'react'; 
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function NavBar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-gray-900 p-4 flex justify-between items-center">
      <Link href="/">
        <span className="text-white font-bold text-xl">ShortsApp</span>
      </Link>
      <div className="space-x-4 flex items-center">
        {session ? (
          <>
            <Link href={`/profile/${session.user.id}`}>
              <span className="text-gray-300 hover:text-white">Profile</span>
            </Link>
            <button
              onClick={() => signOut()}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/auth/signin">
            <span className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
