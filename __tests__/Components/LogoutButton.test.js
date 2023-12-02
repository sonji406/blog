import { signOut } from 'next-auth/react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LogoutButton } from '@src/components/LogoutButton';

const renderLogoutButtonAndGetElement = () => {
  render(<LogoutButton />);
  return screen.getByText(/Logout/i);
};

describe('<LogoutButton />', () => {
  it('로그아웃 버튼 컴포넌트가 올바르게 렌더링되어야 한다.', () => {
    const buttonElement = renderLogoutButtonAndGetElement();
    expect(buttonElement).toBeInTheDocument();
  });

  it('로그아웃 버튼 컴포넌트 클릭 시, signOut 함수가 올바른 파라미터로 호출되어야 한다.', () => {
    const buttonElement = renderLogoutButtonAndGetElement();
    fireEvent.click(buttonElement);
    expect(signOut).toHaveBeenCalled();
  });
});
