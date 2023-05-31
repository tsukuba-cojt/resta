import {useEffect} from "react";
import {downloadLangJson} from "../downloadUiSetting";
import {useTranslator} from "../contexts/TranslatorContext";
import React from "react";

const LanguageLoader = () => {
    const translator = useTranslator();

    useEffect(() => {
        (async () => {
            translator.setLanguage(await downloadLangJson());
        })();
    }, []);

    return <></>;
};

export default LanguageLoader;