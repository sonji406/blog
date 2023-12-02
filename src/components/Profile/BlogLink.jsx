'use client';

import { useState } from 'react';
import Link from 'next/link';

function BlogLink({ sessionId }) {
  const [copied, setCopied] = useState(false);
  const url = `https://vanillog/posts/${sessionId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };

  return (
    <div
      className='shadow rounded-lg p-5 bg-white space-y-4 mb-5'
      style={{ margin: '20px' }}
    >
      <h2 className='flex justify-center font-semibold text-lg text-gray-700 border-b border-gray-400 pb-3'>
        내 블로그 링크
      </h2>
      <div>
        <Link href={`/posts/${sessionId}`}>
          <span className='text-[#16354D] underline'>{url}</span>
        </Link>
      </div>
      <div className='flex justify-end'>
        <button
          onClick={handleCopy}
          className='bg-[#16354D] hover:bg-black text-white px-3 py-1 text-sm rounded'
        >
          복사하기
        </button>
      </div>
      {copied && (
        <div className='flex justify-center text-green-500 text-sm mt-2'>
          내 블로그 링크 복사 완료!
        </div>
      )}
    </div>
  );
}

export default BlogLink;
