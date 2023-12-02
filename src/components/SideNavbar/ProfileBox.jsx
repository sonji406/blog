'use client';

import Image from 'next/legacy/image';
import Link from 'next/link';

function ProfileBox({ profile, error }) {
  const userId = profile._id;
  const profileImage = profile.profileImage;
  const nickname = profile.nickname;

  return (
    <>
      <div className='mt-[130px]'>
        <div className='text-center'>
          <div className='rounded-full bg-white p-3 shadow-[0_0_10px_5px rgba(0, 0, 0, 0.3)]'>
            <div className='rounded-full bg-white w-48 h-48 flex flex-col items-center justify-center relative overflow-hidden'>
              {error ? (
                <p className='text-red'>{error}</p>
              ) : profileImage ? (
                <Image
                  src={profileImage}
                  alt='프로필 사진'
                  layout='fill'
                  priority
                />
              ) : (
                <Link href={'/auth/login'}>
                  <button className='font-bold hover:text-[#0044ff]'>
                    로그인을 해주세요.
                  </button>
                </Link>
              )}
            </div>
          </div>
          {userId && (
            <>
              <div className="mt-5 mb-5 font-['DiaGothicBold']">
                <strong>{nickname}</strong>
              </div>
              <Link href={`/profile/${userId}`}>
                <button className='text-base text-blue-500 font-bold hover:text-[#0044ff] py-2 px-4'>
                  프로필 정보/수정
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export { ProfileBox };
