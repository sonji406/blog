import { signIn } from 'next-auth/react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginButton } from '@src/components/LoginButton';

const renderLoginButtonAndGetElement = (loginCompany) => {
  render(<LoginButton loginCompany={loginCompany} />);
  return screen.getByText(new RegExp(`${loginCompany} login`, 'i'));
};

describe('<LoginButton />', () => {
  it('로그인 버튼 컴포넌트가 올바르게 렌더링 되어야 한다.', () => {
    const buttonElement = renderLoginButtonAndGetElement('google');

    expect(buttonElement).toBeInTheDocument();
  });

  it('로그인 버튼 컴포넌트 클릭 시, signIn 함수가 올바른 파라미터로 호출되어야 한다.', () => {
    const buttonElement = renderLoginButtonAndGetElement('google');
    fireEvent.click(buttonElement);

    expect(signIn).toHaveBeenCalled();
    expect(signIn).toHaveBeenCalledWith('google', {
      callbackUrl: process.env.DOMAIN,
    });
  });
});
