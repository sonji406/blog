'use client';

import { useState } from 'react';

function ErrorMessageWindow({ message }) {
  const [errorMessage, setErrorMessage] = useState(message);
  if (!errorMessage) return null;

  return (
    <>
      {errorMessage && (
        <div className='bg-red-500 text-white px-4 py-2 rounded mb-6'>
          {errorMessage}
          <button onClick={() => setErrorMessage(null)} className='ml-4'>
            X
          </button>
        </div>
      )}
    </>
  );
}

export default ErrorMessageWindow;
