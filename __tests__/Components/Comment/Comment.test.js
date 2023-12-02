import React from 'react';
import { useSession } from 'next-auth/react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import Comment from '@src/components/Comment/Comment';
import axios from 'axios';

const renderComment = () => render(<Comment commentInfo={mockCommentInfo} />);

const mockCommentInfo = global.mockCommentData[0];

describe('<Comment />', () => {
  beforeEach(() => {
    useSession.mockReturnValue({ data: { mongoId: 'testCommentAuthorId1' } });
    axios.put.mockResolvedValue({ data: { status: 200 } });
    axios.delete.mockResolvedValue({ data: { status: 200 } });
    renderComment();
  });

  it('댓글 컴포넌트가 올바르게 렌더링 되어야 한다.', () => {
    expect(screen.getByText('testCommentContent1')).toBeInTheDocument();
  });

  it('댓글 편집이 가능해야 한다.', async () => {
    fireEvent.click(screen.getByText('수정'));

    const input = screen.getByRole('textbox');
    fireEvent.change(input, {
      target: { value: 'edited testCommentContent1' },
    });

    await act(async () => {
      fireEvent.click(screen.getByText('확인'));
    });

    expect(axios.put).toHaveBeenCalled();
  });

  it('댓글 편집 취소가 가능해야 한다.', () => {
    fireEvent.click(screen.getByText('수정'));
    fireEvent.click(screen.getByText('취소'));

    expect(screen.getByText('testCommentContent1')).toBeInTheDocument();
  });

  it('댓글 삭제가 가능해야 한다.', async () => {
    await act(async () => {
      fireEvent.click(screen.getByText('삭제'));
    });

    expect(axios.delete).toHaveBeenCalled();
  });

  it('댓글 수정 실패 시 에러 메시지를 표시해야 한다.', async () => {
    axios.put.mockRejectedValueOnce(new Error('댓글 수정 실패 에러'));

    fireEvent.click(screen.getByText('수정'));

    const input = screen.getByRole('textbox');
    fireEvent.change(input, {
      target: { value: 'edited testCommentContent1' },
    });

    await act(async () => {
      fireEvent.click(screen.getByText('확인'));
    });

    expect(
      screen.getByText('댓글을 수정/삭제할 수 없습니다.'),
    ).toBeInTheDocument();
  });

  it('댓글 삭제 실패 시 에러 메시지를 표시해야 한다.', async () => {
    axios.delete.mockRejectedValueOnce(new Error('댓글 삭제 실패 에러'));

    await act(async () => {
      fireEvent.click(screen.getByText('삭제'));
    });

    expect(
      screen.getByText('댓글을 수정/삭제할 수 없습니다.'),
    ).toBeInTheDocument();
  });
});
