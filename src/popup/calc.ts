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
  } else {
    /** 約数 */
    const divisors = (() => {
      let result = getDivisors(length);

      // 約数が「1」とその数字そのものの場合は、1つ数字を増やして再計算する
      while (result.length === 2) {
        length++;
        result = getDivisors(length);
      }

      return result;
    })();

    // 奇数の場合は中央値を行数と列数に設定する
    // e.g: [1, 3, 9] -> 3 : 3
    if (divisors.length % 2 !== 0) {
      const center = divisors.slice(((divisors.length + 1) / 2) - 1)[0];

      STATE.cols = center;
      STATE.rows = center;
    } else {
      // 偶数の場合は中央値2つを抽出し、大きいほうを列数とする
      // e.g: [1, 2, 3, 4, 6, 12] -> 4 : 3
      const centerIndex = divisors.length / 2 - 1;
      const [rows, cols] = divisors.slice(centerIndex, centerIndex + 2);

      STATE.cols = cols;
      STATE.rows = rows;
    }
  }

  table.textContent = '';
  table.insertAdjacentHTML('beforeend', `
    <tbody>
      <tr>
        <th scope="row">type</th>
        <td>${STATE.type}</td>
      </tr>

      ${STATE.type === 'popup' ? `
          <tr>
            <th scope="row"><label for="cols">${chrome.i18n.getMessage('cols')}</label></th>
            <td><input value="${STATE.cols}" type="number" id="cols" /></td>
          </tr>
          <tr>
            <th scope="row"><label for="rows">${chrome.i18n.getMessage('rows')}</label></th>
            <td><input value="${STATE.rows}" type="number" id="rows" /></td>
          </tr>
        ` : ''}
    </tbody>
  `);
};
