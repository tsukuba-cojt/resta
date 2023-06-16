import React from "react";
import styled from "styled-components";
import {Template} from "../../../types/Template";
import TemplateCard from "./TemplateCard";

const Wrapper = styled.div`
`;

interface TemplateListProps {
  templates: Template[]
}

const TemplateList = ({templates}: TemplateListProps) => {
  return (
    <Wrapper>
      {templates.map((template) => <TemplateCard template={template} />)}
    </Wrapper>
  );
};

export default TemplateList;