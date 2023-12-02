'use client';

import Image from 'next/legacy/image';

function ProfileImageUploader({
  uploadedImage,
  userProfile,
  handleImageUpload,
  inputRef,
}) {
  return (
    <div className='mb-10 flex flex-col items-center mb-5'>
      <input
        type='file'
        accept='image/*'
        style={{ display: 'none' }}
        ref={inputRef}
        onChange={handleImageUpload}
      />
      <div className='rounded-full bg-white p-3 shadow-[0_0_10px_5px rgba(0, 0, 0, 0.3)]'>
        <div className='rounded-full bg-white w-60 h-60 flex flex-col items-center justify-center relative overflow-hidden border-2 border-white'>
          <Image
            src={
              uploadedImage ||
              userProfile?.profileImage ||
              '/image/profileDefault.png'
            }
            alt='Profile Image'
            layout='fill'
            priority
          />
        </div>
      </div>
      <button
        className='bg-[#16354D] hover:bg-black text-white px-4 py-2 rounded shadow mt-5'
        onClick={() => inputRef.current.click()}
      >
        사진 업로드/변경
      </button>
    </div>
  );
}

export default ProfileImageUploader;
