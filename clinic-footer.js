// 手機預設收起診療項目；切換回桌機時自動展開。
(()=>{const menu=document.querySelector('#clinic-footer .cf-footer-treatment-nav');if(!menu)return;
const mobile=matchMedia('(max-width:767px)');const sync=()=>{menu.open=!mobile.matches;};sync();mobile.addEventListener('change',sync);
})();
