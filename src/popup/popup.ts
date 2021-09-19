import './popup.scss';
import './init';
import {addEvent} from './events';

(async () => {
  const win = await chrome.windows.getCurrent();

  if (typeof win.id === 'number') {
    addEvent(win.id);
  }
})();
