'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { ERRORS } from 'constants/errors';

export const useComments = (postId) => {
  const [commentText, setCommentText] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const { data: session } = useSession();

  const handleError = (error) => {
    if (error.response && error.response.data.status !== 200) {
      setErrorMessage(error.response.data.message);
    }

    return setErrorMessage(ERRORS.UNKNOWN_ERROR);
  };

  const handleCommentSubmit = async () => {
    if (!commentText) return;

    const commentAuthorId = session?.mongoId;

    if (!commentAuthorId) {
      setErrorMessage(ERRORS.LOGIN_REQUIRED);
      return;
    }

    try {
      const response = await axios.post(`/api/v1/comment/${postId}`, {
        comment: commentText,
        author: commentAuthorId,
      });

      if (response.data.status === 200) {
        setCommentText('');

        return response.data.data;
      }

      return handleError(response);
    } catch (error) {
      handleError(error);
    }
  };

  return { commentText, setCommentText, handleCommentSubmit, errorMessage };
};
