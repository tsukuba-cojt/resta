import {Collapse} from "antd";
import React from "react";
import ColorPicker from "../../controls/ColorPicker";
import {createId} from "../../../utils/IDUtils";
import InputNumberWithUnit from "../../controls/InputNumberWithUnit";
import {blockUnits} from "../../../consts/units";
import Section from "../common/Section";
import SubTitle from "../common/SubTitle";
import Select from "../../controls/Select";
import {borderOptions} from "../../../consts/options";
import styled from "styled-components";

const { Panel } = Collapse;

interface SingleBorderColorCustomizerProps {
  cssKey: string;
  onChange: (key: string, value: string, id: number) => void;
}

const SingleBorderColorCustomizer = ({cssKey, onChange}: SingleBorderColorCustomizerProps) => {
  return (
    <>
      <Section>
        <SubTitle text={'色'}/>
        <ColorPicker cssKey={`${cssKey}-color`} id={createId()} onChange={onChange}/>
      </Section>
      <Section>
        <SubTitle text={'太さ'}/>
        <InputNumberWithUnit cssKey={`${cssKey}-width`} id={createId()} options={blockUnits} onChange={onChange}/>
      </Section>
      <SubTitle text={'枠線のスタイル'}/>
      <Select cssKey={`${cssKey}-style`} options={borderOptions} id={createId()} onChange={onChange}/>
    </>
  );
};

const CollapseWrapper = styled.div`
  background-color: white;
  border-radius: 8px;
`;

interface BorderColorCustomizerProps {
  onChange: (key: string, value: string, id: number) => void;
}

const BorderColorCustomizer = ({onChange}: BorderColorCustomizerProps) => {
  const borders = {
    '上': "border-top",
    '下': "border-bottom",
    '左': "border-left",
    '右': "border-right",
  };

  return (
    <CollapseWrapper>
      <Collapse size="small">
        {Object.entries(borders).map(([title, cssKey], index) =>
          <Panel key={index} header={title}>
            <SingleBorderColorCustomizer cssKey={cssKey} onChange={onChange}/>
          </Panel>
        )}
      </Collapse>
    </CollapseWrapper>
  );
};

export default BorderColorCustomizer;