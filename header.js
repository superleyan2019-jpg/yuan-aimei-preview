(() => {
  const header = document.querySelector('.site-header');
  const toggle = header?.querySelector('.header-menu-toggle');
  const navigation = header?.querySelector('.site-header-links');
  if (!header || !toggle || !navigation) return;
  const compact = window.matchMedia('(max-width: 1100px)');
  function setOpen(open, returnFocus = false) {
    header.toggleAttribute('data-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
    toggle.querySelector('path').setAttribute('d', open ? 'M6 6l12 12M6 18 18 6' : 'M4 6h16M4 12h16M4 18h16');
    if (returnFocus) toggle.focus();
  }
  header.setAttribute('data-nav-ready', '');
  toggle.addEventListener('click', () => {
    const open = !header.hasAttribute('data-menu-open');
    setOpen(open);
  });
  header.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.hasAttribute('data-menu-open')) {
      setOpen(false, true);
    }
  });
  navigation.addEventListener('click', event => {
    if (compact.matches && event.target.closest('a')) setOpen(false, true);
  });
  document.addEventListener('click', event => {
    if (compact.matches && !header.contains(event.target)) {
      setOpen(false, navigation.contains(document.activeElement));
    }
  });
  compact.addEventListener('change', () => setOpen(false));
})();
