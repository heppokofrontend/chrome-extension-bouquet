/**
 * YouTube動画プレイヤーを操作するタスクのまとめ
 * @param name - タスク名
 * @param data - 指示
 */
export const run = (name: string, data: any) => {
  const video = document.querySelector<HTMLVideoElement>('ytd-app video');

  if (!video) {
    return;
  }

  switch (name) {
    case 'youtube-play':
      video.play();

      break;

    case 'youtube-pause':
      video.pause();

      break;

    case 'youtube-stop':
      video.pause();
      video.currentTime = 0;

      break;

    case 'youtube-volume':
      if (typeof data.volume === 'number') {
        video.volume = data.volume;
      }

      break;
    default:
      break;
  }
}
