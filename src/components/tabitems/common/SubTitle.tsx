import styled from 'styled-components';
import { Typography } from 'antd';
import React from 'react';

const Wrapper = styled.div`
  padding-bottom: 4px;
`;

interface SubTitleProps {
  text: string;
}

const SubTitle = ({ text }: SubTitleProps) => {
  const { Text } = Typography;
  return (
    <Wrapper>
      <Text type="secondary">{text}</Text>
    </Wrapper>
  );
};

export default SubTitle;
