import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileImageUploader from '@src/components/Profile/ProfileImageUploader';

const handleImageUpload = jest.fn();
let inputRef;

const renderProfileImageUploader = (uploadedImage) => {
  return render(
    <ProfileImageUploader
      uploadedImage={uploadedImage}
      userProfile={null}
      handleImageUpload={handleImageUpload}
      inputRef={inputRef}
    />,
  );
};

describe('<ProfileImageUploader />', () => {
  beforeEach(() => {
    inputRef = React.createRef();
  });

  it('프로필 이미지 업로더가 올바르게 렌더링 되어야 한다.', () => {
    renderProfileImageUploader(null);

    expect(screen.getByAltText('Profile Image')).toBeInTheDocument();
  });

  it('업로드된 이미지가 있다면 그것이 렌더링 되어야 한다.', () => {
    const uploadedImage = '/test-image-url.png';
    renderProfileImageUploader(uploadedImage);

    expect(screen.getByAltText('Profile Image').src).toContain(uploadedImage);
  });

  it('사진 업로드/변경 버튼 클릭시 input의 click 메소드가 호출되어야 한다.', () => {
    renderProfileImageUploader(null);
    inputRef.current.click = jest.fn();
    fireEvent.click(screen.getByText('사진 업로드/변경'));

    expect(inputRef.current.click).toHaveBeenCalled();
  });
});
