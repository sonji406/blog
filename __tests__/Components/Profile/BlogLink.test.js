import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import BlogLink from '@src/components/Profile/BlogLink';

jest.useFakeTimers();

const mockUserData = {
  sessionId: 'testUserId',
};

const blogLinkUrl = `https://vanillog/posts/${mockUserData.sessionId}`;

const successMessage = '내 블로그 링크 복사 완료!';

const renderBlogLink = () =>
  render(<BlogLink sessionId={mockUserData.sessionId} />);

describe('<BlogLink />', () => {
  it('블로그 링크 컴포넌트가 올바른 URL을 표시해야 한다.', () => {
    const { getByText } = renderBlogLink();
    expect(getByText(blogLinkUrl)).toBeInTheDocument();
  });

  it('복사하기 버튼 클릭 시 내 블로그 링크가 복사되어야 한다.', async () => {
    const { getByText, queryByText, findByText } = renderBlogLink();
    const copyButton = getByText('복사하기');
    expect(queryByText(successMessage)).toBeNull();

    global.navigator.clipboard = {
      writeText: jest.fn(() => Promise.resolve()),
    };

    fireEvent.click(copyButton);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(blogLinkUrl);

    const message = await findByText(successMessage);
    expect(message).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(queryByText(successMessage)).toBeNull();
  });
});
