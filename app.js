'use strict';
document.documentElement.classList.add('js');
const combos = window.JG_COMBOS;
const grid = document.querySelector('#combo-grid');
const detail = document.querySelector('#detalle-combo');
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
grid.innerHTML = combos.map((combo,index) => `<a class="combo-card reveal" href="#combo-${combo.id}" aria-label="Conocer el combo ${escapeHTML(combo.name)}"><div class="combo-photo"><img src="${combo.image}.webp" alt="Imagen de presentación del combo ${escapeHTML(combo.name)}" loading="lazy" width="640" height="800"><span class="combo-index">COMBO / 0${index+1}</span></div><h3>${escapeHTML(combo.name)}</h3><p class="tag">${escapeHTML(combo.tag)}</p><span class="combo-link">Conocer este combo</span></a>`).join('');
document.querySelectorAll('.combo-photo').forEach((host,index)=>window.JG_COOKING.add(host,{delay:index*.12}));
function renderDetail(id, moveToSection = true) {
  const combo = combos.find(item => item.id === id);
  if (!combo) return;
  const cold = ['carnivoro','junior','premium'].includes(combo.id);
  detail.dataset.atmosphere = cold ? 'cold' : 'grill';
  const price = combo.price == null ? 'Por confirmar' : new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(combo.price);
  detail.innerHTML = `<div class="detail-top"><span>DISTRIBUIDORA DE CARNES JG</span></div><div class="detail-layout"><div class="detail-image"><img src="${combo.image}.webp" alt="Imagen de presentación del combo ${escapeHTML(combo.name)}" width="640" height="800"><p class="photo-note">Imagen de presentación. El contenido es el indicado en la lista.</p></div><div class="detail-copy"><p class="eyebrow">CONOCE TU SELECCIÓN</p><h2 id="detail-title">Combo <em>${escapeHTML(combo.name)}</em></h2><p>${escapeHTML(combo.description)}</p><h3>¿Qué incluye?</h3><ul class="contents-list">${combo.items.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul><div class="price-box"><span>PRECIO DEL COMBO</span><strong>${price}</strong><p>${combo.price == null ? 'El valor de este combo está pendiente de confirmación.' : 'Valor del combo en pesos colombianos.'}</p></div><p class="detail-menu-note">Para explorar otra selección, abre <strong>Combos</strong> en el menú.</p></div></div>`;
  detail.hidden = false;
  const detailHost=document.createElement('div');detailHost.className='detail-cooking-photo';const detailImage=detail.querySelector('.detail-image>img');detailImage.before(detailHost);detailHost.append(detailImage);window.JG_COOKING.add(detailHost,{ambient:!cold});
  const atmosphere=document.createElement('div');atmosphere.className=`combo-atmosphere ${cold?'cold-atmosphere':'grill-atmosphere'}`;atmosphere.setAttribute('aria-hidden','true');
  atmosphere.innerHTML=`<div class="atmosphere-haze"></div>${Array.from({length:cold?10:15},(_,i)=>`<i style="--particle-x:${(i*23+7)%94}%;--particle-y:${(i*17+11)%85}%;--particle-delay:${-i*.79}s;--particle-duration:${5+i%4}s;--particle-size:${cold?18+i%4*7:2+i%3}px"></i>`).join('')}`;
  detailHost.append(atmosphere);
  const label=document.createElement('span');label.className='atmosphere-label';label.textContent=cold?'SELECCIÓN · AMBIENTE DE FRÍO':'SELECCIÓN · AMBIENTE DE PARRILLA';detailHost.append(label);
  document.title = `Combo ${combo.name} · Distribuidora de Carnes JG`;
  if (moveToSection) requestAnimationFrame(() => { detail.focus({preventScroll:true}); });
}
function renderShowcase(id) {
  const combo=combos.find(item=>item.id===id);
  if(!combo)return;
  const cold=['carnivoro','junior','premium'].includes(id);
  const section=document.querySelector('#presentacion-combo');
  section.dataset.atmosphere=cold?'cold':'grill';
  section.innerHTML=`<div class="showcase-photo"><img src="${combo.image}.webp" alt="Presentación del combo ${escapeHTML(combo.name)}" width="1024" height="1280"><div class="combo-atmosphere ${cold?'cold-atmosphere':'grill-atmosphere'}" aria-hidden="true"><div class="atmosphere-haze"></div>${Array.from({length:cold?12:20},(_,i)=>`<i style="--particle-x:${(i*23+7)%94}%;--particle-y:${(i*17+11)%85}%;--particle-delay:${-i*.79}s;--particle-duration:${5+i%4}s;--particle-size:${cold?18+i%4*7:2+i%3}px"></i>`).join('')}</div></div><div class="showcase-copy"><p class="eyebrow">DISTRIBUIDORA DE CARNES JG · COMBO ${String(combos.indexOf(combo)+1).padStart(2,'0')}</p><h1 id="showcase-title">Combo<br><em>${escapeHTML(combo.name)}</em></h1><p class="showcase-tag">${escapeHTML(combo.tag)}</p><p class="showcase-description">${escapeHTML(combo.description)}</p><a class="button showcase-price" href="#combo-${combo.id}">Ver contenido y precio <span aria-hidden="true">↗</span></a><p class="showcase-signature">Calidad que se siente.</p></div>`;
  window.JG_COOKING.add(section.querySelector('.showcase-photo'),{ambient:!cold});
  document.title=`${combo.name} · Distribuidora de Carnes JG`;
}
function syncHash() {
  const hash=location.hash.slice(1)||'inicio';
  const isCombo=hash.startsWith('combo-')&&combos.some(combo=>combo.id===hash.slice(6));
  const isShowcase=hash.startsWith('seleccion-')&&combos.some(combo=>combo.id===hash.slice(10));
  const views=['inicio','combos','res-viva','fuego','origen','galeria'];
  const view=isCombo?'detalle':isShowcase?'presentacion':views.includes(hash)?hash:'inicio';
  if(isCombo)renderDetail(hash.slice(6));
  else if(isShowcase)renderShowcase(hash.slice(10));
  else document.title='Distribuidora de Carnes JG · Calidad que se siente';
  document.querySelectorAll('main>[data-view]').forEach(section=>{section.hidden=section.dataset.view!==view;});
  document.querySelectorAll('.header nav a').forEach(link=>{
    const current=link.getAttribute('href')===`#${isCombo?'seleccion-'+hash.slice(6):isShowcase?hash:view}`;
    if(current)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
  });
  document.querySelector('#combos-menu-toggle').classList.toggle('menu-current',isCombo||isShowcase||view==='combos');
  if(view==='inicio')resizeCanvas();
  requestAnimationFrame(()=>{window.scrollTo({top:0,behavior:'instant'});updateScroll();});
}
window.addEventListener('hashchange',syncHash);
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#combo-"]');
  if (link && link.getAttribute('href') === location.hash) {event.preventDefault(); renderDetail(location.hash.slice(7));}
});
const gallery = [
  ['res','Res · Cortes con carácter'],['pollo','Pollo · Más posibilidades'],['mariscos','Mariscos · Sabor del mar'],['seleccion-carnes','Res, cerdo y pollo'],['combo-caja','La selección en tu mesa'],['distribucion','El universo JG'],['parrilla-atardecer','Una ocasión al aire libre'],['parrilla-mixta','El encuentro con el fuego'],['asado','Buenos momentos a la brasa']
];
const track = document.querySelector('#gallery-track');
track.innerHTML = gallery.map(([image,title]) => `<figure><img src="${image}.webp" alt="${escapeHTML(title)}" loading="lazy" width="600" height="750"><figcaption>${escapeHTML(title)}</figcaption></figure>`).join('');
document.querySelector('#gallery-prev').addEventListener('click',()=>track.scrollBy({left:-track.firstElementChild.getBoundingClientRect().width-22,behavior:isStill()?'instant':'smooth'}));
document.querySelector('#gallery-next').addEventListener('click',()=>track.scrollBy({left:track.firstElementChild.getBoundingClientRect().width+22,behavior:isStill()?'instant':'smooth'}));
track.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();track.scrollBy({left:(event.key==='ArrowRight'?1:-1)*(track.firstElementChild.getBoundingClientRect().width+22),behavior:isStill()?'instant':'smooth'});}});
const revealObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}}),{threshold:.08});
document.querySelectorAll('.reveal').forEach(element=>revealObserver.observe(element));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let userPaused = false;
try { const stored = localStorage.getItem('jg-motion-paused-v5'); if(stored !== null) userPaused = stored === 'true'; } catch {}
function isStill(){return userPaused === null ? reducedMotion.matches : userPaused;}
const motionButton = document.querySelector('#motion-toggle');
let animationId = null;
function updateMotion(){
  document.body.classList.toggle('still',isStill());
  document.body.classList.toggle('motion-enabled',!isStill());
  window.JG_COOKING.setEnabled(!isStill());
  motionButton.setAttribute('aria-pressed',String(isStill()));
  motionButton.setAttribute('aria-label',isStill()?'Activar animaciones':'Pausar animaciones');
  motionButton.innerHTML=`<span aria-hidden="true">${isStill()?'▷':'Ⅱ'}</span><span class="motion-label">${isStill()?'Activar efectos':'Pausar efectos'}</span>`;
  document.querySelectorAll('svg animate').forEach(element=>{const root=element.ownerSVGElement;if(isStill())root.pauseAnimations();else root.unpauseAnimations();});
  if(isStill()){cancelAnimationFrame(animationId);animationId=null;ctx.clearRect(0,0,canvas.width,canvas.height);}else if(animationId===null && !document.hidden){lastFrame=performance.now();animationId=requestAnimationFrame(drawEmbers);}
  updateScroll();
}
motionButton.addEventListener('click',()=>{userPaused=!isStill();try{localStorage.setItem('jg-motion-paused-v5',String(userPaused));}catch{}updateMotion();});
reducedMotion.addEventListener('change',updateMotion);
const story = document.querySelector('.fire-story');
const raw = document.querySelector('.story-raw');
const falling = document.querySelector('.story-falling');
const cooked = document.querySelector('.story-cooked');
const steps = document.querySelectorAll('.story-steps button');
steps.forEach((button,index)=>button.addEventListener('click',()=>{
  if(isStill()){
    story.dataset.stage=String(index);
    steps.forEach((step,i)=>{step.classList.toggle('active',i===index);step.setAttribute('aria-pressed',String(i===index));});
    return;
  }
  const progress=[0,.46,.94][index];
  const top=story.getBoundingClientRect().top+window.scrollY+progress*(story.offsetHeight-innerHeight);
  window.scrollTo({top:Math.max(0,top),behavior:'smooth'});
}));
const hero = document.querySelector('.hero');
const heroImage = document.querySelector('.hero-photo>img');
window.JG_COOKING.add(document.querySelector('.hero-photo'),{hero:true});
window.JG_COOKING.add(document.querySelector('.story-images'),{ambient:true});
const flameLayer = heroImage.cloneNode();
flameLayer.alt='';flameLayer.removeAttribute('fetchpriority');flameLayer.className='live-flame-layer';flameLayer.setAttribute('aria-hidden','true');heroImage.after(flameLayer);
const clamp = (value,min=0,max=1)=>Math.max(min,Math.min(max,value));
function updateScroll(){
  if(isStill())return;
  const rect = story.getBoundingClientRect();
  const progress = clamp(-rect.top/(story.offsetHeight-innerHeight));
  story.style.setProperty('--progress',progress);
  const stage1 = clamp((progress-.12)/.3);
  const stage2 = clamp((progress-.53)/.28);
  raw.style.opacity = 1-stage1;
  raw.style.transform = `scale(${1+progress*.08}) translateY(${progress*50}px)`;
  falling.style.opacity = stage1*(1-stage2);
  falling.style.transform = `translateY(${(1-stage1)*-90}px) scale(${1.02+progress*.035})`;
  cooked.style.opacity = stage2;
  cooked.style.transform = `scale(${1.06-stage2*.06})`;
  steps.forEach((step,index)=>{const active=index===(progress<.35?0:progress<.68?1:2);step.classList.toggle('active',active);step.setAttribute('aria-pressed',String(active));});
  const heroRect = hero.getBoundingClientRect();
  if(heroRect.bottom>0){const shift = clamp(-heroRect.top,0,900)*.09;heroImage.style.transform=`translateY(${shift}px) scale(1.06)`;flameLayer.style.transform=heroImage.style.transform;}
}
let scrollQueued = false;
window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(()=>{updateScroll();scrollQueued=false;});}},{passive:true});
window.addEventListener('resize',updateScroll);
const canvas = document.querySelector('#embers');
const ctx = canvas.getContext('2d');
let particles = [];let canvasWidth=0;let canvasHeight=0;let heroVisible=true;let lastFrame=performance.now();
function newParticle(randomHeight=false){return{x:canvasWidth*(.35+Math.random()*.65),y:randomHeight?Math.random()*canvasHeight:canvasHeight+Math.random()*100,vx:(Math.random()-.5)*.25,vy:.4+Math.random()*.6,r:.6+Math.random()*1.7,alpha:.15+Math.random()*.5};}
function resizeCanvas(){canvasWidth=hero.clientWidth;canvasHeight=hero.clientHeight;const ratio=Math.min(devicePixelRatio||1,1.5);canvas.width=canvasWidth*ratio;canvas.height=canvasHeight*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);particles=Array.from({length:canvasWidth<700?22:45},()=>newParticle(true));}
function drawEmbers(time){
  if(isStill()||document.hidden){animationId=null;return;}
  const delta=Math.min((time-lastFrame)/16.67,3);lastFrame=time;
  ctx.clearRect(0,0,canvasWidth,canvasHeight);
  if(heroVisible){particles.forEach((particle,index)=>{particle.y-=particle.vy*delta;particle.x+=particle.vx*delta;ctx.beginPath();ctx.fillStyle=`rgba(255,${125+Math.round(particle.r*20)},65,${particle.alpha})`;ctx.shadowColor='#ff702b';ctx.shadowBlur=9;ctx.ellipse(particle.x,particle.y,particle.r*.6,particle.r*1.6,.35,0,Math.PI*2);ctx.fill();if(particle.y<-20)particles[index]=newParticle();});}
  animationId=requestAnimationFrame(drawEmbers);
}
new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;},{threshold:0}).observe(hero);
document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(animationId);animationId=null;if(!document.hidden)updateMotion();});
window.addEventListener('resize',resizeCanvas);
resizeCanvas();updateMotion();syncHash();
document.querySelector('#year').textContent=new Date().getFullYear();





