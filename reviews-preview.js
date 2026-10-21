// 本機手動精選評論的輪播與展開功能；不連接 API，也不自動更新評論。
(() => {
  const root = document.querySelector('.reviews-preview');
  if (!root) return;
  const track = root.querySelector('.google-review-track');
  const previous = root.querySelector('.review-previous');
  const next = root.querySelector('.review-next');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const autoplayDelay = 6000;
  let autoplayTimer;
  let inView = false;
  let hovered = false;
  let touching = false;
  // 僅在評論區可見且沒有閱讀／操作時播放；每次操作後重新計時。
  const scheduleAutoplay = () => {
    clearTimeout(autoplayTimer);
    if (!inView || document.hidden || hovered || touching || reducedMotion.matches ||
        root.contains(document.activeElement) || root.querySelector('.is-expanded') ||
        track.scrollWidth <= track.clientWidth + 2) return;
    autoplayTimer = setTimeout(() => {
      if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        move(1);
      }
      scheduleAutoplay();
    }, autoplayDelay);
  };
  const updateNavigation = () => {
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  };
  const move = direction => {
    const card = track.querySelector('.google-review-card');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  };
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', () => { updateNavigation(); scheduleAutoplay(); }, { passive: true });
  // 滑鼠停留、鍵盤焦點、手指拖曳及長文展開時暫停，避免打斷閱讀。
  root.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') { hovered = true; scheduleAutoplay(); }
  });
  root.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') { hovered = false; scheduleAutoplay(); }
  });
  root.addEventListener('pointerdown', () => { touching = true; scheduleAutoplay(); });
  window.addEventListener('pointerup', () => { touching = false; scheduleAutoplay(); });
  window.addEventListener('pointercancel', () => { touching = false; scheduleAutoplay(); });
  root.addEventListener('focusin', scheduleAutoplay);
  root.addEventListener('focusout', () => queueMicrotask(scheduleAutoplay));
  document.addEventListener('visibilitychange', scheduleAutoplay);
  reducedMotion.addEventListener('change', scheduleAutoplay);
  new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    scheduleAutoplay();
  }, { threshold: 0 }).observe(root);
  // 讓鍵盤使用者也能在卡片之間移動。
  track.addEventListener('keydown', event => {
    if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  });
  new ResizeObserver(() => { updateNavigation(); scheduleAutoplay(); }).observe(track);
  root.querySelectorAll('.review-expand').forEach(button => {
    const card = button.closest('.google-review-card');
    const body = card.querySelector('.review-body');
    // 只有超過四行的評論才需要展開；已展開時保留收合按鈕。
    const updateExpansion = () => {
      button.hidden = button.getAttribute('aria-expanded') !== 'true' && body.scrollHeight <= body.clientHeight + 1;
    };
    new ResizeObserver(updateExpansion).observe(body);
    document.fonts.ready.then(updateExpansion);
    updateExpansion();
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(expanded));
      card.classList.toggle('is-expanded', expanded);
      button.textContent = expanded ? '收合內容' : '閱讀更多';
      scheduleAutoplay();
    });
  });
  updateNavigation();
})();
