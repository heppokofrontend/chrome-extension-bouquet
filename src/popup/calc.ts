import {STATE} from './state';

/**
 * 列数行数の計算
 * @param windowId - chrome.windows.getCurrent().windowId
 */
export const calc = async (windowId: number) => {
  const table = document.querySelector<HTMLTableElement>('#table')!;
  const tabs = await chrome.tabs.query({
    windowId,
  });
  /**
   * 約数を計算する
   * @param num - タブの枚数
   * @returns - 約数一覧
   */
  const getDivisors = (num: number) => {
    const arrbox: number[] = [];

    for (let i = 1; i <= (num / 2); i++) {
      if (num % i === 0) {
        arrbox.push(i);
      }
    }

    arrbox.push(num);

    return arrbox;
  };
  /** タブの枚数 */
  let {length} = tabs;

  // 1～3の場合、それを列数とする
  if (
    length === 1 ||
    length === 2 ||
    length === 3
  ) {
    STATE.cols = length;

    return;
  }

  const divisors = (() => {
    let result = getDivisors(length);

    while (result.length === 2) {
      length++;
      result = getDivisors(length);
    }

    return result;
  })();

  // 奇数の場合は中央値を行数と列数に設定する
  if (divisors.length % 2 !== 0) {
    const center = divisors.slice(((divisors.length + 1) / 2) - 1)[0];

    STATE.cols = center;
    STATE.rows = center;
  } else {
    // 偶数の場合は中央値2つを抽出し、大きいほうを列数とする
    const centerIndex = divisors.length / 2 - 1;
    const [a, b] = divisors.slice(centerIndex, centerIndex + 2);

    STATE.cols = b;
    STATE.rows = a;
  }

  table.textContent += JSON.stringify(STATE);
};
