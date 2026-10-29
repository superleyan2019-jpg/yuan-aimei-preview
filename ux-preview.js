// 手機保留浮動快捷鈕與選單內聯絡連結；一般捲動與頁尾不隱藏浮鈕。
// 錨點仍為原生連結；加上焦點移動，讓鍵盤使用者跳轉後可接續操作。
document.addEventListener('click', event => {
  const link=event.target.closest('a[href^="#"]');
  if(!link || event.defaultPrevented || event.button!==0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const hash=link.getAttribute('href');
  const target=document.getElementById(hash.slice(1));
  if(!target) return;
  event.preventDefault();
  if(location.hash!==hash) history.pushState(null,'',hash);
  // 選單收起後再定位，使用更新後的 Header 高度，避免段落被遮擋。
  requestAnimationFrame(()=>{
    window.uxShowMotionTarget?.(target);
    if(!target.hasAttribute('tabindex')) target.setAttribute('tabindex','-1');
    target.focus({preventScroll:true});
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({behavior:reduced||hash==='#main-content'?'instant':'smooth',block:'start'});
  });
});
