import React from 'react';
import { useSession } from 'next-auth/react';
import {
  render,
  fireEvent,
  screen,
  act,
  waitFor,
} from '@testing-library/react';
import CommentsSection from '@src/components/Comment/CommentsSection';

const mockCommentInfo = global.mockCommentData[0];

const renderCommentsSection = (
  comments,
  commentText,
  onCommentChange,
  onCommentSubmit,
  errorMessage,
) => {
  act(() => {
    render(
      <CommentsSection
        comments={comments}
        commentText={commentText}
        onCommentChange={onCommentChange}
        onCommentSubmit={onCommentSubmit}
        errorMessage={errorMessage}
      />,
    );
  });
};

describe('<CommentsSection />', () => {
  const mockOnCommentChange = jest.fn();
  const mockOnCommentSubmit = jest.fn();
  const mockErrorMessage = null;

  beforeEach(() => {
    useSession.mockReturnValue({ data: { mongoId: 'testUserId' } });
  });

  it('댓글 렌더링 및 새 댓글 작성 기능이 올바르게 렌더링 되어야 한다.', async () => {
    renderCommentsSection(
      mockCommentInfo,
      mockCommentInfo.comment,
      mockOnCommentChange,
      mockOnCommentSubmit,
      mockErrorMessage,
    );

    expect(screen.getByText('testCommentContent1')).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText('댓글 내용을 입력하세요');
    const submitButton = screen.getByRole('button', { name: '댓글 작성' });

    fireEvent.change(textarea, {
      target: { value: 'edited testCommentContent1' },
    });
    expect(mockOnCommentChange).toHaveBeenCalled();

    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockOnCommentSubmit).toHaveBeenCalled();
    });
  });
});
