// components/SignOutButton.tsx
'use client';
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  const handleSignOut = () => {
    signOut({
      callbackUrl: "/login",
      redirect: true,
    });
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
    >
      Sign Out
    </button>
  );
}