import {RestaStyle, RestaStyles} from "./types/RestaSetting";

export const downloadUiSetting = async (): Promise<RestaStyle[]> => {
    const endpoint =
        'https://gist.githubusercontent.com/itsu-dev/80b3b29608fb11a697a1c98fb84cba91/raw/b658d3f27b658a28633eb75fe4cc0700c7e80732/resta-setting.json';
    const json = await (await fetch(endpoint)).json();
    return (json as RestaStyles).styles;
};
