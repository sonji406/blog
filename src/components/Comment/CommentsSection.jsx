import { useSession } from 'next-auth/react';
import Comment from './Comment';

function CommentsSection({
  comments,
  commentText,
  onCommentChange,
  onCommentSubmit,
  errorMessage,
}) {
  const { data } = useSession();
  const loggedInUserId = data?.mongoId;
  return (
    <div>
      <h2 className='text-xl font-semibold mt-6 mb-4'>댓글</h2>

      {comments && comments.length ? (
        comments.map((comment) => (
          <Comment key={comment._id} commentInfo={comment} />
        ))
      ) : (
        <p className='text-gray-500 mb-6'>아직 작성된 댓글이 없습니다.</p>
      )}

      <div className='mt-6'>
        <textarea
          value={commentText}
          onChange={onCommentChange}
          placeholder={
            loggedInUserId
              ? '댓글 내용을 입력하세요'
              : '로그인 후 작성 가능합니다.'
          }
          className='w-full p-3 border rounded-md'
        />

        <div className='flex justify-end'>
          <button
            onClick={onCommentSubmit}
            className={`ml-2 text-sm py-1 px-2 rounded ${
              loggedInUserId
                ? 'text-gray-700 bg-gray-300 hover:bg-gray-400'
                : 'text-gray-500 bg-gray-200 cursor-not-allowed'
            }`}
            disabled={!loggedInUserId}
          >
            댓글 작성
          </button>
        </div>

        {errorMessage && (
          <div className='flex justify-end text-red-500 mt-2'>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentsSection;
