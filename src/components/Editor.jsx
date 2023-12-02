'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import EditorJS from '@editorjs/editorjs';
import ImageTool from '@editorjs/image';
import { ERRORS } from 'constants/errors';

function Editor({ author, postId, title, content, error, setError, isModify }) {
  const ref = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const initEditor = async () => {
      if (ref.current) {
        await ref.current.isReady;
        ref.current.render(content);
        return;
      }

      ref.current = new EditorJS({
        holder: 'editorjs',
        data: content,
        tools: {
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: `/api/v1/image/uploadFile`,
              },
              types: 'image/*',
              captionPlaceholder: 'Enter caption',
            },
          },
        },
      });
    };

    initEditor();
  }, [content]);

  const postSave = async () => {
    const outputData = await ref.current.save();

    if (!title || !outputData.blocks.length) {
      setError(ERRORS.TITLE_CONTENT_REQUIRED);
      return;
    }

    const postData = {
      title,
      author,
      content: outputData,
    };

    try {
      const response = isModify
        ? await axios.put(`/api/v1/post/${postId}`, postData)
        : await axios.post('/api/v1/post', postData);

      if (response.data.status !== 200) {
        setError(response.data.message);
        return;
      }

      router.push(`/posts/${author}`);
    } catch {
      const errorMessage = isModify
        ? ERRORS.EDITOR_EDIT_FAILED
        : ERRORS.EDITOR_SAVE_FAILED;

      setError(errorMessage);
    }
  };

  return (
    <>
      <div className='border-2 border-gray-300 rounded-lg mb-6'>
        <div className='mt-2 ml-6'>
          <div id='editorjs' />
        </div>
      </div>
      <div>
        <div className='text-red-700 text-center'>{error}</div>
        <button
          onClick={postSave}
          className='text-xl text-white font-bold bg-[#6B99C3] rounded-full hover:bg-[#16354D] py-2 px-8 w-full'
        >
          저장하기
        </button>
      </div>
    </>
  );
}

export default Editor;
