// 手機收起次要資訊，門診與聯絡方式持續可見；桌機顯示原有完整內容。
(()=>{const menus=document.querySelectorAll('#clinic-footer .cf-footer-treatment-nav, #clinic-footer .cf-legal-details');if(!menus.length)return;
const mobile=matchMedia('(max-width:767px)');const sync=()=>{menus.forEach(menu=>{menu.open=!mobile.matches;});};sync();mobile.addEventListener('change',sync);
})();
