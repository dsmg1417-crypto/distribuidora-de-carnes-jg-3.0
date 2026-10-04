'use strict';
(() => {
  const toggle = document.querySelector('#combos-menu-toggle');
  const panel = document.querySelector('#combos-submenu');
  const links = document.querySelector('#combo-menu-links');
  for(const combo of window.JG_COMBOS) {
    const link=document.createElement('a');link.href=`#seleccion-${combo.id}`;
    const name=document.createElement('span');name.textContent=combo.name;
    const arrow=document.createElement('span');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');
    link.append(name,arrow);links.append(link);
    if(location.hash===link.hash)link.setAttribute('aria-current','page');
  }
  function close(){panel.hidden=true;toggle.setAttribute('aria-expanded','false');}
  toggle.addEventListener('click',()=>{panel.hidden=!panel.hidden;toggle.setAttribute('aria-expanded',String(!panel.hidden));});
  toggle.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();panel.hidden=false;toggle.setAttribute('aria-expanded','true');links.querySelector('a').focus();}});
  document.addEventListener('click',event=>{if(!event.target.closest('.combo-menu'))close();else if(event.target.closest('.combos-submenu a'))close();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){close();toggle.focus();}});
  window.addEventListener('hashchange',close);
})();
