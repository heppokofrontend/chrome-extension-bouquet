import {STATE} from './state';
import '../i18n';

// チェックボックスの状態を復帰
chrome.storage.local.get(['type'], (data) => {
  const checkbox = document.querySelector<HTMLInputElement>(`#isPopup`)!;

  STATE.type = data.type || 'normal';
  checkbox.checked = STATE.type === 'popup';

  // CSS Transitionの有効化
  setTimeout(() => {
    document.body.dataset.state = 'loaded';
  }, 300);
});
