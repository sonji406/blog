'use client';

import { useState, useEffect } from 'react';

function NicknameEditor({
  editing,
  toggleEditing,
  nickname,
  setNickname,
  updateNickname,
  message,
}) {
  const [showMessage, setShowMessage] = useState(false);
  const [tempNickname, setTempNickname] = useState(nickname);

  useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [message]);

  const handleToggleEditing = () => {
    setTempNickname(nickname);
    toggleEditing();
  };

  const handleCancel = () => {
    toggleEditing();
    setNickname(tempNickname);
  };

  const handleSave = () => {
    updateNickname();
  };

  return (
    <div
      className='shadow rounded-lg p-5 bg-white space-y-4 mb-5'
      style={{ margin: '20px' }}
    >
      <h2 className='flex justify-center font-semibold text-lg text-gray-700 border-b border-gray-400 pb-3'>
        내 닉네임
      </h2>
      {editing ? (
        <>
          <input
            type='text'
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className='border px-2 py-1 rounded w-full block'
          />
          <div className='flex justify-end space-x-2 mt-2'>
            <button
              onClick={handleSave}
              className='bg-[#16354D] hover:bg-black text-white px-3 py-1 text-sm rounded shadow'
            >
              저장
            </button>
            <button
              onClick={handleCancel}
              className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded shadow'
            >
              취소
            </button>
          </div>
        </>
      ) : (
        <>
          <div className='flex justify-center'>{nickname}</div>
          <div className='flex justify-end'>
            <button
              onClick={handleToggleEditing}
              className='bg-[#16354D] hover:bg-black text-white px-3 py-1 text-sm rounded'
            >
              변경하기
            </button>
          </div>
        </>
      )}
      {showMessage && (
        <div className='flex justify-center text-sm text-blue-600'>
          {message}
        </div>
      )}
    </div>
  );
}

export default NicknameEditor;
