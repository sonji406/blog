import React from 'react';
import { render, screen, act } from '@testing-library/react';
import PostDetailPage from '@src/app/post/[userId]/[postId]/page';

jest.mock('@src/components/PostDetail/PostDetail', () => {
  return function MockedPostDetail() {
    return <div>Mocked Post Detail</div>;
  };
});

jest.mock('@src/components/Comment/CommentsContainer', () => {
  return function MockedCommentsContainer() {
    return <div>Mocked Comments Container</div>;
  };
});

const renderPostDetailPage = async (params) => {
  await act(async () => {
    render(<PostDetailPage params={params} />);
  });
};

describe('<PostDetailPage />', () => {
  it('가상의 PostDetail과 CommentsContainer가 올바르게 렌더링 되어야 한다.', async () => {
    const mockParams = {
      userId: 'testUserId',
      postId: 'testPostId',
    };

    await renderPostDetailPage(mockParams);

    expect(screen.getByText('Mocked Post Detail')).toBeInTheDocument();
    expect(screen.getByText('Mocked Comments Container')).toBeInTheDocument();
  });
});
