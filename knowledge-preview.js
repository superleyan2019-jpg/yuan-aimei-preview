// 所有列表、文章與延伸閱讀使用已提供的上架包；不顯示示意文章。
const articles=Object.entries(knowledgeArticleContent).map(([id,c])=>({category:'植牙與重建',tag:'人工植牙',href:'implant.html',treatment:'了解人工植牙療程',...c,id:Number(id)}));
const categories=['全部','植牙與重建','牙齒矯正','全瓷美學','根管治療','日常照護'];
const pageSize=9;
const toc=document.querySelector('.toc');
const defaultArticleMarkup={
 summary:document.querySelector('.article-summary').innerHTML,
 body:document.querySelector('.article-body').innerHTML,
 toc:toc.querySelector('nav').innerHTML,
 booking:document.querySelector('.article-booking').innerHTML
};
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
const relatedByArticle=Object.fromEntries(articles.map(a=>[a.id,articles.filter(b=>b.id!==a.id&&b.category===a.category).map(b=>b.id).slice(0,2)]));
// 每篇文章使用對應諮詢主題，共用診所已確認的電話及 LINE。
const bookingTopics=['缺牙重建','牙齒矯正','全瓷修復','全口重建','顯微根管治療','口腔清潔','植牙諮詢','矯正諮詢','笑容與修復','根管治療','牙線使用','口腔照護'];
history.scrollRestoration='manual';

function pool(){return articles}
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
 state={view:match&&articles[id]?'article':'list',id,category:categories.includes(params.get('category'))?params.get('category'):'全部',sample:params.get('sample')==='extended'?'extended':'basic',page:Math.max(1,Number.parseInt(params.get('page'),10)||1),section:Math.min(knowledgeArticleContent[id]?.headings.length||3,Math.max(0,Number.parseInt(params.get('section'),10)||0))};
 state.page=Math.min(state.page,Math.max(1,Math.ceil(selected().length/pageSize)));
}
function renderList(){
 const filtered=selected();const totalPages=Math.ceil(filtered.length/pageSize);
 document.querySelector('#cards').innerHTML=filtered.slice((state.page-1)*pageSize,state.page*pageSize).map(a=>`<article class="card"><a class="card-link" href="${route('article',a.id)}" aria-labelledby="card-title-${a.id}"><img class="card-image" src="${a.cover[0]}" alt="" width="1600" height="900" loading="lazy"><span class="tag">${a.tag}</span><h4 id="card-title-${a.id}">${a.title}</h4><p>${a.description}</p><span class="read-label" aria-hidden="true">閱讀文章</span></a></article>`).join('');
 document.querySelector('#list-title').textContent=state.category==='全部'?'全部文章':state.category;
 document.querySelector('#result-count').textContent=`共 ${filtered.length} 篇`;
 document.querySelectorAll('[data-category]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.category===state.category)));
 const pagination=document.querySelector('#pagination');pagination.hidden=totalPages<=1;
 pagination.innerHTML=totalPages<=1?'':`<button class="journal-button" type="button" data-page="${state.page-1}" ${state.page===1?'disabled':''}>上一頁</button>`+Array.from({length:totalPages},(_,i)=>`<button class="journal-button" type="button" data-page="${i+1}" aria-label="第 ${i+1} 頁" ${state.page===i+1?'aria-current="page"':''}>${i+1}</button>`).join('')+`<button class="journal-button" type="button" data-page="${state.page+1}" ${state.page===totalPages?'disabled':''}>下一頁</button>`;
 const pageStatus=document.querySelector('#page-status');pageStatus.hidden=totalPages<=1;pageStatus.textContent=`第 ${state.page} / ${totalPages} 頁`;
}
function renderArticle(){
 const a=articles[state.id];
 const content=knowledgeArticleContent[state.id];
 // 切換文章時還原共用骨架，避免第一篇的內文、目錄或署名留在其他文章。
 if(lastArticle!==state.id){
  document.querySelector('.article-summary').innerHTML=content?'<p id="article-summary"></p>'+content.intro:defaultArticleMarkup.summary;
  document.querySelector('.article-body').innerHTML=content?content.body+defaultArticleMarkup.body.slice(defaultArticleMarkup.body.indexOf('<div class="treatment-entry">')):defaultArticleMarkup.body;
  toc.querySelector('nav').innerHTML=content?content.headings.map((heading,i)=>'<a href="'+route('article',state.id,i+1)+'">'+heading+'</a>').join(''):defaultArticleMarkup.toc;
  document.querySelector('.article-booking').innerHTML=defaultArticleMarkup.booking;
  if(content){
   document.querySelector('#article-booking-intro').outerHTML=content.booking;
   document.querySelector('.article-booking .journal-button').textContent='預約看診';
  }
 }
 document.querySelector('#article-title').textContent=a.title;
 document.querySelector('#article-tag').textContent=a.tag;
 document.querySelector('#article-summary').textContent=a.description;
 const bookingTopic=document.querySelector('#article-booking-topic');
 if(bookingTopic)bookingTopic.textContent=bookingTopics[state.id]||a.tag;
 const [coverSrc,coverAlt]=content?.cover||articleCovers[a.tag];
 const cover=document.querySelector('#article-cover-image');
 if(cover.getAttribute('src')!==coverSrc)cover.src=coverSrc;
 cover.alt=coverAlt;
 let caption=document.querySelector('.article-cover figcaption');
 if(content?.coverCaption){
  if(!caption){caption=document.createElement('figcaption');cover.parentElement.append(caption)}
  caption.textContent=content.coverCaption;
 }else caption?.remove();
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
