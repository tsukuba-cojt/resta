import React from "react";
import {createId} from "../../../utils/IDUtils";
import InputNumberWithUnit from "../../controls/InputNumberWithUnit";
import {blockUnits} from "../../../consts/units";
import Flex from "../common/Flex";
import {
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined
} from "@ant-design/icons";
import Section from "../common/Section";

interface BorderRadiusCustomizerProps {
  onChange: (key: string, value: string, id: number) => void;
}

const BorderRadiusCustomizer = ({onChange}: BorderRadiusCustomizerProps) => {
  const borders = {
    "border-top-left": <RadiusUpleftOutlined/>,
    "border-top-right": <RadiusUprightOutlined/>,
    "border-bottom-right": <RadiusBottomrightOutlined/>,
    "border-bottom-left": <RadiusBottomleftOutlined/>,
  };

  return (
    <>
      {Object.entries(borders).map(([cssKey, icon], index) =>
        <Section>
          <Flex key={index}>
            {icon}
            <InputNumberWithUnit cssKey={`${cssKey}-radius`} id={createId()} options={blockUnits} onChange={onChange}/>
          </Flex>
        </Section>
      )}
    </>
  );
};

/*
    <CollapseWrapper>
      <Collapse size="small">
        {Object.entries(borders).map(([title, cssKey], index) =>
          <Panel key={index} header={title}>
            <SingleBorderRadiusCustomizer cssKey={cssKey} onChange={onChange}/>
          </Panel>
        )}
      </Collapse>
    </CollapseWrapper>
 */

export default BorderRadiusCustomizer;