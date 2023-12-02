import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { PostList } from '@src/components/Posts/PostList';
import axios from 'axios';

jest.mock('next/link', () => {
  const MockNextLink = ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };

  MockNextLink.displayName = 'MockNextLink';

  return MockNextLink;
});

jest.mock('next/navigation', () => ({
  useSearchParams: () => {
    return {
      get: (param) => mockGetParams[param],
    };
  },
}));

const mockGetParams = {
  q: 'searchQuery',
  page: '2',
  limit: '10',
};

const mockAxiosGet = (data) => {
  axios.get.mockResolvedValueOnce({
    data: {
      status: 200,
      ...data,
    },
  });
};

describe('<PostList /> - Pagination', () => {
  it('페이지 넘버 2 버튼이 표시될 때 그 버튼은 올바른 href로 렌더링 되어야 한다.', async () => {
    mockAxiosGet({
      data: [],
      totalPosts: 50,
    });

    render(<PostList blogUserId={null} />);

    await waitFor(() => expect(screen.getByText('2')).toBeInTheDocument());

    const button = screen.getByText('2');
    const parentAnchor = button.parentElement;
    expect(parentAnchor).toHaveAttribute('href', '/posts/?page=2&limit=10');
  });
});

describe('<PostList /> - Search Results', () => {
  it('검색어에 해당되는 포스트가 있는 경우 검색 결과가 렌더링 되어야 한다.', async () => {
    const mockSearchResults = [
      {
        _id: 'testPostId1',
        author: 'testAuthorId1',
        title: 'Search Result 1',
        content: { ...global.mockPostData, blocks: [] },
      },
      {
        _id: 'testPostId2',
        author: 'testAuthorId2',
        title: 'Search Result 2',
        content: { ...global.mockPostData, blocks: [] },
      },
    ];

    mockAxiosGet({
      data: mockSearchResults,
      totalPosts: mockSearchResults.length,
    });

    render(<PostList blogUserId={null} />);

    await waitFor(() => {
      expect(screen.getByText('Search Result 1')).toBeInTheDocument();
      expect(screen.getByText('Search Result 2')).toBeInTheDocument();
    });
  });

  it('검색어에 해당되는 포스트가 없는 경우 검색 결과가 없다는 텍스트가 렌더링 되어야 한다.', async () => {
    mockAxiosGet({
      data: [],
      totalPosts: 0,
    });

    render(<PostList blogUserId={null} />);

    await waitFor(() => {
      expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
    });
  });
});
