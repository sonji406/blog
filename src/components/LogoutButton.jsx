'use client';

import { signOut } from 'next-auth/react';

function LogoutButton() {
  const handleSignOut = () => signOut();

  return (
    <>
      <button
        className="font-['DiaGothicBold'] text-[#6B99C3] text-xl py-1 px-2 rounded-full hover:bg-white hover:text-[#16354D] mb-0.5"
        onClick={handleSignOut}
      >
        Logout
      </button>
    </>
  );
}

export { LogoutButton };
