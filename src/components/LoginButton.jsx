'use client';

import { signIn } from 'next-auth/react';

function LoginButton({ loginCompany }) {
  const callbackUrl = process.env.NEXT_PUBLIC_DOMAIN;
  const handleSignIn = () => signIn(loginCompany, { callbackUrl });

  return (
    <div>
      <button
        onClick={handleSignIn}
        className='text-xl text-white font-bold bg-[#6B99C3] rounded-lg hover:bg-[#16354D] py-2 px-8'
      >
        google login
      </button>
    </div>
  );
}

export { LoginButton };
