import { $, api, esc, money, mountChrome, productCard, observeReveal, DEPT, DEPT_ORDER, failMessage } from './app.js';

mountChrome('home');
observeReveal();

try {
  const [mods, feat] = await Promise.all([api('/api/modules'), api('/api/products?featured=1&limit=8')]);
  const free = mods.config.freeShippingOver;
  $$free(free);

  const by = Object.fromEntries(mods.modules.map((m) => [m.key, m]));
  $('#depts').innerHTML = DEPT_ORDER.filter((k) => by[k]).map((k) => {
    const m = by[k];
    const d = DEPT[k];
    return `<a class="dept" href="/shop?cat=${k}">
      <div class="dept__art"><img src="/art/${d.art}.svg?c=${d.c}&a=${d.a}" alt="" width="400" height="300" loading="lazy"></div>
      <div class="dept__body"><h3>${esc(m.label)}</h3><p>${esc(m.blurb)}</p><span class="dept__meta">${m.count} products, from ${money(m.from)}</span></div>
    </a>`;
  }).join('');

  $('#featured').innerHTML = feat.items.map(productCard).join('');
} catch (e) {
  console.error(e);
  failMessage($('#depts'), 'The store could not be loaded. Please try again.');
}

function $$free(n) {
  for (const el of document.querySelectorAll('[data-free]')) el.textContent = money(n);
}
