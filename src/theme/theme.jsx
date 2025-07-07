import React from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import "nprogress/nprogress.css";
import {ConfigProvider, theme} from "antd";
import {useSettingsStore} from "../store/index.js";
import {get} from "lodash";
const {defaultAlgorithm, darkAlgorithm,compactAlgorithm} = theme;

const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .title-color {
        color: #fff !important;
    }

    body {
        color: #707070;
        font-size: 16px;
        line-height: 1.45;
        font-weight: 400;
        font-family: 'Play', sans-serif !important;
    }

    #nprogress .bar {
        background: rgba(241, 123, 13, 0.56) !important;
        height: 2px !important;
        z-index: 99999 !important;
    }

    .horizontal-scroll {
        overflow-x: auto;
        white-space: nowrap;
    }

    ::-webkit-scrollbar {
        width: 4px;
        height: 4px;
    }

    ::-webkit-scrollbar-track {
        background: #F5F5F5;
    }

    ::-webkit-scrollbar-thumb {
        background: rgba(241, 123, 13, 0.56);
        border-radius: 6px;
    }
`
const Theme = ({ children }) => {
    const darkMode = useSettingsStore((state) => get(state, "darkMode"));
    const compactMode = useSettingsStore((state) => get(state, "compactMode"));

    const getAlgorithm = () => {
        if (darkMode && compactMode) {
            return [darkAlgorithm,compactAlgorithm]
        }else if (!darkMode && compactMode) {
            return [defaultAlgorithm,compactAlgorithm]
        }else if (darkMode && !compactMode) {
            return [darkAlgorithm]
        }else {
            return [defaultAlgorithm]
        }
    }

    const themeConfig = {
        algorithm:  getAlgorithm(),
        fonts: {
            heading: 'Play',
            body: 'Play',
        },
        token: {
            colorPrimary: '#044635',
            colorSuccess: '#18A058',
            colorWarning: '#F17B0D',
            fontFamily: 'DM Sans, sans-serif',
            colorText: '#464646',
            colorTextSecondary: '#646464',
            colorBgBase: '#FFFCF1',
            colorBgContainer: '#ffffff',
            fontSize: 14,
            borderRadius: 10,
        },
        components: {
            Menu: {
                itemBorderRadius: 999,
                itemSelectedColor: "#fff",
                itemSelectedBg: '#F17B0D',
                itemHoverBg: 'rgba(241,123,13,0.15)',
                itemActiveBg: 'rgba(241,123,13,0.35)',
                itemHeight: 40,
                subMenuItemBg: 'transparent',
            },

            Button: {
                borderRadius: 10,
            },

            Input: {
                // colorBgContainer: '#F3F5F7',
                colorText: '#464646',
                borderRadius: 10,
            },

            Table: {
                colorBgContainer: '#ffffff',

                headerBg: '#044635',
                headerColor: '#ffffff',
                headerSplitColor: '#e0e0e0',

                borderColor: '#eaeaea',

                rowHoverBg: '#f7f7f7',
                rowSelectedBg: '#fff8f2',
                rowSelectedHoverBg: '#fff1e6',
                rowExpandedBg: '#fafafa',

                stickyScrollBarBg: '#dddddd',
                stickyScrollBarBorderRadius: 4,

                expandIconBg: '#ffffff',
                filterDropdownBg: '#ffffff',
                filterDropdownMenuBg: '#ffffff',

                footerBg: '#f5f5f5',
                footerColor: '#333',
            },

            Tag: {
                colorSuccess: '#e8f5e9',
                colorError: '#fff1f0',
                colorText: '#464646',
                borderRadius: 4,
            },

            Tabs: {
            },

            Descriptions: {
                labelColor: '#808080',
                titleColor: '#000'
            },

            Card: {
                borderRadius: 10,
                colorText: '#464646',
                colorBgContainer: '#ffffff',
            },

            Pagination: {
                itemBg: 'transparent',
                itemActiveBg: 'transparent',
            },

            Avatar: {
                borderRadius: 999,
            },

            DatePicker: {
                colorText: '#464646',
                borderRadius: 10,
            },

            Select: {
                optionSelectedBg: '#e6f4ff',
                borderRadius: 10,
            },

            Statistic: {
                titleFontSize: 14,
                contentFontSize: 18,
            }
        }
    };
  return (
    <ThemeProvider theme={{}}>
      <ConfigProvider theme={themeConfig}>
        <GlobalStyles />
        {children}
      </ConfigProvider>
    </ThemeProvider>
  );
};

export default Theme;
