const options = {
  availWidth: 0,
  availHeight: 0,
};
const targets: number[] = [];
/** 複窓を開く */
const windowOpen = ({windowId, type, rows, cols}: {
  windowId: number,
  type: chrome.windows.createTypeEnum,
  rows: number,
  cols: number,
}) => {
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
    const hasYoutubeTab = tabs.some((tab) => tab.url?.startsWith('https://www.youtube.com/watch'));

    // YouTubeを含んでいたらコントローラーを表示する
    if (hasYoutubeTab) {
      const controller = await chrome.windows.create({
        url: './controller.html',
        type: 'popup',
        width: 300,
        height: 230,
      });

      controller.alwaysOnTop = true;
    }

    // 複窓
    for (const tab of tabs) {
      if (typeof tab.id === 'number') {
        const win = await chrome.windows.create({
          url: tab.url,
          type,
          ...state,
        });

        // コントローラーで制御できるようにするために、
        // この機能でできたタブのIDをひかえておく
        targets.push(win.tabs![0].id!);

        // 別ウィンドウ化したタブを閉じる
        chrome.tabs.remove(tab.id);

        // 座標計算
        state.left += width - 16;

        if (availWidth < state.left) {
          state.left = 0;
          state.top += state.height;
        }

        if (availHeight < (state.top + state.height)) {
          state.top = 0;
        }
      }
    }
  })();
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
    task: 'pageload',
    windowType: type,
  });

  options.availWidth = availWidth;
  options.availHeight = availHeight;
});

// popupからpostMessageを受け取ったら複窓を展開する
chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(({task, data}) => {
    switch (task) {
      case 'windowOpen':
        windowOpen(data);

        break;

      default:
        break;
    }
  });
});
