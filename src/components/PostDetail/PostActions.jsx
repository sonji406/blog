import { useRouter } from 'next/navigation';

function PostActions({ userId, postId, session, onShowDeleteModal }) {
  const router = useRouter();

  if (userId !== session?.mongoId) return null;

  return (
    <div className='flex justify-end mb-8 space-x-4'>
      <button
        onClick={() => router.push(`/post/editor/${userId}/${postId}`)}
        className='bg-blue-500 text-white py-2 px-4 rounded'
      >
        수정하기
      </button>
      <button
        onClick={onShowDeleteModal}
        className='bg-red-500 text-white py-2 px-4 rounded'
      >
        삭제하기
      </button>
    </div>
  );
}

export default PostActions;
