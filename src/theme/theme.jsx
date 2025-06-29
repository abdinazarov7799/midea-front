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
  
  .title-color{
    color: #fff!important;
  }
  
  body {
    color: #707070;
    font-size: 16px;
    line-height: 1.45;
    font-weight: 400;
    font-family: 'Play', sans-serif!important;
  }

  #nprogress .bar {
    background: #63B4EC !important;
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
    background: #63B4EC;
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
            colorPrimary: '#488cf3',
            borderRadius: '5px',
        },
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
