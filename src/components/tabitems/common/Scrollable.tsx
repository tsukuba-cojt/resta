import styled from 'styled-components';
import { ReactNode, useLayoutEffect, useRef } from 'react';
import React from 'react';

const Wrapper = styled.div`
  transform: translateY(0);
`;

interface ScrollableProps {
  children: ReactNode;
}

const Scrollable = ({ children }: ScrollableProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    const ref = event.currentTarget as HTMLDivElement;
    const currentValue = parseInt(
      (ref.style.transform ? ref.style.transform : '0').match(/-?\d+/)![0],
    );
    const newValue = Math.max(
      currentValue - event.deltaY >= 0 ? 0 : currentValue - event.deltaY,
      ref.parentElement!.getBoundingClientRect().height -
        ref.getBoundingClientRect().height,
    );
    ref.style.transform = `translateY(${newValue}px)`;
  };

  useLayoutEffect(() => {
    ref.current!.addEventListener('wheel', onWheel, {
      passive: false,
    });
  }, []);

  return <Wrapper ref={ref}>{children}</Wrapper>;
};

export default Scrollable;
