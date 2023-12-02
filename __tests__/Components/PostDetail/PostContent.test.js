import React from 'react';
import { render, screen } from '@testing-library/react';
import PostContent from '@src/components/PostDetail/PostContent';

const renderPostContent = (title, content) => {
  return render(<PostContent title={title} content={content} />);
};

describe('<PostContent />', () => {
  const mockContent = global.mockPostData.content;
  const mockTitle = 'Test Title';

  beforeEach(() => {
    renderPostContent(mockTitle, mockContent);
  });

  it('제목이 올바르게 렌더링 되어야 한다.', () => {
    expect(screen.getByText(mockTitle)).toBeInTheDocument();
  });

  it('본문 블록이 올바르게 렌더링 되어야 한다.', () => {
    const image = screen.getByAltText('test_image.jpeg');
    const paragraph = screen.getByText('testParagraphContent');

    expect(image).toHaveAttribute('src', 'https://example.com/test.jpg');
    expect(paragraph).toBeInTheDocument();
  });
});
