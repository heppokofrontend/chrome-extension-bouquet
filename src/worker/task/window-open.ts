type Data = {
  windowId: number,
  type: chrome.windows.createTypeEnum,
  rows: number,
  cols: number,
  availWidth: number,
  availHeight: number,
  targets: number[],
};

/**
 * 複窓を開く
 * @param data - 窓を作るときの情報
 */
export const windowOpen = (data: Data) => {
  const {windowId, type, rows, cols, targets, ...options} = data;
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
  })();
};
