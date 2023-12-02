import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Home from '@src/app/page';

jest.mock('@src/components/Posts/PostList', () => {
  return {
    PostList: () => <div>Mocked Post List</div>,
  };
});

const renderHomePage = async () => {
  await act(async () => {
    render(<Home />);
  });
};

describe('<Home />', () => {
  it('포스트 리스트 컴포넌트가 올바르게 렌더링 되어야 한다.', async () => {
    await renderHomePage();

    expect(screen.getByText('Mocked Post List')).toBeInTheDocument();
  });
});
