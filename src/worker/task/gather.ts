/**
 * 複窓を解除する
 * @param targets - このツールで立ち上げた窓のタブID
 */
export const gather = async (targets: number[]) => {
  const win = await chrome.windows.create({
    state: 'maximized',
    focused: true,
  });

  for (const tabId of targets) {
    try {
      chrome.tabs.move(tabId, {
        index: -1,
        windowId: win.id,
      });
    } catch {
      // すでに閉じられている
    }
  }

  if (win.tabs?.[0].id) {
    chrome.tabs.remove(win.tabs[0].id);
  }
};
