import { useSession } from 'next-auth/react';
import { render, screen, waitFor } from '@testing-library/react';
import { ERRORS } from 'constants/errors';
import { Navbar } from '@src/components/Navbar';
import axios from 'axios';

const renderNavbar = () => render(<Navbar />);

describe('<Navbar />', () => {
  it('로그인하지 않은 사용자의 경우 로그인 링크가 렌더링 되어야 한다.', () => {
    useSession.mockReturnValue({ status: 'unauthenticated' });

    renderNavbar();

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('로그인한 사용자의 경우 사용자의 프로필 이미지와 닉네임이 렌더링 되어야 한다.', async () => {
    useSession.mockReturnValue({
      status: 'authenticated',
      data: { mongoId: 'testUserId' },
    });

    const mockProfileResponse = {
      data: {
        status: 200,
        data: {
          profileImage: 'https://example.com/test.jpg',
          nickname: 'testUserNickname',
        },
      },
    };

    axios.get.mockResolvedValueOnce(mockProfileResponse);

    renderNavbar();

    await waitFor(() => {
      expect(screen.getByAltText('프로필 사진')).toBeInTheDocument();
      expect(screen.getByText('testUserNickname')).toBeInTheDocument();
    });
  });

  it('프로필을 불러오는 동안 에러가 발생하면 에러 메시지가 렌더링 되어야 한다.', async () => {
    useSession.mockReturnValue({
      status: 'authenticated',
      data: { mongoId: 'testUserId' },
    });

    axios.get.mockRejectedValueOnce(new Error('API error'));

    renderNavbar();

    await waitFor(() => {
      expect(
        screen.getByText(ERRORS.PROFILE_LOADING_ERROR),
      ).toBeInTheDocument();
    });
  });
});
