import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { render, screen, act, waitFor } from '@testing-library/react';
import PostActions from '@src/components/PostDetail/PostActions';

const renderPostActions = (userId, postId, session, onShowDeleteModal) => {
  return render(
    <PostActions
      userId={userId}
      postId={postId}
      session={session}
      onShowDeleteModal={onShowDeleteModal}
    />,
  );
};

describe('<PostActions />', () => {
  beforeEach(() => {
    useSession.mockReturnValue({ data: { mongoId: 'testUserId' } });
    useRouter.mockReturnValue({
      push: jest.fn(),
    });
  });

  it('로그인한 사용자가 자신의 포스트를 보면 삭제와 수정 버튼이 보여야 한다.', async () => {
    await act(async () => {
      renderPostActions(
        'testUserId',
        'testPostId',
        { mongoId: 'testUserId' },
        jest.fn(),
      );
    });

    await waitFor(() => {
      expect(screen.getByText('수정하기')).toBeInTheDocument();
      expect(screen.getByText('삭제하기')).toBeInTheDocument();
    });
  });

  it('로그인한 사용자가 다른 사람의 포스트를 보면 삭제와 수정 버튼이 보이지 않아야 한다.', async () => {
    const { container } = renderPostActions(
      'anotherTestUserId',
      'testPostId',
      { mongoId: 'testUserId' },
      jest.fn(),
    );

    expect(container.firstChild).toBeNull();
  });
});
