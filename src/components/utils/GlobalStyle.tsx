import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @keyframes openAnimation {
    from {
      right: -300px;
    }

    to {
      right: 0;
    }
  }

  @keyframes closeAnimation {
    from {
      opacity: 1.0;
    }

    to {
      opacity: 0;
    }
  }
  
  #resta-root {
    position: fixed;
    z-index: 99998;
    top: 0;
    right: 0;
    width: 300px;
    min-width: 300px;
    height: 100%;
    margin: 16px;
    padding: 0 3px 32px;
    animation: openAnimation 0.5s ease;
    box-sizing: border-box;
    color: #333;
    cursor: ew-resize;

    text-align: initial;
    line-height: initial;
    font-size: initial;
    font-weight: initial;
    font-family: "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic Pro", "メイリオ", Meiryo, Osaka, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
  }
  
  .ant-tooltip {
    z-index: 99999;
  }

  .ant-popover {
    z-index: 99999 !important;
  }
`;

export default GlobalStyle;
