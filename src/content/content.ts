const cssText = `
@media screen and (max-width: 1000px) {
  ytd-masthead {
    opacity: 0 !important;
    transition: 0.2s opacity ease-out;
  }

  ytd-app:not([use-content-visibility]) #page-manager.ytd-app {
    margin-top: 0 !important;
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

// workerから受け取ったwindowTypeがpopupだったとき、CSSを読み込む
chrome.runtime.onMessage.addListener(({windowType}) => {
  // popupだった場合、調整のCSSを挿入する
  if (windowType === 'popup') {
    const style = document.createElement('style');

    style.textContent = cssText;
    document.head.append(style);
  }
});

// workerに読み込みが始まったことを通知する
chrome.runtime.sendMessage({
  message: 'loadstart',
});
