import './popup.scss';
import './init';
import {addEvent} from './events';
import {calc} from './calc';

(async () => {
  const win = await chrome.windows.getCurrent();

  if (typeof win.id === 'number') {
    addEvent(win.id);
    await calc(win.id);
  }
})();
