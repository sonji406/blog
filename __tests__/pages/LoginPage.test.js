import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { LoginButton } from '@src/components/LoginButton';
import LoginPage from '@src/app/auth/login/page';

jest.mock('@src/components/LoginButton', () => ({
  LoginButton: jest.fn(() => (
    <button data-testid='mocked-login-button'>Mocked Login Button</button>
  )),
}));

describe('<LoginPage />', () => {
  beforeEach(() => {
    act(() => {
      render(<LoginPage />);
    });
  });

  it('로그인 페이지가 올바르게 렌더링 되어야 한다.', () => {
    const logoText = screen.getByText('vanilLog');
    const loginButton = screen.getByTestId('mocked-login-button');
    const browseButton = screen.getByText('비회원으로 둘러보기');

    expect(logoText).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
    expect(browseButton).toBeInTheDocument();
  });

  it('로그인 페이지 렌더링 및 구글 로그인 버튼이 나타나야 한다.', () => {
    expect(LoginButton).toHaveBeenCalledWith({ loginCompany: 'google' }, {});
  });
});
