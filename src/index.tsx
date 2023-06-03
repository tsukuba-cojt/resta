import * as prop from './features/prop';
import {initStyle} from './features/formatter';
import loadRestaSetting from './features/setting_loader';
import {initContainer} from "./features/root_manager";

window.addEventListener('load', () => {
  console.log('OnLoad');
  prop.setUrl(window.location.href);

  (async () => {
    console.log('Init Style');
    await initStyle();

    console.log('Load Resta Setting');
    const categoryMap = await loadRestaSetting();
    initContainer(categoryMap);
  })();
});
