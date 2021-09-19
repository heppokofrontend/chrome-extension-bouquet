const cssText = `
@media screen and (max-width: 1000px) {
  ytd-masthead {
    opacity: 0 !important;
    transition: 0.2s opacity ease-out;
  }

  ytd-app:not([use-content-visibility]) #page-manager.ytd-app {
    margin-top: 10px !important;
  }

  :hover ytd-masthead,
  ytd-masthead:focus-within {
    opacity: 1 !important;
  }

  :hover ytd-app:not([use-content-visibility]) #page-manager.ytd-app,
  ytd-masthead:focus-within ytd-app:not([use-content-visibility]) #page-manager.ytd-app {
    margin-top: 56px !important;
    transition: 0.2s margin-top ease-out !important;
  }

  .html5-video-container,
  video.video-stream.html5-main-video {
    width: 100% !important;
    height: 100% !important;
  }

  ytd-watch-flexy[flexy] #player-container-outer.ytd-watch-flexy {
    min-width: 100% !important;
  }

  ytd-watch-flexy[flexy] #primary.ytd-watch-flexy {
    min-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }
}
`;

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

      case 'youtube-play':

        break;

      case 'youtube-pause':

        break;

      case 'youtube-stop':

        break;

      case 'youtube-volume':

        break;

      default:
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
