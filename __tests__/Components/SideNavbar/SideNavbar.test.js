import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ERRORS } from 'constants/errors';
import { SideNavbar } from '@src/components/SideNavbar/SideNavbar';
import axios from 'axios';

const renderSideNavbar = () => render(<SideNavbar />);

const mockResolvedProfile = () => {
  axios.get.mockResolvedValueOnce({
    data: {
      status: 200,
      data: { _id: 'testUserId', nickname: 'testUserNickname' },
    },
  });
};

const mockRejectedProfile = () => {
  axios.get.mockRejectedValueOnce(new Error());
};

beforeEach(() => {
  usePathname.mockReturnValue('/home');
  useSession.mockReturnValue({ data: {} });
});

describe('<SideNavbar />', () => {
  it('userId가 존재할 때 프로필 데이터를 가져와야 한다.', async () => {
    useSession.mockReturnValue({ data: { mongoId: 'testUserId' } });
    mockResolvedProfile();

    renderSideNavbar();

    expect(await screen.findByText('testUserNickname')).toBeInTheDocument();
  });

  it('API 에러가 있을 경우 에러 메시지가 렌더링 되어야 한다.', async () => {
    useSession.mockReturnValue({ data: { mongoId: 'testUserId' } });
    mockRejectedProfile();

    renderSideNavbar();

    expect(
      await screen.findByText(ERRORS.PROFILE_LOADING_ERROR),
    ).toBeInTheDocument();
  });

  it('비로그인 시, 사이드바 메뉴에 로그인 버튼이 렌더링 되어야 한다.', async () => {
    renderSideNavbar();

    const menuButton = screen.getByTitle('menu');
    fireEvent.mouseEnter(menuButton);

    expect(await screen.findByText('로그인을 해주세요.')).toBeVisible();
  });

  it('로그인 시, 사이드바 메뉴에 사용자의 닉네임이 렌더링 되어야 한다.', async () => {
    useSession.mockReturnValue({ data: { mongoId: 'testUserId' } });
    mockResolvedProfile();

    renderSideNavbar();

    const menuButton = screen.getByTitle('menu');
    fireEvent.mouseEnter(menuButton);

    expect(await screen.findByText('testUserNickname')).toBeVisible();
  });

  it('사이드바에서 마우스를 떼면 사이드바가 닫혀야 한다.', () => {
    renderSideNavbar();

    const sidebarMenu = screen.getByRole('navigation');
    fireEvent.mouseEnter(sidebarMenu);
    fireEvent.mouseLeave(sidebarMenu);

    expect(screen.queryByText('testUserNickname')).not.toBeInTheDocument();
  });

  it('프로필 페이지에서는 사이드바가 렌더링 되지 않아야 한다.', () => {
    usePathname.mockReturnValue('/profile/sample');

    renderSideNavbar();

    expect(screen.queryByRole('navigation')).toBeNull();
  });
});
