import { setIdDisplayDesign, setButtonDesign } from './ui_design';
import { createXPathFromElement } from './xpath_control';
import { saveFormat } from './formatter';
import * as prop from './prop';
import { loadChilds } from './id_display_childs';
export const setidDisplay = () => {
  prop.setIdDisplay(document.createElement('div'));
  prop.idDisplay.id = 'ReDesignIdDisplay';

  setIdDisplayDesign(prop.idDisplay);

  loadChilds(prop.idDisplay);

  const textarea = document.createElement('textarea');
  textarea.style.width = '90%';
  textarea.onkeydown = () => {
    const property = textarea.value.split(':')[0];
    const value = textarea.value.split(':')[1];
    if (prop.clickedElement) {
      prop.clickedElement.style.setProperty(property, value);
    }
  };
  prop.idDisplay.appendChild(textarea);

  const saveButton = document.createElement('button');
  setButtonDesign(saveButton);
  saveButton.textContent = '💾';
  saveButton.onclick = async () => {
    const xpath = createXPathFromElement(prop.clickedElement);
    console.log('xpath:' + xpath);
    saveFormat();
  };
  prop.idDisplay.appendChild(saveButton);
};
