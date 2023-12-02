import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { usePost } from '@utils/usePost';
import { useComments } from '@utils/useComment';
import PostDetail from '@src/components/PostDetail/PostDetail';

const renderPostDetail = (props) => {
  useSession.mockReturnValue({
    data: { mongoId: 'testUserId' },
  });

  usePost.mockReturnValue({ post: global.mockPostData });

  useComments.mockReturnValue({});

  useRouter.mockReturnValue({
    route: '/post/detail',
    pathname: '/post/detail',
    query: {},
    asPath: '',
  });

  return render(<PostDetail {...props} />);
};

describe('<PostDetail />', () => {
  it('포스트를 불러오는 동안 로딩 상태가 렌더링 되어야 한다.', () => {
    usePost.mockReturnValueOnce({ post: null });
    renderPostDetail({ userId: 'testUserId', postId: 'testPostId' });

    expect(screen.getByText('포스트를 불러오는 중...')).toBeInTheDocument();
  });

  it('포스트가 불러와졌을 경우 포스트 내용이 렌더링 되어야 한다.', async () => {
    renderPostDetail({ userId: 'testUserId', postId: 'testPostId' });
    const titleElement = await screen.findByText('Test Title');

    expect(titleElement).toBeInTheDocument();
  });

  it('세션 ID와 사용자 ID가 일치하는 경우 포스트 수정 및 삭제 기능이 렌더링 되어야 한다.', async () => {
    renderPostDetail({ userId: 'testUserId', postId: 'testPostId' });
    const editAction = await screen.findByText('수정하기');
    const deleteAction = await screen.findByText('삭제하기');

    expect(editAction).toBeInTheDocument();
    expect(deleteAction).toBeInTheDocument();
  });

  it('세션 ID와 사용자 ID가 일치하지 않는 경우 포스트 수정 및 삭제 기능이 렌더링 되지 않아야 한다.', () => {
    useSession.mockReturnValueOnce({ data: { mongoId: 'anotherTestUserId' } });
    renderPostDetail({ userId: 'testUserId', postId: 'testPostId' });

    expect(screen.queryByText('수정하기')).not.toBeInTheDocument();
    expect(screen.queryByText('삭제하기')).not.toBeInTheDocument();
  });
});
