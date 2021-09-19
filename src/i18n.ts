// 他言語処理
const targets = document.querySelectorAll<HTMLElement>('[data-i18n]');

for (const elm of targets) {
  const {i18n} = elm.dataset;

  if (!i18n) {
    continue;
  }

  const textContent = chrome.i18n.getMessage(i18n);

  elm.textContent = textContent;
}
