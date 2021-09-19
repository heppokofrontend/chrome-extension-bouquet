import {windowOpen} from './task/window-open';

const options = {
  availWidth: 0,
  availHeight: 0,
};
const targets: number[] = [];

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
  port.onMessage.addListener(({task, data}: {
    task: string,
    data: any,
  }) => {
    switch (task) {
      case 'windowOpen':
        windowOpen({
          ...data,
          ...options,
        });

        break;

      default:
        if (task.startsWith('youtube-')) {
          for (const id of targets) {
            chrome.tabs.sendMessage(id, {
              task,
            });
          }
        }

        break;
    }
  });
});
