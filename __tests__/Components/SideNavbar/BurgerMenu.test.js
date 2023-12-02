import React from 'react';
import { render } from '@testing-library/react';
import { BurgerMenu } from '@src/components/SideNavbar/BurgerMenu';

const renderBurgerMenu = (isOpen) => {
  return render(<BurgerMenu isOpen={isOpen} />);
};

describe('<BurgerMenu />', () => {
  it('isOpen이 true인 경우 "open" 클래스로 렌더링 되어야 한다.', () => {
    const { container } = renderBurgerMenu(true);
    const divElement = container.firstChild;

    expect(divElement).toHaveClass('open');
  });

  it('isOpen이 false인 경우 "open" 클래스 없이 렌더링 되어야 한다.', () => {
    const { container } = renderBurgerMenu(false);
    const divElement = container.firstChild;

    expect(divElement).not.toHaveClass('open');
  });
});
