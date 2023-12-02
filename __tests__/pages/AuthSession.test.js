import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthSession } from '@src/app/AuthSession';

jest.mock('@src/components/Navbar', () => ({
  Navbar: () => <div>Mocked Navbar</div>,
}));

jest.mock('@src/components/SideNavbar/SideNavbar', () => ({
  SideNavbar: () => <div>Mocked SideNavbar</div>,
}));

jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }) => <div>{children}</div>,
}));

describe('<AuthSession />', () => {
  it('Navbar, SideNavbar 컴포넌트와 자식 컴포넌트가 올바르게 렌더링 되어야 한다.', async () => {
    await act(async () => {
      render(
        <AuthSession>
          <div>Test Child</div>
        </AuthSession>,
      );
    });

    expect(screen.getByText('Mocked Navbar')).toBeInTheDocument();
    expect(screen.getByText('Mocked SideNavbar')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});
