import { downloadUiSetting } from './downloadUiSetting';
import { parseToElements } from './parse_to_elements';

export const loadChilds = async (idDisplay: HTMLElement) => {
  const uiSetting = await downloadUiSetting();
  if (!uiSetting) {
    console.log(
      'Error(id_display_childs.ts): Could not download resta-setting.json'
    );
    return;
  }

  console.log('uiSetting', uiSetting);

  for (const style of uiSetting) {
    const div = document.createElement('div');
    console.log('style', Object.values(style.css[0])[0]);
    for (const e of parseToElements(Object.values(style.css[0])[0] as string)) {
      div.appendChild(e);
    }
    idDisplay.appendChild(div);
  }
};
