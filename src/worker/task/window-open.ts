type Data = {
  windowId: number,
  type: chrome.windows.createTypeEnum,
  rows: number,
  cols: number,
  targets: number[],
};

/**
 * 複窓を開く
 * @param data - 窓を作るときの情報
 */
export const windowOpen = (data: Data) => {
  const {windowId, type, rows, cols, targets} = data;
  /** これから開くウィンドウの種別がpopupであるかどうか */
  const isPopup = type === 'popup';

  (async () => {
    const win = await chrome.windows.get(windowId);

    // 窓のサイズを取得するために最大化
    await chrome.windows.update(windowId, {
      state: 'maximized',
    });

    const options = {
      /** content.jsから受け取るwindow.screen.availWidth */
      availWidth: win.width!,
      /** content.jsから受け取るwindow.screen.availHeight */
      availHeight: win.height!,
    };
    const availWidth = options.availWidth;
    const availHeight = options.availHeight;
    const width = Math.ceil(isPopup ? (availWidth / cols) : 500);
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
    const tabs = await chrome.tabs.query({windowId});

    // 複窓
    for (const tab of tabs) {
      if (typeof tab.id === 'number') {
        /** 複窓用ウィンドウ */
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
        state.left += width;

        if (availWidth < state.left) {
          state.left = 0;
          state.top += state.height;
        }

        if (availHeight < (state.top + state.height)) {
          state.top = 0;
        }
      }
    }

    const controller = await chrome.windows.create({
      url: './controller.html',
      type: 'popup',
      width: 330,
      height: 290,
      focused: true,
    });

    controller.alwaysOnTop = true;
  })();
};
