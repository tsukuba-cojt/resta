import React from "react";
import styled from "styled-components";
import useBorderRadiusStylingHelper from '../../../../hooks/useBorderRadiusStylingHelper';

const Knob = styled.div`
  position: absolute;
  background-color: #00b7ee;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  cursor: pointer;
  z-index: 10;
`;

type Props = {
  direction: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';
  border: Border;
  setBorder: React.Dispatch<React.SetStateAction<Border>>;
}

export default function BorderRadiusStyler({direction, border, setBorder}: Props) {
  const { onMouseDown, ref } = useBorderRadiusStylingHelper({
    direction, border, setBorder
  });

  return (
    <Knob ref={ref} onMouseDown={onMouseDown} />
  )
}