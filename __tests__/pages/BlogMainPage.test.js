import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { PostList } from '@src/components/Posts/PostList';
import Posts from '@src/app/posts/[[...userId]]/page';

const renderPostsPage = (params) => {
  act(() => {
    render(<Posts params={params} />);
  });
};

jest.mock('@src/components/Posts/PostList', () => ({
  PostList: jest.fn(() => <div>Mocked Post List</div>),
}));

describe('<BlogMainPage />', () => {
  it('올바른 유저Id의 블로그의 포스트 목록이 렌더링 되어야 한다.', () => {
    const mockParams = {
      userId: ['testUserId'],
    };

    renderPostsPage(mockParams);

    expect(screen.getByText('Mocked Post List')).toBeInTheDocument();
    expect(PostList).toHaveBeenCalledWith({ blogUserId: 'testUserId' }, {});
  });
});
