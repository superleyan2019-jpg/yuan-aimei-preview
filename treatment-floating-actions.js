(() => {
  const actions = document.querySelector('.treatment-floating-actions');
  if (!actions) return;
  actions.querySelector('[data-scroll-top]')?.addEventListener('click', () => {
    window.scrollTo({top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  });
  // 捲到頁尾仍保留快捷鈕；頁尾以右側留白避開按鈕。
})();
