import React from 'react';
import { useSession } from 'next-auth/react';
import { render, screen, act } from '@testing-library/react';
import { useUserProfile } from '@utils/useUserProfile';
import { useImageUpload } from '@utils/useImageUpload';
import { useNicknameUpdate } from '@utils/useNicknameUpdate';
import ProfilePage from '@src/app/profile/[userId]/page';

const renderProfilePage = async (params) => {
  await act(async () => {
    render(<ProfilePage params={params} />);
  });
};

const mockUseSession = (returnValue) => {
  useSession.mockReturnValue(returnValue);
};

const mockUseUserProfile = (returnValue) => {
  useUserProfile.mockReturnValue(returnValue);
};

const mockUseImageUpload = (returnValue) => {
  useImageUpload.mockReturnValue(returnValue);
};

const mockUseNicknameUpdate = (returnValue) => {
  useNicknameUpdate.mockReturnValue(returnValue);
};

describe('<ProfilePage />', () => {
  it('프로필 데이터가 올바르게 렌더링 되어야 한다.', async () => {
    mockUseSession({ data: { session: { mongoId: 'testUserId' } } });
    mockUseUserProfile({
      userProfile: { nickname: 'testUserNickname', socialLoginType: 'google' },
      loading: false,
      error: null,
    });
    mockUseImageUpload({
      uploadedImage: null,
      handleImageUpload: jest.fn(),
    });
    mockUseNicknameUpdate({
      nickname: 'testUserNickname',
      setNickname: jest.fn(),
      message: '',
      updateNickname: jest.fn(),
    });

    await renderProfilePage({ userId: 'testUserId' });

    expect(screen.getByText('testUserNickname')).toBeInTheDocument();
    expect(screen.getByText('google')).toBeInTheDocument();
  });

  it('로딩 상태가 올바르게 렌더링 되어야 한다.', async () => {
    mockUseUserProfile({
      userProfile: null,
      loading: true,
      error: null,
    });

    await renderProfilePage({ userId: 'testUserId' });

    expect(screen.getByText('프로필을 불러오는 중입니다.')).toBeInTheDocument();
  });

  it('에러 상태를 올바르게 처리해야 한다.', async () => {
    mockUseUserProfile({
      userProfile: null,
      loading: false,
      error: '에러 발생',
    });

    await renderProfilePage({ userId: 'testUserId' });

    expect(screen.getByText('Error: 에러 발생')).toBeInTheDocument();
  });
});
