// 本檔僅提供本機版型互動；正式串接後由確認的評論來源提供真實資料。
(() => {
  const root = document.querySelector('.reviews-preview');
  if (!root) return;
  const track = root.querySelector('.google-review-track');
  const previous = root.querySelector('.review-previous');
  const next = root.querySelector('.review-next');
  const updateNavigation = () => {
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  };
  const move = direction => {
    const card = track.querySelector('.google-review-card');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', updateNavigation, { passive: true });
  // 讓鍵盤使用者也能在卡片之間移動；不自動播放。
  track.addEventListener('keydown', event => {
    if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  });
  new ResizeObserver(updateNavigation).observe(track);
  root.querySelectorAll('.review-expand').forEach(button => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(expanded));
      button.closest('.google-review-card').classList.toggle('is-expanded', expanded);
      button.textContent = expanded ? '收合內容' : '閱讀更多';
    });
  });
  updateNavigation();
})();
