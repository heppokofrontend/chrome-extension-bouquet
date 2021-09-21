type Data = {
  windowId: number,
  type: chrome.windows.createTypeEnum,
  rows: number,
  cols: number,
  targets: number[],
};

/**
 * 通常のウィンドウのサイズを計算する
 * @param tabLength - タブの枚数
 * @param maxWidth - 画面の横幅
 * @param maxHeight - 画面の立幅
 * @return - 通常画面用のサイズ
 */
const getNormalWinSize = (
    tabLength: number,
    maxWidth: number,
    maxHeight: number,
) => {
  let {width, height} = (() => {
    if (tabLength < 4) {
      return {
        width: maxWidth / tabLength,
        height: maxHeight,
      };
    }

    return {
      width: maxWidth / tabLength,
      height: ((): number => {
        /** 16 : 9 */
        const aspectRatio = 0.5625;
        const height = maxWidth / tabLength * aspectRatio + 39 + 140; // タイトルバー＋その他UI

        if (maxHeight / 2 < height) {
          return height;
        }

        return maxHeight / 2;
      })(),
    };
  })();

  if (500 < width) {
    return {
      width: Math.ceil(width),
      height: Math.ceil(height),
    };
  }

  let i = tabLength;

  while (width < 500) {
    i--;

    if (i === 0) {
      width = 500;

      break;
    }

    width = maxWidth / i;
  }

  return {
    width: Math.ceil(width),
    height: Math.ceil(height),
  };
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

    const screen = {
      maxWidth: win.width!,
      maxHeight: win.height!,
    };
    const maxWidth = screen.maxWidth;
    const maxHeight = screen.maxHeight;
    const tabs = await chrome.tabs.query({windowId});
    const {width, height} = isPopup ? {
      width: Math.ceil(maxWidth / cols),
      height: Math.ceil(screen.maxHeight / rows),
    } : getNormalWinSize(
        tabs.length,
        screen.maxWidth,
        screen.maxHeight,
    );
    const state = {
      top: 0,
      left: 0,
      width,
      height,
    };

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

        // console.log({...state, ...screen});

        // 座標計算
        state.left += width;

        if (maxWidth <= state.left) {
          state.left = 0;
          state.top += state.height;
        }

        if (maxHeight < state.top + 100) { // 100は仮の閾値
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
