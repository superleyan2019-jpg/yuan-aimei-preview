// 僅讓寫實葉片在本次頁面首次進入視野時入場；不監聽滑鼠，不做持續視差。
(() => {
  const intro = document.querySelector('#about-clinic[data-botanical="intro"]');
  if (!intro || !('IntersectionObserver' in window)) return;
  const small = window.matchMedia('(max-width: 576px)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let played = false;
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.12) || played || small.matches || reduce.matches) return;
    played = true;
    intro.dataset.leafState = 'playing';
    observer.disconnect();
  }, { threshold: 0.12 });

  function prepare() {
    observer.disconnect();
    // 使用者在動畫中切換減少動態或轉成手機寬度時，立即停止動畫。
    if (small.matches || reduce.matches) {
      intro.dataset.leafState = small.matches ? 'hidden' : 'static';
    } else if (played) {
      intro.dataset.leafState = 'done';
    } else {
      intro.dataset.leafState = 'pending';
      observer.observe(intro);
    }
  }
  intro.addEventListener('animationend', event => {
    if (event.animationName === 'intro-leaf-arrive') intro.dataset.leafState = 'done';
  });
  small.addEventListener('change', prepare);
  reduce.addEventListener('change', prepare);
  prepare();
})();
