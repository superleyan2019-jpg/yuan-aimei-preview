// 動畫是漸進增強：HTML/CSS 預設可見，腳本失敗或停用也不會隱藏內容。
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const phone = matchMedia('(max-width: 767px)');
  const seen = new WeakSet();
  const active = new Map();
  const selectors = [
    '.treatments .photo-block',
    '#implant-structure', '#implant-evaluation .visual-pair', '#implant-care .visual-pair',
    '#implant-journey .journey-step'
  ];
  // 精簡版僅讓主要圖文與五步流程進場；標題、一般段落、卡片、預約與導覽直接顯示。
  // FAQ 本輪不加開合動畫，也不改它的既有互動。
  const targets = [...document.querySelectorAll(selectors.join(','))].filter(el=>!el.closest('#implant-faq'));
  function settle(el) {
    seen.add(el);
    active.get(el)?.cancel();
    active.delete(el);
  }
  function showTarget(target) {
    if (!target) return;
    // 錨點目的地及其中內容立即可讀，不讓跳轉後的讀者等待進場。
    [...targets, ...active.keys()].forEach(el=>{
      if (target===el || target.contains(el) || el.contains(target)) settle(el);
    });
  }
  window.uxShowMotionTarget = showTarget;
  const hashTarget = () => {
    try { showTarget(document.getElementById(decodeURIComponent(location.hash.slice(1)))); } catch {}
  };
  hashTarget();
  addEventListener('hashchange',hashTarget);
  addEventListener('popstate',hashTarget);
  document.addEventListener('focusin',event=>showTarget(event.target));
  reduce.addEventListener('change',()=>{
    if(reduce.matches) [...active.keys()].forEach(settle);
  });
  function enter(el, delay=0, hero=false) {
    if(seen.has(el)) return;
    seen.add(el);
    if(reduce.matches || typeof el.animate!=='function') return;
    const duration=phone.matches?400:(hero?520:480);
    const distance=phone.matches||hero?0:10;
    const animation=el.animate([
      {opacity:0,transform:`translateY(${distance}px)`},
      {opacity:1,transform:'translateY(0)'}
    ],{duration,delay:phone.matches?0:delay,easing:'cubic-bezier(.22,.61,.36,1)',fill:'backwards'});
    active.set(el,animation);
    // 完成即移除動畫物件，恢復原本樣式，避免留下 transform 影響排版。
    animation.finished.then(()=>{if(active.get(el)===animation){animation.cancel();active.delete(el);}},()=>{});
  }
  if(!location.hash) {
    document.querySelectorAll('.hero .hero-copy').forEach(el=>enter(el,0,true));
  }
  if(!('IntersectionObserver' in window)) return;
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      const el=entry.target;
      observer.unobserve(el);
      // 已越過頂端的內容不重播；同列項目採 70ms 的小間隔。
      const header=document.querySelector('.site-header').getBoundingClientRect().bottom;
      if(entry.boundingClientRect.top<header) {settle(el);return;}
      const siblings=[...el.parentElement.children].filter(child=>targets.includes(child));
      const index=siblings.indexOf(el);
      enter(el,Math.min(Math.max(index,0)*70,280));
    });
  },{threshold:0.08,rootMargin:'0px 0px -24px 0px'});
  targets.forEach(el=>observer.observe(el));
})();
