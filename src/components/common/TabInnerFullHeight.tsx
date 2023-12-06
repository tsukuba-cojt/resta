import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh - 192px);
`;

type Props = {
  children: React.ReactNode | React.ReactNode[];
}
export default function TabInnerFullHeight({ children }: Props) {
  return <Wrapper>{children}</Wrapper>;
}