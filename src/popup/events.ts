import {STATE} from './state';

/**
 * イベントリスナーの登録
 * @param windowId - chrome.windows.getCurrent().windowId
 */
export const addEvent = (windowId: number) => {
  const port = chrome.runtime.connect();
  const checkbox = document.querySelector<HTMLInputElement>('#isPopup')!;
  const btn = document.querySelector<HTMLButtonElement>('#run')!;

  // 複窓
  btn.addEventListener('click', async () => {
    port.postMessage({
      windowId,
      ...STATE,
    });

    const controller = await chrome.windows.create({
      url: './controller.html',
      type: 'popup',
      width: 300,
      height: 230,
    });

    controller.alwaysOnTop = true;
  });

  // popupモードかどうか
  checkbox.addEventListener('change', () => {
    STATE.type = checkbox.checked ? 'popup' : 'normal';
    chrome.storage.local.set(STATE);
  });
};
