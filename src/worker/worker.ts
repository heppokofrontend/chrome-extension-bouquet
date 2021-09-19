const options = {
  availWidth: 0,
  availHeight: 0,
};

// ページの読み込みが始まった時にcontent.tsにwindowTypeを連絡する
chrome.runtime.onMessage.addListener(async ({
  message,
  availWidth,
  availHeight,
}, sender) => {
  if (
    message !== 'loadstart' ||
    typeof sender.tab?.id !== 'number' ||
    typeof sender.tab?.windowId !== 'number'
  ) {
    return;
  }

  const {type} = await chrome.windows.get(sender.tab?.windowId);

  chrome.tabs.sendMessage(sender.tab.id, {
    windowType: type,
  });

  options.availWidth = availWidth;
  options.availHeight = availHeight;
});

// popupからpostMessageを受け取ったら複窓を展開する
chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(({windowId, type, rows, cols}) => {
    /** これから開くウィンドウの種別がpopupであるかどうか */
    const isPopup = type === 'popup';

    if (options.availWidth <= 0) {
      return;
    }

    (async () => {
      const tabs = await chrome.tabs.query({windowId});
      const availWidth = options.availWidth;
      const availHeight = options.availHeight;
      const width = Math.ceil(isPopup ? (availWidth / cols) : 500) + 16;
      /** 16 : 9 */
      const aspectRatio = 0.5625;
      const state = {
        top: 0,
        left: 0,
        width: width,
        height: isPopup ?
          Math.ceil(options.availHeight / rows) :
          Math.ceil(width * aspectRatio + 39 + 140), // タイトルバー＋その他UI
      };

      tabs.forEach((tab) => {
        if (typeof tab.id === 'number') {
          console.log(state);

          chrome.windows.create({
            url: tab.url,
            type,
            ...state,
          });

          chrome.tabs.remove(tab.id);

          state.left += width - 16;

          if (availWidth < state.left) {
            state.left = 0;
            state.top += state.height;
          }

          if (availHeight < (state.top + state.height)) {
            state.top = 0;
          }
        }
      });
    })();
  });
});
