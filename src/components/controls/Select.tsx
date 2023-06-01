import {Select as AntdSelect} from "antd";
import React from "react";
import {LayoutPart} from "../../types/ChangeStyleElement";

interface SelectProps {
    cssKey: string;
    part: LayoutPart;
    id: number;
    onChange: (key: string, value: string, id:number) => void;
}

const Select = ({cssKey, part, id, onChange}: SelectProps) => {
    return (
        <AntdSelect
            defaultValue={part.options![0]}
            onChange={(value) => onChange(cssKey, value, id)}
            options={part.options!.map((option) => {
                return {value: option, label: option};
            })}
            dropdownStyle={{zIndex: 99999}}
        />
    )
};

export default Select;