import {ConfigProvider} from "antd";
import React from "react";
import {COLOR_PRIMARY} from "../consts/styles";
import GlobalStyle from "../components/utils/GlobalStyle";

export default function ({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: COLOR_PRIMARY,
                }
            }}>
            <GlobalStyle />
            {children}
        </ConfigProvider>
    )
};