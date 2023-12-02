'use client';
import { useParams } from 'next/navigation';
import PostEditPage from '../page';

function EditorUserPostPage() {
  const params = useParams();

  return <PostEditPage params={[params.userId, params.postId]} />;
}

export default EditorUserPostPage;
