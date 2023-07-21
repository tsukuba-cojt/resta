import {ConfigProvider} from "antd";
import React from "react";

export default function ({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#00b7ee',
                }
            }}>
            {children}
        </ConfigProvider>
    )
};