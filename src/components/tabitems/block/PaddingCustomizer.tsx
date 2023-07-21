import React from 'react';
import { createId } from '../../../utils/IDUtils';
import InputNumberWithUnit from '../../controls/InputNumberWithUnit';
import { blockUnits } from '../../../consts/units';
import Section from '../common/Section';
import Flex from '../common/Flex';
import {
  DownSquareOutlined,
  LeftSquareOutlined,
  RightSquareOutlined,
  UpSquareOutlined,
} from '@ant-design/icons';

interface PaddingCustomizerProps {
  onChange: (key: string, value: string, id: number | string) => void;
}

const PaddingCustomizer = ({ onChange }: PaddingCustomizerProps) => {
  const paddings = {
    'padding-top': <UpSquareOutlined />,
    'padding-right': <RightSquareOutlined />,
    'padding-bottom': <DownSquareOutlined />,
    'padding-left': <LeftSquareOutlined />,
  };

  return (
    <>
      {Object.entries(paddings).map(([cssKey, icon], index) => (
        <Section>
          <Flex key={index}>
            {icon}
            <InputNumberWithUnit
              cssKey={`${cssKey}`}
              id={createId(`${cssKey}`)}
              options={blockUnits}
              onChange={onChange}
            />
          </Flex>
        </Section>
      ))}
    </>
  );
};

export default PaddingCustomizer;
