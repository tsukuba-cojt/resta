// BoldやItaricなどのボタンのデザインを設定する関数
export const setButtonDesign = (button: HTMLElement) => {
  button.style.width = "30px";
  button.style.height = "30px";
  button.style.borderRadius = "5px";
  button.style.background = "#fff";
  button.style.boxShadow = "0 2px 4px rgba(0,0,0,0.4)";
  button.style.margin = "5px";
};

// idDisplayのデザインを設定する関数
export const setIdDisplayDesign = (idDisplay:HTMLElement) => {
  idDisplay.style.width = "300px";
  idDisplay.style.height = "100%";
  idDisplay.style.position = "fixed";
  idDisplay.style.bottom = "0";
  idDisplay.style.right = "0";
  idDisplay.style.boxShadow = "0 2px 4px rgba(0,0,0,0.4)";
  idDisplay.style.background = "#fff";
  idDisplay.style.zIndex = "100000";
};
