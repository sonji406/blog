'use client';

import { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

function Comment({ commentInfo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [error, setError] = useState(null);
  const [editedComment, setEditedComment] = useState(commentInfo.comment);
  const { data: session } = useSession();

  const postId = commentInfo.blogPost;
  const commentId = commentInfo._id;
  const isAuthor = session?.mongoId === commentInfo.author._id;

  if (!commentInfo || isDeleted) {
    return <></>;
  }

  const onChange = (e) => {
    setEditedComment(e.target.value);
  };

  const handleEdit = async () => {
    try {
      setError(null);
      const response = await axios.put(
        `/api/v1/comment/${postId}/${commentId}`,
        { comment: editedComment },
      );
      if (response.data.status === 200) {
        setIsEditing(false);
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedComment(commentInfo.comment);
  };

  const handleDelete = async () => {
    try {
      setError(null);
      const response = await axios.delete(
        `/api/v1/comment/${postId}/${commentId}`,
      );
      if (response.data.status === 200) {
        setIsDeleted(true);
      }
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className='border-t pt-4'>
      <div className='flex justify-between items-center mb-2'>
        <span className='text-gray-500'>{commentInfo.author.nickname}</span>
        {isAuthor && (
          <div>
            {isEditing ? (
              <>
                <button
                  onClick={handleEdit}
                  className='text-xs text-gray-700 bg-gray-300 hover:bg-gray-400 py-0 px-1 rounded'
                >
                  확인
                </button>
                <button
                  onClick={handleCancel}
                  className='ml-2 text-xs text-gray-700 bg-gray-300 hover:bg-gray-400 py-0 px-1 rounded'
                >
                  취소
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className='text-xs text-gray-700 bg-gray-300 hover:bg-gray-400 py-0 px-1 rounded'
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className='ml-2 text-xs text-gray-700 bg-gray-300 hover:bg-gray-400 py-0 px-1 rounded'
                >
                  삭제
                </button>
              </>
            )}
            {error && (
              <span className='ml-2 text-red-500'>
                댓글을 수정/삭제할 수 없습니다.
              </span>
            )}
          </div>
        )}
      </div>
      {isEditing ? (
        <input
          type='text'
          onChange={onChange}
          value={editedComment}
          className='w-full p-3 border rounded-md mb-4'
        />
      ) : (
        <p className='mb-2'>{editedComment}</p>
      )}
    </div>
  );
}

export default Comment;
