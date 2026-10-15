(() => {
  const button = document.querySelector('[data-scroll-top]');
  if (!button) return;
  // 回到真正的頁首，包含導覽列；減少動態效果的使用者不啟用滑動動畫。
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  });
})();
