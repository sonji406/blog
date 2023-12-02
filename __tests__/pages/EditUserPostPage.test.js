import React from 'react';
import { render, screen, act } from '@testing-library/react';
import EditorUserPostPage from '@src/app/post/editor/[userId]/[postId]/page';

jest.mock('next/navigation', () => ({
  useParams: () => ({ userId: '1', postId: '1' }),
}));

jest.mock('@src/app/post/editor/[userId]/page', () => {
  return function MockedPostEditPage({ params }) {
    return (
      <div>
        Mocked Post Edit Page - {params[0]} - {params[1]}
      </div>
    );
  };
});

const renderEditorUserPostPage = () => {
  render(<EditorUserPostPage />);
};

describe('<EditorUserPostPage />', () => {
  it('올바른 파라미터로 PostEditPage가 렌더링 되어야 한다.', async () => {
    await act(async () => {
      renderEditorUserPostPage();
    });

    expect(
      screen.getByText('Mocked Post Edit Page - 1 - 1'),
    ).toBeInTheDocument();
  });
});
