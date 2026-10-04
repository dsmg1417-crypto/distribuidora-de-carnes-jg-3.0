'use strict';
// Preserve the distinct supplied photographs. CSS drives the visible motion,
// so flames do not depend on a slow JavaScript canvas rendering loop.
window.JG_COOKING = (() => {
  const scenes = new Set();
  let enabled = true;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const host = entry.target;
      host.classList.toggle('cooking-visible',entry.isIntersecting);
      if (entry.isIntersecting) host.classList.add('cooking-entered');
    }
  },{threshold:.12});
  function add(host,options={}) {
    const root=document.createElement('div');
    root.className='cooking-scene cooking-ready';
    root.setAttribute('aria-hidden','true');
    root.innerHTML='<div class="live-coals"></div><div class="live-fire live-fire-a"></div><div class="live-fire live-fire-b"></div><div class="live-smoke live-smoke-a"></div><div class="live-smoke live-smoke-b"></div><div class="live-sparks"><i></i><i></i><i></i><i></i><i></i></div>';
    if(options.hero || options.ambient){
      const pepper=document.createElement('div');
      pepper.className='hero-pepper';
      const positions=[[48,16,5,6.3,-1.5],[66,20,7,7.2,-4.7],[80,12,4,5.8,-2.8],[58,37,6,6.8,-5.1],[88,34,5,7.6,-.6],[73,47,7,6.4,-3.4],[43,49,4,7.1,-1.9],[91,53,6,5.9,-4.2],[63,57,5,7.8,-6.1],[78,29,4,6.2,-.2],[54,27,3,7.3,-3.1],[84,43,3,6.7,-5.6]];
      for(const [x,y,size,duration,delay] of positions){
        const grain=document.createElement('i');grain.className='pepper-grain';
        grain.style.cssText=`left:${x}%;top:${y}%;--grain-size:${size}px;--grain-duration:${duration}s;--grain-delay:${delay}s;--grain-travel:${70+size*12}px;`;
        pepper.append(grain);
      }
      root.append(pepper);
    }
    host.classList.add('cooking-host');
    host.style.setProperty('--scene-delay',`${-(options.delay||0)*7}s`);
    host.style.setProperty('--scene-shift',`${Math.round((options.delay||0)*17)}%`);
    host.append(root);
    host.classList.toggle('cooking-paused',!enabled);
    scenes.add(host);observer.observe(host);
  }
  function setEnabled(value) {
    enabled=value;
    for(const host of scenes) {
      if(!host.isConnected){observer.unobserve(host);scenes.delete(host);continue;}
      host.classList.toggle('cooking-paused',!enabled);
    }
  }
  document.addEventListener('visibilitychange',()=>{
    for(const host of scenes)host.classList.toggle('cooking-hidden',document.hidden);
  });
  return {add,setEnabled};
})();

