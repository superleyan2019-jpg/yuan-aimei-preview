(() => {
  const actions = document.querySelector('.treatment-floating-actions');
  if (!actions) return;
  actions.querySelector('[data-scroll-top]')?.addEventListener('click', () => {
    window.scrollTo({top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  });
  // 使用與首頁相同的頁尾避讓方式，絕不靠頁尾補高避開按鈕。
  const footer = document.getElementById('clinic-footer');
  if (footer) new IntersectionObserver(entries => {
    actions.toggleAttribute('data-footer-visible', entries[0].isIntersecting);
  }).observe(footer);
})();
