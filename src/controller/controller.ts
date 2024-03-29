import '../common.scss';
import './controller.scss';
import '../i18n';

const port = chrome.runtime.connect();
const gather = document.querySelector<HTMLButtonElement>('#gather');
const nowVolume = document.querySelector<HTMLSpanElement>('#now-volume')!;
const volume = document.querySelector<HTMLInputElement>('#volume');
const btns = document.querySelectorAll<HTMLButtonElement>('main button');
/**
 * クリックイベントハンドラ
 * @param this - クリックされたボタン
 */
const onclick = function(this: HTMLButtonElement) {
  port.postMessage({
    task: `video-${this.id}`,
  });
};

// 複窓解除
gather?.addEventListener('click', () => {
  port.postMessage({
    task: 'gather',
  });

  window.close();
});

// 音量調整
volume?.addEventListener('change', () => {
  nowVolume.textContent = volume.value;

  port.postMessage({
    task: 'video-volume',
    data: {
      volume: Number(volume.value) / 100,
    },
  });
});

// 再生停止
for (const btn of btns) {
  btn.addEventListener('click', onclick);
}
