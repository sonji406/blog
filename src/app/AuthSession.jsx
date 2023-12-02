'use client';

import { Navbar } from '@src/components/Navbar';
import { SideNavbar } from '@src/components/SideNavbar/SideNavbar';
import { SessionProvider } from 'next-auth/react';

function AuthSession({ children }) {
  return (
    <SessionProvider>
      <Navbar />
      <div className='w-[1280px] mx-auto'>
        <SideNavbar />
        {children}
      </div>
    </SessionProvider>
  );
}

export { AuthSession };
