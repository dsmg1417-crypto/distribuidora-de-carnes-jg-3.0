'use strict';
// Set only the business number supplied by the user, including country code.
window.JG_WHATSAPP_NUMBERS = ['573003438135','573045640932'];
(() => {
  const catalog = window.JG_COMBOS;
  const storageKey = 'jg-cart-v1';
  const dialog = document.querySelector('#cart-dialog');
  const contactDialog = document.querySelector('#contact-dialog');
  const items = document.querySelector('#cart-items');
  const send = document.querySelector('#cart-send');
  const money = value => new Intl.NumberFormat('es-CO', {style:'currency',currency:'COP',maximumFractionDigits:0}).format(value);
  const safe = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  let cart = {};
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    for (const combo of catalog) if(Number.isInteger(saved?.[combo.id]) && saved[combo.id] > 0) cart[combo.id] = Math.min(99,saved[combo.id]);
  } catch {}
  const numbers = () => window.JG_WHATSAPP_NUMBERS.map(value=>String(value).replace(/\D/g,'')).filter(Boolean);
  const number = () => numbers()[0] || '';
  const selected = () => catalog.filter(combo => cart[combo.id]);
  const total = () => selected().reduce((sum,combo) => sum + combo.price * cart[combo.id],0);
  function persist() { try { localStorage.setItem(storageKey,JSON.stringify(cart)); } catch {} }
  function render() {
    const selection = selected();
    const count = selection.reduce((sum,combo) => sum + cart[combo.id],0);
    document.querySelector('#cart-count').textContent = count;
    document.querySelector('#cart-open').setAttribute('aria-label',`Abrir carrito, ${count} ${count===1?'combo':'combos'}`);
    items.innerHTML = selection.length ? selection.map(combo => `<article class="cart-item"><img src="${combo.image}.webp" alt="" width="72" height="90"><div><h3>Combo ${safe(combo.name)}</h3><p>${money(combo.price)} por combo</p><div class="quantity"><button type="button" data-cart-action="less" data-id="${combo.id}" aria-label="Restar un combo ${safe(combo.name)}">−</button><span aria-label="Cantidad">${cart[combo.id]}</span><button type="button" data-cart-action="more" data-id="${combo.id}" aria-label="Sumar un combo ${safe(combo.name)}" ${cart[combo.id]===99?'disabled':''}>+</button><button type="button" class="remove-item" data-cart-action="remove" data-id="${combo.id}" aria-label="Quitar combo ${safe(combo.name)}">Quitar</button></div></div><strong>${money(combo.price*cart[combo.id])}</strong></article>`).join('') : '<div class="cart-empty"><span aria-hidden="true">✦</span><h3>Tu mesa empieza aquí.</h3><p>Entra a Combos desde el menú, conoce cada selección y agrégala a tu carrito.</p></div>';
    document.querySelector('#cart-summary').hidden = !count;
    document.querySelector('#cart-total').textContent = money(total());
    send.disabled = !count || !number();
    document.querySelector('#cart-status').textContent = !count ? '' : !number() ? 'El WhatsApp de JG estará disponible próximamente. Tu selección queda guardada en este navegador.' : '';
  }
  function addDetailButton() {
    const detail = document.querySelector('#detalle-combo');
    const combo = catalog.find(combo => location.hash === `#combo-${combo.id}`);
    if(!combo || !detail.querySelector('.price-box') || detail.querySelector('[data-add-combo]')) return;
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'order-button add-to-cart';
    button.dataset.addCombo = combo.id; button.textContent = 'Agregar al carrito';
    detail.querySelector('.price-box').after(button);
  }
  document.addEventListener('click',event => {
    const add = event.target.closest('[data-add-combo]');
    if(add) {
      const id = add.dataset.addCombo;
      if(!catalog.some(combo => combo.id === id)) return;
      cart[id] = Math.min(99,(cart[id] || 0)+1);persist();render();dialog.showModal();
    }
    const action = event.target.closest('[data-cart-action]');
    if(action) {
      const id = action.dataset.id;
      if(!cart[id]) return;
      const kind = action.dataset.cartAction;
      if(kind==='remove' || (kind==='less' && cart[id]===1)) delete cart[id];
      else cart[id] = Math.min(99,cart[id]+(kind==='more'?1:-1));
      persist();render();
      const target = items.querySelector(`[data-id="${id}"][data-cart-action="${kind}"]`);
      (target || document.querySelector('#cart-close')).focus();
    }
    if(event.target.closest('a[href^="#combo-"]')) queueMicrotask(addDetailButton);
  });
  document.querySelector('#cart-open').addEventListener('click',()=>{render();dialog.showModal();});
  document.querySelector('#cart-close').addEventListener('click',()=>dialog.close());
  document.querySelector('#contact-close').addEventListener('click',()=>contactDialog.close());
  for(const modal of [dialog,contactDialog]) modal.addEventListener('click',event=>{if(event.target===modal){const rect=modal.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)modal.close();}});
  const openWhatsApp = message => {
    if(!number()) return;
    const options=document.querySelector('#whatsapp-options');
    options.innerHTML=numbers().map(phone=>`<a class="whatsapp-choice" href="https://wa.me/${phone}?text=${encodeURIComponent(message)}" target="_blank" rel="noopener noreferrer"><span>Escribir al WhatsApp</span><strong>${phone.slice(2,5)} ${phone.slice(5,8)} ${phone.slice(8)}</strong><span aria-hidden="true">↗</span></a>`).join('');
    document.querySelector('#contact-description').textContent='Elige uno de nuestros dos números. El mensaje estará listo para revisar y enviar.';
    contactDialog.showModal();
  };
  send.addEventListener('click',()=>{
    if(!selected().length || !number()) return;
    const lines = selected().map(combo=>`• ${cart[combo.id]} × Combo ${combo.name}: ${money(combo.price*cart[combo.id])}\n  Incluye por combo: ${combo.items.join('; ')}.`);
    openWhatsApp(`Hola, Distribuidora de Carnes JG. Me interesa este pedido:\n\n${lines.join('\n\n')}\n\nTotal de combos: ${money(total())}.\n¿Me confirman disponibilidad, costo de envío y forma de pago?`);
  });
  document.querySelector('#whatsapp-contact').addEventListener('click',()=>{
    if(!number()) contactDialog.showModal();
    else openWhatsApp(location.hash==='#res-viva' ? 'Hola, Distribuidora de Carnes JG. Me interesa consultar la venta de res viva. ¿Me comparten disponibilidad y condiciones?' : 'Hola, Distribuidora de Carnes JG. Quisiera más información sobre sus productos.');
  });
  window.addEventListener('hashchange',addDetailButton);
  window.addEventListener('storage',event=>{if(event.key===storageKey){try{const saved=JSON.parse(event.newValue||'{}');cart={};for(const combo of catalog)if(Number.isInteger(saved?.[combo.id])&&saved[combo.id]>0)cart[combo.id]=Math.min(99,saved[combo.id]);}catch{}render();}});
  render();addDetailButton();
})();

