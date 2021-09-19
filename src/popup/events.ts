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
  btn.addEventListener('click', () => {
    port.postMessage({
      windowId,
      ...STATE,
    });
  });

  // popupモードかどうか
  checkbox.addEventListener('change', () => {
    STATE.type = checkbox.checked ? 'popup' : 'normal';
    chrome.storage.local.set(STATE);
  });
};
