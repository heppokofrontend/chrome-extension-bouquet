import {cssText} from './cssText';
import {run} from './youtube-task';

chrome.runtime.onMessage.addListener((message) => {
  // YouTube窓用のタスク
  if (document.URL.startsWith('https://www.youtube.com/watch')) {
    switch (message.task) {
      // workerから受け取ったwindowTypeがpopupだったとき、CSSを読み込む
      case 'pageload':
        // popupだった場合、調整のCSSを挿入する
        if (message.windowType === 'popup') {
          const style = document.createElement('style');

          style.textContent = cssText;
          document.head.append(style);
        }

        break;

      default:
        if (message.task.startsWith('youtube-')) {
          run(message.task, message.data);
        }

        break;
    }
  }

  if (message.task === 'pageload') {
    window.scroll({
      top: 0,
    });
  }
});

/** workerに読み込みが始まったことを通知する */
const sendToWorker = () => {
  chrome.runtime.sendMessage({
    message: 'loadstart',
    availWidth: window.screen.availWidth,
    availHeight: window.screen.availHeight,
  });
};

sendToWorker();
window.addEventListener('focus', sendToWorker);
