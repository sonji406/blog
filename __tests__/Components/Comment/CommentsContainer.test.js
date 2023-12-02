import React from 'react';
import {
  render,
  act,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { useComments } from '@utils/useComment';
import CommentsContainer from '@src/components/Comment/CommentsContainer';
import axios from 'axios';

jest.mock('@utils/useComment');

const mockPostId = 'testPostId';

const renderCommentsContainer = () =>
  render(<CommentsContainer postId={mockPostId} />);

describe('<CommentsContainer />', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: { status: 200, data: global.mockCommentData },
    });

    useComments.mockReturnValue({
      commentText: '',
      setCommentText: jest.fn(),
      handleCommentSubmit: jest.fn(),
      errorMessage: null,
    });
  });

  it('댓글을 로딩하는 API 호출이 올바르게 이루어져야 한다.', async () => {
    await act(async () => {
      renderCommentsContainer();
    });

    expect(axios.get).toHaveBeenCalledWith(`/api/v1/comment/${mockPostId}`);
    expect(screen.getByText('testCommentContent1')).toBeInTheDocument();
    expect(screen.getByText('testCommentContent2')).toBeInTheDocument();
  });

  it('새 댓글을 작성하는 함수가 제대로 동작해야 한다.', async () => {
    const newComment = {
      _id: 'newTestCommentId',
      comment: 'newTestCommentContent',
      author: 'newTestCommentAuthorId',
    };

    useComments.mockReturnValue({
      commentText: newComment.comment,
      setCommentText: jest.fn(),
      handleCommentSubmit: jest.fn().mockResolvedValue(newComment),
      errorMessage: null,
    });

    await act(async () => {
      renderCommentsContainer();
    });

    const textarea = screen.getByPlaceholderText('댓글 내용을 입력하세요');
    fireEvent.change(textarea, { target: { value: newComment.comment } });

    const submitButton = screen.getByRole('button', { name: '댓글 작성' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('newTestCommentContent')).toBeInTheDocument();
    });
  });
});
