import React from 'react';
import { render } from '@testing-library/react';
import ConnectedSocial from '@src/components/Profile/ConnectedSocial';

const renderConnectedSocial = () =>
  render(
    <ConnectedSocial socialLoginType={global.mockUserData.socialLoginType} />,
  );

describe('<ConnectedSocial />', () => {
  it('연결된 소셜 컴포넌트가 올바르게 렌더링 되어야 한다.', () => {
    const { container } = renderConnectedSocial();
    expect(container).toBeInTheDocument();
  });

  it('올바른 socialLoginType이 표시되어야 한다.', () => {
    const { getByText } = renderConnectedSocial();

    expect(getByText(global.mockUserData.socialLoginType)).toBeInTheDocument();
  });
});
