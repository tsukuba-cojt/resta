// @ts-ignore
import lang from "../consts/lang.json";
import {i18n} from "webextension-polyfill";

const t = (key: string) => {
    const s = lang[i18n.getUILanguage()][key];
    return s ? s : key;
}

export default t;