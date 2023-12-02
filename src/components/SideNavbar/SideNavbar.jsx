'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ProfileBox } from '@src/components/SideNavbar/ProfileBox';
import { BurgerMenu } from './BurgerMenu';
import axios from 'axios';
import { usePathname } from 'next/navigation';
import { ERRORS } from 'constants/errors';

function SideNavbar() {
  const { data } = useSession();
  const pathname = usePathname();
  const userId = data?.mongoId;

  const [profile, setProfile] = useState([]);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      const profileData = async () => {
        try {
          const response = await axios.get(`/api/v1/profile/${userId}`);

          if (response.data.status !== 200) {
            setError(response.data.message);
            return;
          }

          setProfile(response.data.data);
        } catch (e) {
          setError(ERRORS.PROFILE_LOADING_ERROR);
        }
      };

      profileData();
    }
  }, [userId]);

  return (
    pathname.startsWith('/profile') || (
      <div className='relative z-10'>
        <label
          className='fixed top-8 left-4 z-10 bg-[#6B99C3] hover:bg-[#16354D] p-3 cursor-pointer mt-[45px] border-4 border-white border-inherit rounded-full'
          title='menu'
          onMouseEnter={() => setIsOpen(true)}
        >
          <BurgerMenu isOpen={isOpen} />
        </label>

        <div>
          <nav
            className={`fixed top-0 left-0 h-full w-64 bg-gray-100 transform shadow-2xl shadow-gray-800 flex flex-col items-center ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-500`}
            onMouseLeave={() => setIsOpen(false)}
          >
            <ProfileBox profile={profile} error={error} />
          </nav>
        </div>
      </div>
    )
  );
}

export { SideNavbar };
