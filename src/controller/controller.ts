import '../common.scss';
import './controller.scss';

const port = chrome.runtime.connect();
const nowVolume = document.querySelector<HTMLSpanElement>('#now-volume')!;
const volume = document.querySelector<HTMLInputElement>('#volume');
const btns = document.querySelectorAll<HTMLButtonElement>('button');
/**
 * クリックイベントハンドラ
 * @param this - クリックされたボタン
 */
const onclick = function(this: HTMLButtonElement) {
  port.postMessage({
    task: `youtube-${this.id}`,
  });
};

// 音量調整
volume?.addEventListener('change', () => {
  nowVolume.textContent = volume.value;

  port.postMessage({
    task: 'youtube-volume',
    data: {
      volume: Number(volume.value) / 100,
    },
  });
});

// 再生停止
for (const btn of btns) {
  btn.addEventListener('click', onclick);
}
