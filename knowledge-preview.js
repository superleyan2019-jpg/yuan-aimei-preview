// 線框資料：前三篇沿用首頁，其餘均為未定稿的主題提案。
const articles=[
 {category:'植牙與重建',tag:'人工植牙',title:'缺牙一定要植牙嗎？先了解常見重建方式與評估重點',description:'從缺牙位置、鄰牙條件、骨質與清潔習慣，了解不同方案為什麼需要個別判斷。',href:'implant.html',treatment:'了解人工植牙療程'},
 {category:'牙齒矯正',tag:'牙齒矯正',title:'傳統矯正與隱形矯正差在哪裡？不只看外觀',description:'配戴方式、清潔習慣、回診配合與齒列難度，都會影響矯正方式的選擇。',href:'orthodontics.html',treatment:'了解牙齒矯正療程'},
 {category:'全瓷美學',tag:'全瓷美學',title:'全瓷冠、嵌體與貼片怎麼分？先看牙齒剩下多少結構',description:'修復方式不只關乎美觀，也需兼顧齒質保存、咬合與日後清潔維護。',href:'ceramic-dsd.html',treatment:'了解全瓷美學療程'},
 {category:'植牙與重建',tag:'All-on-4',title:'考慮全口重建前，可以先整理哪些問題？',description:'主題提案｜整理讀者常見疑問與諮詢前的準備方向，內文待撰寫。',href:'all-on-4.html',treatment:'了解 All-on-4 療程'},
 {category:'根管治療',tag:'根管治療',title:'初次了解顯微根管，診間可以詢問哪些事？',description:'主題提案｜規劃療程說明與看診前的問題清單，內文待撰寫。',href:'microscopic-endodontics.html',treatment:'了解顯微根管療程'},
 {category:'日常照護',tag:'日常照護',title:'每天的口腔清潔，有哪些值得和醫師討論的細節？',description:'主題提案｜規劃日常清潔與定期檢查的衛教文章，內文待撰寫。',href:'index.html#contact',treatment:'查看門診資訊'}
];
// 把製作說明留在頁面外；卡片以摘要呈現讀者會看到的資訊層級。
articles[3].description='從生活中的困擾開始，整理想了解的重建方式與看診時要討論的問題。';
articles[4].description='整理對療程的疑問，讓第一次與醫師討論時，更容易說出自己在意的事。';
articles[5].description='從每天的清潔習慣開始，把操作上的疑問帶到診間一起討論。';
const extraTopics=[
 ['植牙與重建','人工植牙','初次植牙諮詢，如何整理自己的需求？','從日常使用需求與最在意的問題開始，準備一份自己的諮詢清單。',0],
 ['牙齒矯正','牙齒矯正','矯正諮詢前，如何說明自己在意的齒列問題？','把在意的外觀與日常困擾記下來，讓醫師更了解你的期待。',1],
 ['全瓷美學','全瓷美學','討論笑容與修復需求，可以先準備哪些問題？','從自己在意的細節出發，整理與醫師討論時想了解的方向。',2],
 ['根管治療','根管治療','如何整理根管治療的看診紀錄與疑問？','把已有的看診資訊與尚未理解的說明整理好，方便再次討論。',4],
 ['日常照護','日常照護','牙線使用上有疑問，回診時可以怎麼問？','記錄實際操作時遇到的問題，讓診間的清潔說明更貼近日常需要。',5],
 ['日常照護','日常照護','下次看牙前，先整理自己的口腔照護問題','把清潔、使用與看診的疑問分開記下，準備一份方便討論的清單。',5]
];
extraTopics.forEach(([category,tag,title,description,ref])=>articles.push({category,tag,title,description,href:articles[ref].href,treatment:articles[ref].treatment}));
const categories=['全部','植牙與重建','牙齒矯正','全瓷美學','根管治療','日常照護'];
const pageSize=9;
const toc=document.querySelector('.toc');
// 主圖沿用元艾美既有網站素材，依文章分類切換；不取用參考網站圖文。
const articleCovers={
 '人工植牙':['yuan-aimei-v2-assets/implant-hero.png','人工植牙模型情境示意圖'],
 '牙齒矯正':['yuan-aimei-ortho-assets/hero.png','自然微笑的生活情境示意圖'],
 '全瓷美學':['yuan-aimei-ceramic-assets/hero-v3-single.png','微笑與日常生活情境示意圖'],
 'All-on-4':['yuan-aimei-allon4-assets/hero-lifestyle.png','熟齡女性與家人用餐的情境示意圖'],
 '根管治療':['yuan-aimei-micro-endo-assets/hero.png','顯微牙科診療情境示意圖'],
 '日常照護':['yuan-aimei-v2-assets/implant-care.png','牙齒模型與口腔清潔用品情境示意圖']
};
let state={view:'list',id:0,category:'全部',sample:'basic',page:1,section:0};
let lastArticle=-1;
const scrollPositions=new Map();
let navigationIntent='';
// 依具體主題指定延伸閱讀；只顯示目前示意資料中存在的文章，不自動跨分類補位。
const relatedByArticle={
  0:[6,3], 1:[7], 2:[8], 3:[0,6], 4:[9], 5:[10,11],
  6:[0], 7:[1], 8:[2], 9:[4], 10:[5,11], 11:[5,10]
};
// 每篇文章使用對應諮詢主題，共用診所已確認的電話及 LINE。
const bookingTopics=['缺牙重建','牙齒矯正','全瓷修復','全口重建','顯微根管治療','口腔清潔','植牙諮詢','矯正諮詢','笑容與修復','根管治療','牙線使用','口腔照護'];
history.scrollRestoration='manual';

function pool(){return articles.map((a,id)=>({...a,id})).slice(0,state.sample==='extended'?12:6)}
function selected(){return pool().filter(a=>state.category==='全部'||a.category===state.category)}
function route(view='list',id=state.id,section=0){
 const params=new URLSearchParams({sample:state.sample,category:state.category,page:String(state.page)});
 if(section)params.set('section',String(section));
 return '#'+(view==='article'?'article-'+id:'list')+'?'+params;
}
function readRoute(){
 const [name,query='']=location.hash.slice(1).split('?');
 const params=new URLSearchParams(query);
 const match=name.match(/^article-(\d+)$/);
 const id=match?Number(match[1]):0;
 state={view:match&&articles[id]?'article':'list',id,category:categories.includes(params.get('category'))?params.get('category'):'全部',sample:params.get('sample')==='extended'?'extended':'basic',page:Math.max(1,Number.parseInt(params.get('page'),10)||1),section:Math.min(3,Math.max(0,Number.parseInt(params.get('section'),10)||0))};
 state.page=Math.min(state.page,Math.max(1,Math.ceil(selected().length/pageSize)));
}
function renderList(){
 const filtered=selected();const totalPages=Math.ceil(filtered.length/pageSize);
 document.querySelector('#cards').innerHTML=filtered.slice((state.page-1)*pageSize,state.page*pageSize).map(a=>`<article class="card"><a class="card-link" href="${route('article',a.id)}" aria-labelledby="card-title-${a.id}"><span class="tag">${a.tag}</span><h4 id="card-title-${a.id}">${a.title}</h4><p>${a.description}</p><span class="read-label" aria-hidden="true">閱讀文章</span></a></article>`).join('');
 document.querySelector('#list-title').textContent=state.category==='全部'?'全部文章':state.category;
 document.querySelector('#result-count').textContent=`共 ${filtered.length} 篇`;
 document.querySelectorAll('[data-category]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.category===state.category)));
 const pagination=document.querySelector('#pagination');pagination.hidden=totalPages<=1;
 pagination.innerHTML=totalPages<=1?'':`<button class="journal-button" type="button" data-page="${state.page-1}" ${state.page===1?'disabled':''}>上一頁</button>`+Array.from({length:totalPages},(_,i)=>`<button class="journal-button" type="button" data-page="${i+1}" aria-label="第 ${i+1} 頁" ${state.page===i+1?'aria-current="page"':''}>${i+1}</button>`).join('')+`<button class="journal-button" type="button" data-page="${state.page+1}" ${state.page===totalPages?'disabled':''}>下一頁</button>`;
 const pageStatus=document.querySelector('#page-status');pageStatus.hidden=totalPages<=1;pageStatus.textContent=`第 ${state.page} / ${totalPages} 頁`;
}
function renderArticle(){
 const a=articles[state.id];
 document.querySelector('#article-title').textContent=a.title;
 document.querySelector('#article-tag').textContent=a.tag;
 document.querySelector('#article-summary').textContent=a.description;
 document.querySelector('#article-booking-topic').textContent=bookingTopics[state.id]||a.tag;
 const [coverSrc,coverAlt]=articleCovers[a.tag];
 const cover=document.querySelector('#article-cover-image');
 if(cover.getAttribute('src')!==coverSrc)cover.src=coverSrc;
 cover.alt=coverAlt;
 const link=document.querySelector('#treatment-link');link.href=a.href;link.textContent=a.treatment;
 document.querySelectorAll('.toc nav a').forEach((link,i)=>{link.href=route('article',state.id,i+1)});
 document.querySelectorAll('.back-list').forEach(link=>{link.href=route('list')});
 const available=new Map(pool().map(item=>[item.id,item]));
 const related=(relatedByArticle[state.id]||[]).map(id=>available.get(id)).filter(Boolean);
 document.querySelector('#related-links').innerHTML=related.map(item=>`<a href="${route('article',item.id)}">${item.title}</a>`).join('');
 document.querySelector('.related').hidden=related.length===0;
 if(lastArticle!==state.id){toc.open=false;lastArticle=state.id}
}
function render(){
 document.querySelector('#list-view').hidden=state.view!=='list';
 document.querySelector('#article-view').hidden=state.view!=='article';
 document.querySelectorAll('[data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===state.view)));
 document.querySelectorAll('[data-sample]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.sample===state.sample)));
 renderList();if(state.view==='article')renderArticle();
 document.title=(state.view==='article'?articles[state.id].title:'牙科知識')+'｜元艾美｜本機設計預覽';
}
function navigate(intent=''){
 const target=route(state.view,state.id,state.section);
 if(location.hash===target){render();requestAnimationFrame(()=>focusAndScroll(false,intent));return}
 navigationIntent=intent;location.hash=target;
}
document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{state.category=button.dataset.category;state.page=1;state.view='list';state.section=0;navigate('filter')}));
document.querySelector('#pagination').addEventListener('click',event=>{const button=event.target.closest('[data-page]');if(!button||button.disabled)return;state.page=Number(button.dataset.page);state.view='list';state.section=0;navigate('page')});
document.querySelector('#cards').addEventListener('click',event=>{if(event.target.closest('.card-link')){scrollPositions.set(route('list'),scrollY)}});
toc.addEventListener('toggle',()=>{document.querySelector('.toc-state').textContent=toc.open?'收合':'展開'});
function focusAndScroll(initial=false,intent=''){
 if(state.view==='article'){
   const target=state.section?document.querySelector('#section-'+state.section):document.querySelector('#article-title');
   if(!initial||state.section){target.scrollIntoView({block:'start'});target.tabIndex=-1;target.focus({preventScroll:true})}
 }else if(!initial){
   // 分類操作保留分類列與按鈕焦點；翻頁才移到文章列表，返回則還原閱讀位置。
   if(intent==='filter'){
     document.querySelector('.filters').scrollIntoView({block:'start'});
     document.querySelector('[data-category][aria-pressed="true"]').focus({preventScroll:true});
     return;
   }
   const position=intent==='page'||intent==='sample'?undefined:scrollPositions.get(route('list'));
   if(position!==undefined){scrollTo(0,position)}else document.querySelector('#list-title').scrollIntoView({block:'start'});
   document.querySelector('#list-title').focus({preventScroll:true});
 }
}
window.addEventListener('hashchange',event=>{
 let intent=navigationIntent;navigationIntent='';
 const oldHash=new URL(event.oldURL).hash;
 const previousCategory=new URLSearchParams(oldHash.split('?')[1]||'').get('category')||'全部';
 readRoute();
 // 瀏覽器上一頁／下一頁切換分類，也採相同的分類列定位。
 if(!intent&&state.view==='list'&&oldHash.startsWith('#list')&&previousCategory!==state.category)intent='filter';
 render();requestAnimationFrame(()=>focusAndScroll(false,intent));
});
readRoute();render();requestAnimationFrame(()=>focusAndScroll(true));
