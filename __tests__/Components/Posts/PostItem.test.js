import { render, screen } from '@testing-library/react';
import { PostItem } from '@src/components/Posts/PostItem';

describe('<PostItem />', () => {
  const mockPostData = global.mockPostData;
  const mockPostWithoutImage = {
    ...mockPostData,
    content: {
      blocks: [{ type: 'paragraph', data: { text: 'Test Post Content' } }],
    },
  };

  it('이미지가 있는 포스트의 경우 이미지가 썸네일로 렌더링 되어야 한다.', () => {
    render(<PostItem post={mockPostData} />);
    const imageBlock = mockPostData.content.blocks.find(
      (block) => block.type === 'image',
    );
    const imageUrl = imageBlock.data.file.url;
    const imageElement = screen.getByRole('img');

    expect(imageElement).toHaveAttribute('alt', 'testParagraphContent');
    expect(imageElement).toHaveAttribute('src', imageUrl);
  });

  it('이미지가 없는 포스트의 경우 랜덤 색상이 썸네일로 렌더링 되어야 한다.', () => {
    render(<PostItem post={mockPostWithoutImage} />);
    const coloredDiv =
      screen.getByText('Test Post Content').parentElement.previousSibling;

    expect(coloredDiv).toHaveClass('w-full', 'h-[170px]');
  });

  it('제목과 콘텐츠가 올바르게 렌더링 되어야 한다.', () => {
    render(<PostItem post={mockPostData} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('testParagraphContent')).toBeInTheDocument();
  });
});
