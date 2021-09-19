import '../common.scss';
import './popup.scss';
import './init';
import {addEvent} from './events';
import {calc} from './calc';

(async () => {
  const win = await chrome.windows.getCurrent();

  if (typeof win.id === 'number') {
    /** 複窓の状態を計算して結果を画面に出力する */
    const calcRender = async () => {
      await calc(win.id!);
    };

    addEvent(win.id, calcRender);
    calcRender();
  }
})();
