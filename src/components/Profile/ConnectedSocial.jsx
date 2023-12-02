'use client';

function ConnectedSocial({ socialLoginType }) {
  return (
    <div
      className='shadow rounded-lg p-5 bg-white space-y-4 mb-5'
      style={{ margin: '20px' }}
    >
      <h2 className='flex justify-center font-semibold text-lg text-gray-700 border-b border-gray-400 pb-3'>
        연동된 소셜
      </h2>
      <div className='flex justify-center text-[#16354D] text-lg'>
        {socialLoginType}
      </div>
    </div>
  );
}

export default ConnectedSocial;
