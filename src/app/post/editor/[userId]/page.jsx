'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { ERRORS } from 'constants/errors';

const Editor = dynamic(() => import('@src/components/Editor'), {
  ssr: false,
});

function PostEditPage({ params }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState({});
  const [error, setError] = useState(null);

  const userId = Array.isArray(params) ? params[0] : params.userId;
  const postId = params[1] || null;

  const isModify = Boolean(postId);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const setSaveError = (error) => {
    setError(error);
  };

  useEffect(() => {
    if (isModify) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`/api/v1/post/${postId}`);

          if (response.data.status === 200) {
            setTitle(response.data.data.title);
            setContent(response.data.data.content);
          }

          if (response.data.status !== 200) {
            setError(response.data.message);
          }
        } catch (e) {
          setError(ERRORS.POST_LOADING_ERROR);
        }
      };

      fetchData();
    }
  }, [isModify, postId]);

  return (
    <>
      <div className='min-h-screen px-10'>
        <div className='md:container md:mx-auto'>
          <div className='rounded-lg shadow-md bg-white p-8 mx-auto max-w-3xl'>
            <div className='border-2 border-gray-300 p-1 rounded-lg mb-8'>
              <input
                type='text'
                placeholder='제목을 입력하세요'
                className='w-full p-2 text-lg'
                value={title}
                onChange={handleTitleChange}
              />
            </div>

            <Editor
              author={userId}
              postId={postId}
              title={title}
              content={content}
              isModify={isModify}
              error={error}
              setError={setSaveError}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default PostEditPage;
