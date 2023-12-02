import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import ErrorMessageWindow from '@src/components/PostDetail/ErrorMessageWindow';

const renderErrorMessageWindow = (message) => {
  return render(<ErrorMessageWindow message={message} />);
};

describe('<ErrorMessageWindow />', () => {
  it('에러 메시지가 주어졌을 때 올바르게 렌더링되어야 한다.', () => {
    renderErrorMessageWindow('에러가 발생하였습니다.');

    expect(screen.getByText('에러가 발생하였습니다.')).toBeInTheDocument();
  });

  it('에러 메시지가 없을 때 렌더링되지 않아야 한다.', () => {
    renderErrorMessageWindow(null);

    expect(
      screen.queryByText('에러가 발생하였습니다.'),
    ).not.toBeInTheDocument();
  });

  it("'X' 버튼 클릭 시 에러 메시지가 사라져야 한다.", () => {
    renderErrorMessageWindow('에러가 발생하였습니다.');

    const closeButton = screen.getByText('X');

    act(() => {
      fireEvent.click(closeButton);
    });

    expect(
      screen.queryByText('에러가 발생하였습니다.'),
    ).not.toBeInTheDocument();
  });
});
