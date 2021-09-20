import {cssText} from './cssText';
import {run} from './video-task';

chrome.runtime.onMessage.addListener((message) => {
  switch (message.task) {
    case 'pageload':
      // YouTube窓用のタスク
      if (document.URL.startsWith('https://www.youtube.com/watch')) {
        // workerから受け取ったwindowTypeがpopupだったとき、CSSを読み込む
        if (message.windowType === 'popup') {
          const style = document.createElement('style');

          style.textContent = cssText;
          document.head.append(style);
        }

        window.scroll({
          top: 0,
        });
      }

      break;

    default:
      if (message.task.startsWith('video-')) {
        run(message.task, message.data);
      }

      break;
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
