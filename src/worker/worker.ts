import {windowOpen} from './task/window-open';
import {gather} from './task/gather';

/** このツールで立ち上げた窓のタブID */
const targets: number[] = [];

// ページの読み込みが始まった時にcontent.tsにwindowTypeを連絡する
chrome.runtime.onMessage.addListener(async (_, sender) => {
  if (
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
});

// popupからpostMessageを受け取ったら複窓を展開する
chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async ({task, data}: {
    task: string,
    data: any,
  }) => {
    switch (task) {
      case 'windowOpen':
        windowOpen({
          ...data,
          targets,
        });

        break;

      case 'gather':
        await gather(targets);
        targets.length = 0;

        break;

      default:
        if (task.startsWith('video-')) {
          for (const id of targets) {
            chrome.tabs.sendMessage(id, {
              task,
              data,
            });
          }
        }

        break;
    }
  });
});
