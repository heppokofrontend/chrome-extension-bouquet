import {STATE} from './state';

const port = chrome.runtime.connect();
const checkbox = document.querySelector<HTMLInputElement>('#isPopup')!;
const btn = document.querySelector<HTMLButtonElement>('#run')!;

// 複窓
(async () => {
  const win = await chrome.windows.getCurrent();

  btn.addEventListener('click', () => {
    port.postMessage({
      windowId: win.id,
      type: STATE.type,
    });
  });
})();

// popupモードかどうか
checkbox.addEventListener('change', () => {
  STATE.type = checkbox.checked ? 'popup' : 'normal';
  chrome.storage.local.set(STATE);
});
