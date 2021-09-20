import {STATE} from './state';

/**
 * イベントリスナーの登録
 * @param windowId - chrome.windows.getCurrent().windowId
 * @param calcRender - 複窓の状態を計算して結果を画面に出力する
 */
export const addEvent = (windowId: number, calcRender: () => any) => {
  const port = chrome.runtime.connect();
  const checkbox = document.querySelector<HTMLInputElement>('#isPopup')!;
  const btn = document.querySelector<HTMLButtonElement>('#run')!;

  // 複窓
  btn.addEventListener('click', async () => {
    const rows = document.querySelector<HTMLInputElement>('#rows')?.value;
    const cols = document.querySelector<HTMLInputElement>('#cols')?.value;

    STATE.rows = Number(rows) || STATE.rows;
    STATE.cols = Number(cols) || STATE.cols;

    await port.postMessage({
      task: 'windowOpen',
      data: {
        windowId,
        ...STATE,
      },
    });

    calcRender();
  });

  // popupモードかどうか
  checkbox.addEventListener('change', () => {
    STATE.type = checkbox.checked ? 'popup' : 'normal';
    chrome.storage.local.set(STATE);
    calcRender();
  });
};
