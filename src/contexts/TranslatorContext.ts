import React, {useCallback, useState} from "react";
import {Language} from "../types/Language";

type TranslatorContext = {
    lang: Language;
    setLanguage: (lang: Language) => void;
}

export const defaultLanguageContext: TranslatorContext = {
    lang: {},
    setLanguage: () => {},
}

export const TranslatorContext = React.createContext<TranslatorContext>(defaultLanguageContext);

export const useTranslator = (): TranslatorContext => {
    const [lang, _setLanguage] = useState<Language>({});

    const setLanguage = useCallback((lang: Language): void => {
        _setLanguage(lang);
    }, []);

    return {lang, setLanguage};
}