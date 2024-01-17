import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div<{offset: number}>`
  height: ${(props) => `calc(100vh - ${props.offset}px)`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666666;
  padding: 16px;
`;

const DescriptionWrapper = styled.div`
  text-align: center;
  padding: 32px 0 16px;
  color: #666666;
  word-break: auto-phrase;
`;

type Props = {
  icon: React.ReactNode;
  text: string;
  children?: React.ReactNode;
  offset?: number;
}
export default function NoItem({icon, text, children, offset = 190}: Props) {
  return (
    <Wrapper offset={offset}>
      {icon}
      <DescriptionWrapper>
        <p>{text}</p>
      </DescriptionWrapper>
      {children}
    </Wrapper>
  )
}