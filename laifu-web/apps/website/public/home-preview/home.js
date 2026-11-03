(function () {

const canvas=document.getElementById('yarn'),ctx=canvas.getContext('2d');
const copies=[...document.querySelectorAll('.copy')],opening=document.querySelector('.opening');
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
let seed=413;
function random(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
// Each winding has its own plane and irregularity, avoiding a repeating rosette.
const windings=Array.from({length:260},(_,i)=>({angle:random()*Math.PI*2,tilt:.12+random()*.78,offset:(random()-.5)*.25,phase:random()*Math.PI*2,radius:i%4===0?.15+random()*.65:.65+random()*.34,width:.5+random()*.5,alpha:.65+random()*.35,wobble:random()*.036}));
let width=0,height=0,dpr=1,target=0,progress=0,frame=0;
const scene=document.querySelector('.scene'),journey=document.getElementById('journey');
let sceneBackground='50,52,53',sceneInk='255,255,255';
function resize(){width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);readScroll();requestFrame()}
function readScroll(){target=clamp((scrollY-document.getElementById('journey').offsetTop)/(document.getElementById('journey').offsetHeight-height));requestFrame()}
function requestFrame(){if(!frame)frame=requestAnimationFrame(render)}
function drawWinding(w,r,rotation,opacity){const angle=w.angle+rotation,c=Math.cos(angle),s=Math.sin(angle);ctx.beginPath();for(let j=0;j<=90;j++){const a=j/90*Math.PI*2+w.phase;const wobble=1+Math.sin(a*3+w.phase)*w.wobble;const px=Math.cos(a)*r*w.radius*wobble,py=(Math.sin(a)*w.tilt+w.offset)*r*w.radius;const x=px*c-py*s,y=px*s+py*c;if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.closePath();ctx.strokeStyle='rgba('+sceneBackground+','+(.72*opacity)+')';ctx.lineWidth=w.width+1.15;ctx.stroke();ctx.strokeStyle='rgba('+sceneInk+','+(w.alpha*opacity)+')';ctx.lineWidth=w.width;ctx.stroke()}
function render(){frame=0;progress=reduceMotion?target:progress+(target-progress)*.14;if(Math.abs(target-progress)<.0001)progress=target;const p=progress;
const light=smooth((p-.81)/.18);
const mix=(from,to)=>from.map((n,i)=>Math.round(n+(to[i]-n)*light)).join(',');
sceneBackground=mix([50,52,53],[246,247,245]);sceneInk=mix([255,255,255],[53,66,57]);
const muted=mix([208,214,210],[82,99,87]);
scene.style.setProperty('--scene-ink','rgb('+sceneInk+')');
scene.style.setProperty('--scene-muted','rgb('+muted+')');
scene.style.setProperty('--scene-border','rgba('+sceneInk+',.22)');
journey.style.backgroundColor='rgb('+sceneBackground+')';
ctx.clearRect(0,0,width,height);ctx.fillStyle='rgb('+sceneBackground+')';ctx.fillRect(0,0,width,height);
const initialRadius=Math.min(width*.175,height*.28);
const unravel=smooth((p-.035)/.965),r=initialRadius*(1-.86*unravel);
const x=width*(.5+.35*smooth(p/.94)),y=height*(width<=900?.24:.46);
const rotation=-unravel*5.8;
// The continuous loose strand stays behind as the ball rolls to the right.
if(p>.02){const amount=smooth((p-.02)/.16),startX=Math.max(-30,x-initialRadius*2.8*unravel-width*.15*unravel,width*.44*smooth((p-.75)/.2));ctx.beginPath();ctx.moveTo(startX,y+r*.72);ctx.bezierCurveTo(startX+(x-startX)*.24,y+r*.72+16*amount,x-r*1.7,y+r*.85-12*amount,x-r*.48,y+r*.78);ctx.bezierCurveTo(x-r*.1,y+r*.66,x+r*.16,y+r*.85,x+r*.35,y+r*.43);ctx.strokeStyle='rgba('+sceneInk+','+(.65*amount)+')';ctx.lineWidth=.85;ctx.stroke()}
// The unwound tip reaches the next section at the same horizontal coordinate.
if(p>.87){
const length=smooth((p-.87)/.13),sx=x+r*.35,sy=y+r*.43;
ctx.beginPath();ctx.moveTo(sx,sy);
for(let j=1;j<=70;j++){const t=j/70*length,u=1-t;ctx.lineTo(u*u*u*sx+3*u*u*t*x+3*u*t*t*width*.5+t*t*t*width*.5,u*u*u*sy+3*u*u*t*height*.72+3*u*t*t*height*.7+t*t*t*height)}
ctx.strokeStyle='rgba('+sceneInk+',.65)';ctx.lineWidth=1.1;ctx.stroke();
}
ctx.save();ctx.translate(x,y);const remaining=windings.length*(1-unravel*.85)*(1-smooth((p-.88)/.12));for(let i=0;i<Math.ceil(remaining);i++)drawWinding(windings[i],r,rotation,clamp(remaining-i));ctx.restore();
opening.style.opacity=1-smooth(p/.105);opening.style.transform='translateY('+(-p*60)+'px)';opening.inert=p>.105;opening.setAttribute('aria-hidden',String(p>.105));
copies.forEach(el=>{const start=Number(el.dataset.start),end=Number(el.dataset.end);const enter=smooth((p-start)/.065),leave=1-smooth((p-(end-.065))/.065),visibility=enter*leave;el.style.opacity=visibility;el.style.transform='translateY('+((1-enter)*22-(1-leave)*14)+'px)';el.setAttribute('aria-hidden',visibility<.1?'true':'false');el.querySelectorAll('.line').forEach((line,i)=>{line.style.opacity=smooth((p-start-i*.018)/.065)})});
document.getElementById('percentage').textContent=String(Math.round(p*100)).padStart(2,'0');document.querySelector('.fill').style.width=p*100+'%';
window.sceneState={progress:p,radius:r,x,windings:Math.ceil(remaining),light};headerTheme();if(progress!==target)requestFrame()}
addEventListener('scroll',readScroll,{passive:true});addEventListener('resize',resize);resize();


function headerTheme(){const header=document.getElementById('header');if(header.classList.contains('nav-hidden'))return;const r=document.getElementById('journey').getBoundingClientRect();const onHero=scrollY<document.getElementById('home').offsetHeight;header.classList.toggle('dark',!onHero&&r.top<70&&r.bottom>70&&(window.sceneState?.light||0)<.5);header.classList.toggle('on-hero',onHero)}
const siteHeader=document.getElementById('header');
let previousHeaderY=Math.max(0,scrollY),headerTravel=0;
function showHeader(){siteHeader.classList.remove('nav-hidden');headerTheme()}
function updateHeaderVisibility(){
const currentY=Math.max(0,scrollY),delta=currentY-previousHeaderY;previousHeaderY=currentY;
if(currentY<=document.getElementById('home').offsetHeight*.4){headerTravel=0;showHeader();return}
if(Math.sign(delta)!==Math.sign(headerTravel))headerTravel=0;
headerTravel+=delta;
if(Math.abs(headerTravel)>=10){siteHeader.classList.toggle('nav-hidden',headerTravel>0&&!siteHeader.contains(document.activeElement));headerTravel=0}
headerTheme();
}
addEventListener('scroll',updateHeaderVisibility,{passive:true});addEventListener('resize',headerTheme);
document.addEventListener('keydown',event=>{if(event.key==='Tab')showHeader()});siteHeader.addEventListener('focusin',showHeader);headerTheme();

const concerns=[
{text:'我还没决定要不要离婚，可以先聊聊吗？',group:0},
{text:'已经找了律师，为什么还是不知道下一步怎么办？',group:0},
{text:'一谈孩子和财产就争吵，该怎么准备？',group:1},
{text:'如果分开，怎样安排孩子的生活？',group:2},
{text:'离婚以后，我该怎样重新开始？',group:3}
];
const concernRoutes=[
{text:'离婚陪伴辅导',href:'/services/divorce-coaching/'},
{text:'谈判与调解辅导',href:'/services/mediation-preparation/'},
{text:'孩子养育支持辅导',href:'/services/co-parenting/'},
{text:'离婚后疗愈与重生',href:'/services/post-divorce-recovery/'},
{text:'再婚女性婚前协议与财务边界培训',href:'/services/remarriage-preparation/'},
{text:'高冲突婚姻专项辅导',href:'/services/high-conflict-divorce/'}
];
const concernInput=document.getElementById('concern-input');
let concernIndex=0,letterCount=concerns[0].text.length,deleting=true;
function rotateConcern(){
if(document.activeElement===concernInput||document.hidden){setTimeout(rotateConcern,500);return}
const phrase=concerns[concernIndex].text;
letterCount+=deleting?-1:1;
concernInput.placeholder=phrase.slice(0,letterCount);
let delay=deleting?32:90;
if(letterCount===0){deleting=false;concernIndex=(concernIndex+1)%concerns.length;delay=350}
else if(letterCount===phrase.length&&!deleting){deleting=true;delay=2900}
setTimeout(rotateConcern,delay);
}
if(!reduceMotion)setTimeout(rotateConcern,2900);
const searchResults=document.getElementById('search-results');
function closeSearchResults(){searchResults.hidden=true;concernInput.setAttribute('aria-expanded','false')}
concernInput.addEventListener('input',closeSearchResults);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSearchResults()});
document.addEventListener('click',e=>{if(!e.target.closest('.concern-search'))closeSearchResults()});
document.getElementById('concern-search').addEventListener('submit',e=>{
e.preventDefault();
const query=concernInput.value.trim();
if(!query){closeSearchResults();window.location.assign(concernRoutes[concerns[concernIndex].group].href);return}
const topics=[/离婚|关系|继续|决定|犹豫|要不要|律师|准备|资料/,/财|钱|债|资产|谈|协商|沟通|调解/,/孩|养育|探望|交接|父母/,/疗愈|重建|重新|以后|未来/,/再婚|婚前|协议|边界/,/高冲突|控制|拉扯|威胁|暴力|骚扰|恐吓|操控/];
const matches=topics.flatMap((pattern,index)=>pattern.test(query)?[index]:[]);
if(/再婚|婚前/.test(query)){matches.splice(0,matches.length,4)}
searchResults.replaceChildren();
const message=document.createElement('p');message.textContent=matches.length?'你可以从这些支持开始了解：':'暂未找到直接相关的服务，你可以先了解服务体系或预约咨询。';searchResults.append(message);
const entries=matches.length?matches.map(index=>concernRoutes[index]):[{text:'了解全部服务',href:'/services/'},{text:'预约咨询',href:'/book-consultation/'}];
entries.forEach(entry=>{const link=document.createElement('a');link.href=entry.href;link.target='_self';link.textContent=entry.text;const icon=document.createElement('img');icon.src='/home-preview/arrow-up-right.svg';icon.alt='';link.append(icon);searchResults.append(link)});
searchResults.hidden=false;concernInput.setAttribute('aria-expanded','true');
});
const branchSection=document.getElementById('services'),branchSvg=document.querySelector('.branch-lines');
const branchPaths=[...document.querySelectorAll('.branch')],branchCards=[...document.querySelectorAll('.branch-card')];
function layoutBranches(){
branchSvg.setAttribute('viewBox','0 0 '+innerWidth+' 320');
const center=innerWidth/2;
document.querySelector('.trunk').setAttribute('d','M'+center+' 0 L'+center+' 140');
branchPaths.forEach((path,i)=>{const box=branchCards[i].getBoundingClientRect(),end=box.left+box.width/2;path.setAttribute('d','M'+center+' 140 C'+center+' 220 '+end+' 200 '+end+' 320')});
drawBranches();
}
function drawBranches(){
const rect=branchSection.getBoundingClientRect(),reveal=clamp((innerHeight*.9-rect.top)/(innerHeight*.9));
branchPaths.forEach((path,i)=>{
const amount=reduceMotion?1:smooth((reveal-.1-i*.035)/.55);
path.style.strokeDashoffset=1-amount;
branchCards[i].style.opacity=reduceMotion?1:.12+.88*smooth((amount-.5)/.5);
});
window.branchState={progress:reveal,branches:branchPaths.length};
}
addEventListener('scroll',drawBranches,{passive:true});addEventListener('resize',layoutBranches);layoutBranches();

const paperTabs=[...document.querySelectorAll('.paper-tab')];
document.querySelector('.concern-papers').addEventListener('change',event=>{
if(!event.target.matches('.paper-choice input'))return;
const label=event.target.closest('.paper-choice').querySelector('span').textContent;
event.target.closest('.paper-content').querySelector('.paper-answer-status').textContent='已选择：'+label+'。可继续体验其他主题，或进入完整自测。';
});
let paperOrder=[paperTabs[0],paperTabs[1],paperTabs[2]];
function openPaper(tab){
if(tab.getAttribute('aria-expanded')==='true')return;
const selectedCard=tab.closest('.paper-sheet'),startTransform=getComputedStyle(selectedCard).transform;
document.querySelectorAll('.paper-sheet').forEach(card=>card.getAnimations().forEach(animation=>animation.cancel()));
paperOrder=paperOrder.filter(item=>item!==tab).concat(tab);
paperOrder.forEach((item,slot)=>{const active=item===tab;item.setAttribute('aria-expanded',String(active));document.getElementById(item.getAttribute('aria-controls')).inert=!active;const card=item.closest('.paper-sheet');card.style.zIndex=slot+1;card.style.setProperty('--home-paper-y',slot*46+'px');card.style.setProperty('--home-paper-x',[12,-8,0][slot]+'px');card.style.setProperty('--home-paper-angle',[-.7,.7,0][slot]+'deg')});
if(!reduceMotion)selectedCard.animate([{transform:startTransform},{transform:'translate(-36px,-22px) rotate(-5deg)',offset:.42},{transform:'translate(0px,92px) rotate(0deg)'}],{duration:650,easing:'cubic-bezier(.22,1,.36,1)'});
}
paperTabs.forEach((tab,index)=>{
tab.addEventListener('click',()=>openPaper(tab));
tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(index+1)%paperTabs.length;else if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(index+paperTabs.length-1)%paperTabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=paperTabs.length-1;else return;event.preventDefault();openPaper(paperTabs[next]);paperTabs[next].focus()});
});

const guideList=document.querySelector('.guide-list'),guideReader=document.getElementById('guide-reader'),guideSection=document.getElementById('free-guides'),guideCovers=[...document.querySelectorAll('.guide-cover')];
let activeGuide=0,guideOpening=false;
async function openGuide(index){
if(guideOpening||!guideReader.hidden)return;
const cover=guideCovers[index],href=cover.dataset.readerHref;
if(!href)return;
guideOpening=true;activeGuide=index;
const compactGuide=innerWidth<=900,rect=cover.getBoundingClientRect();
let flyingCover=null;
if(!reduceMotion){
flyingCover=cover.cloneNode(true);flyingCover.classList.add('guide-opening-cover');flyingCover.inert=true;flyingCover.setAttribute('aria-hidden','true');
Object.assign(flyingCover.style,{left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px',background:getComputedStyle(cover).backgroundColor});
document.querySelector('.home-preview').append(flyingCover);guideReader.style.opacity='0';
}
if(!compactGuide){guideSection.style.height=guideSection.getBoundingClientRect().height+'px';guideReader.style.setProperty('--home-guide-reader-height',Math.max(680,guideSection.querySelector('.band-inner').getBoundingClientRect().height)+'px');}
guideSection.classList.add('is-reading');guideList.classList.add('is-reading');guideReader.hidden=false;cover.setAttribute('aria-expanded','true');
document.getElementById('guide-reader-title').textContent=cover.dataset.readerTitle;
const stage=guideReader.querySelector('.guide-book-stage'),frame=document.createElement('iframe');
const readerURL=new URL(href,location.origin);readerURL.searchParams.set('mode','flip');
frame.src=readerURL.pathname+readerURL.search;frame.title=cover.dataset.readerTitle+'在线阅读器';
Object.assign(frame.style,{width:'100%',height:'100%',minHeight:compactGuide?'560px':'500px',border:'0',background:'transparent'});stage.replaceChildren(frame);
if(flyingCover){
await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
const target=stage.getBoundingClientRect();
try{
await flyingCover.animate([{left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px'},{left:target.left+'px',top:target.top+'px',width:Math.min(target.width,rect.width*1.4)+'px',height:target.height+'px'}],{duration:850,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'}).finished;
await Promise.all([flyingCover.animate([{opacity:1},{opacity:0}],{duration:180,fill:'forwards'}).finished,guideReader.animate([{opacity:0},{opacity:1}],{duration:180,fill:'forwards'}).finished]);
}finally{flyingCover.remove();guideReader.style.opacity='';guideReader.getAnimations().forEach(animation=>animation.cancel());}
}
guideOpening=false;guideReader.querySelector('.guide-close').focus({preventScroll:true});
}
function closeGuide(){
if(guideOpening||guideReader.hidden)return;
guideReader.querySelector('.guide-book-stage').replaceChildren();guideReader.hidden=true;
guideSection.classList.remove('is-reading');guideList.classList.remove('is-reading');guideSection.style.height='';guideReader.style.removeProperty('--home-guide-reader-height');
guideCovers.forEach(cover=>cover.setAttribute('aria-expanded','false'));guideCovers[activeGuide].focus({preventScroll:true});
}
guideCovers.forEach((cover,index)=>cover.addEventListener('click',()=>openGuide(index)));
guideReader.querySelector('.guide-close').addEventListener('click',closeGuide);
guideList.addEventListener('keydown',event=>{if(!guideReader.hidden&&event.key==='Escape'){event.preventDefault();closeGuide()}});
window.addEventListener('message',event=>{if(event.origin===location.origin&&event.source===guideReader.querySelector('iframe')?.contentWindow&&event.data==='huanyu-reader-close')closeGuide()});

const motionEase='cubic-bezier(.22,1,.36,1)';
function revealElements(elements,kind='rise',stagger=90){
if(reduceMotion)return;
elements.filter(Boolean).forEach((element,index)=>{
let frames;
if(kind==='image')frames=[{opacity:.2,transform:'scale(1.035)'},{opacity:1,transform:'scale(1)'}];
else if(kind==='paper')frames=[{opacity:.35,transform:getComputedStyle(element).transform+' translateY(18px)'},{opacity:1,transform:getComputedStyle(element).transform+' translateY(0)'}];
else if(kind==='book')frames=[{opacity:.25,transform:'perspective(1000px) rotateY(-8deg) translateY(22px)'},{opacity:1,transform:'perspective(1000px) rotateY(0) translateY(0)'}];
else frames=[{opacity:.2,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}];
element.animate(frames,{duration:kind==='paper'?750:650,delay:index*stagger,easing:motionEase,fill:'backwards'});
});
}
const entranceGroups=new Map();
function enterOnce(selector,callback){const element=document.querySelector(selector);if(element)entranceGroups.set(element,callback)}
const faqTopicsForReveal=[...document.querySelectorAll('.faq-topic')],faqBodyForReveal=document.querySelector('.faq-answer-body');
enterOnce('.service-branches',()=>revealElements([document.querySelector('.branch-heading')]));
enterOnce('.branch-grid',()=>{revealElements([...document.querySelectorAll('.branch-card .image-placeholder')],'image');branchCards.forEach((card,i)=>revealElements([...card.querySelectorAll('h3,p,.service-arrow')],'rise',70+i*10))});
enterOnce('.assessment-section',()=>{revealElements([...document.querySelector('.assessment-intro').children]);revealElements([...document.querySelectorAll('.paper-sheet')],'paper',110)});
enterOnce('.faq-section',()=>{revealElements([document.querySelector('.faq-heading')]);revealElements(faqTopicsForReveal,'rise',65);revealElements([faqBodyForReveal],'rise',0)});
enterOnce('.guides-section',()=>{revealElements([guideSection.querySelector('.band-heading')]);revealElements([...document.querySelectorAll('.guide-item')],'book',100)});
enterOnce('.closing-invitation',()=>revealElements([...document.querySelector('.closing-invitation .shell').children],'rise',110));
enterOnce('.site-footer',()=>revealElements([...document.querySelectorAll('.footer-column')],'rise',60));
const entrances=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entranceGroups.get(entry.target)();entrances.unobserve(entry.target)}})},{threshold:.12});
entranceGroups.forEach((callback,element)=>entrances.observe(element));
revealElements([...document.querySelector('.hero-copy').children],'rise',100);
const hero=document.querySelector('.hero'),heroPhoto=document.querySelector('.hero-photo'),heroCopy=document.querySelector('.hero-copy');
let heroFrame=0;
function updateHeroMotion(){heroFrame=0;const amount=Math.max(0,Math.min(1,scrollY/hero.offsetHeight));heroPhoto.style.transform='scale('+(1.045-.045*amount)+')';heroCopy.style.transform='translateY('+(-32*amount)+'px)';heroCopy.style.opacity=String(1-Math.min(1,amount/.85)*.85)}
addEventListener('scroll',()=>{if(!heroFrame)heroFrame=requestAnimationFrame(updateHeroMotion)},{passive:true});updateHeroMotion();

})();
