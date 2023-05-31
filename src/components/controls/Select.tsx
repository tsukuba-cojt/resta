import {Select as AntdSelect} from "antd";
import React from "react";
import {LayoutPart} from "../../types/ChangeStyleElement";

interface SelectProps {
    cssKey: string;
    part: LayoutPart;
    onChange: (key: string, value: string) => void;
}

const Select = ({cssKey, part, onChange}: SelectProps) => {
    return (
        <AntdSelect
            defaultValue={part.options![0]}
            onChange={(value) => onChange(cssKey, value)}
            options={part.options!.map((option) => {
                return {value: option, label: option};
            })}
            dropdownStyle={{zIndex: 99999}}
        />
    )
};

export default Select;