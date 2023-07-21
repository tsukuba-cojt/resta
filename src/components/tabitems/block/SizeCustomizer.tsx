import Flex from '../common/Flex';
import { ColumnHeightOutlined, ColumnWidthOutlined } from '@ant-design/icons';
import React from 'react';
import { createId } from '../../../utils/IDUtils';
import InputNumberWithUnit from '../../controls/InputNumberWithUnit';
import { blockUnits } from '../../../consts/units';
import Section from '../common/Section';

interface SizeCustomizerProps {
  onChange: (key: string, value: string, id: number | string) => void;
}

const SizeCustomizer = ({ onChange }: SizeCustomizerProps) => {
  return (
    <>
      <Section>
        <Flex>
          <ColumnWidthOutlined />
          <InputNumberWithUnit
            cssKey={'width'}
            id={createId('width')}
            options={blockUnits}
            onChange={onChange}
          />
        </Flex>
      </Section>
      <Flex>
        <ColumnHeightOutlined />
        <InputNumberWithUnit
          cssKey={'height'}
          id={createId('height')}
          options={blockUnits}
          onChange={onChange}
        />
      </Flex>
    </>
  );
};

export default SizeCustomizer;
