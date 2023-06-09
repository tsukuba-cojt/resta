import Flex from "../common/Flex";
import {BgColorsOutlined} from "@ant-design/icons";
import ColorPicker from "../../controls/ColorPicker";
import React from "react";
import {createId} from "../../../utils/IDUtils";

interface BackgroundColorCustomizer {
  onChange: (key: string, value: string, id: number) => void;
}

const BackgroundColorCustomizer = ({onChange}: BackgroundColorCustomizer) => {
  return (
    <Flex>
      <BgColorsOutlined/>
      <ColorPicker cssKey={"background-color"} id={createId()} onChange={onChange}/>
    </Flex>
  );
};

export default BackgroundColorCustomizer;