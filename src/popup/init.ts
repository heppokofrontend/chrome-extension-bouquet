import {STATE} from './state';

// 他言語処理
const targets = document.querySelectorAll<HTMLElement>('[data-i18n]');

for (const elm of targets) {
  const {i18n} = elm.dataset;

  if (!i18n) {
    continue;
  }

  const textContent = chrome.i18n.getMessage(i18n);

  elm.textContent = textContent;
}

// チェックボックスの状態を復帰
chrome.storage.local.get(['type'], (data) => {
  const checkbox = document.querySelector<HTMLInputElement>(`#isPopup`)!;

  STATE.type = data.type;
  checkbox.checked = STATE.type === 'popup';

  // CSS Transitionの有効化
  setTimeout(() => {
    document.body.dataset.state = 'loaded';
  }, 300);
});
