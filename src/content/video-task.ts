/**
 * 動画プレイヤーを操作するタスクのまとめ
 * @param name - タスク名
 * @param data - 指示
 */
export const run = (name: string, data: any) => {
  const videos = document.querySelectorAll<HTMLVideoElement>('video');

  switch (name) {
    case 'video-play':
      for (const video of videos) {
        video.play();
      }

      break;

    case 'video-pause':
      for (const video of videos) {
        video.pause();
      }

      break;

    case 'video-stop':
      for (const video of videos) {
        video.pause();
        video.currentTime = 0;
      }

      break;

    case 'video-volume':
      if (typeof data.volume === 'number') {
        for (const video of videos) {
          video.volume = data.volume;
        }
      }

      break;
    default:
      break;
  }
};
