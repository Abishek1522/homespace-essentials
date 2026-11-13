// Shared front-end code: API helper, cart, header and footer, product cards.
document.documentElement.classList.add('js');

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const money = (n) => '₹' + Number(n).toLocaleString('en-IN');

export async function api(path, opts = {}) {
  const { body, headers, ...rest } = opts;
  const res = await fetch(path, {
    ...rest,
    headers: { 'Content-Type': 'application/json', ...(headers ?? {}) },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) throw Object.assign(new Error(data?.error ?? 'request_failed'), { status: res.status, data });
  return data;
}

/* ---------- icons ---------- */
const I = {
  search: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="9" cy="9" r="6"/><path d="M14 14l4 4"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2.5l2.2 11h10.6l2-8H6.4"/><circle cx="9.5" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/></svg>',
  menu: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3 6h14M3 14h14"/></svg>',
  tick: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10.5l4 4 8-9"/></svg>',
  arrow: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10h12M11 5l5 5-5 5"/></svg>',
  star: '<svg class="star" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1.8l2.4 5.2 5.7.6-4.3 3.8 1.2 5.6L10 14.2l-5 2.8 1.2-5.6L1.9 7.6l5.7-.6z"/></svg>',
  done: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="24" cy="24" r="20"/><path d="M15 25l7 7 12-15"/></svg>'
};
export { I as icons };

const LOGO = '<svg class="logo__mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#456f3a"/><path d="M7 16.5L16 8l9 8.5" fill="none" stroke="#e5e1d8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.5 15.5V24h11v-8.5" fill="none" stroke="#e5e1d8" stroke-width="2.4" stroke-linejoin="round"/><rect x="14" y="18.5" width="4" height="5.5" rx="1" fill="#e5e1d8"/></svg>';

/* ---------- departments ---------- */
export const DEPT = {
  electronics: { art: 'tv', c: '3d6b8a', a: 'e0a458' },
  furniture: { art: 'sofa', c: '5b7f6d', a: '2a1d17' },
  vessels: { art: 'dinnerset', c: 'efe8d8', a: '456f3a' },
  cooking: { art: 'cookwareset', c: 'b8bcc0', a: '2a1d17' }
};
export const DEPT_ORDER = ['electronics', 'furniture', 'vessels', 'cooking'];
export const DEPT_LABEL = { electronics: 'Electronics', furniture: 'Furniture', vessels: 'Vessels', cooking: 'Cooking' };

/* ---------- cart (browser storage, priced by the server at checkout) ---------- */
const KEY = 'hs-cart-v1';
let mem = null;
const valid = (i) => i && DEPT_ORDER.includes(i.module) && typeof i.slug === 'string' && Number.isInteger(i.qty) && i.qty > 0;

export const cart = {
  read() {
    if (mem) return mem.map((i) => ({ ...i }));
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(v) ? v.filter(valid).map((i) => ({ module: i.module, slug: i.slug, qty: Math.min(i.qty, 10) })) : [];
    } catch { return []; }
  },
  write(items) {
    mem = items;
    try { localStorage.setItem(KEY, JSON.stringify(items)); mem = null; } catch { /* private mode: keep it in memory for this tab */ }
    window.dispatchEvent(new CustomEvent('cart:change'));
  },
  count() { return this.read().reduce((n, i) => n + i.qty, 0); },
  add(module, slug, qty = 1) {
    const items = this.read();
    const hit = items.find((i) => i.module === module && i.slug === slug);
    if (hit) hit.qty = Math.min(hit.qty + qty, 10); else items.push({ module, slug, qty: Math.min(qty, 10) });
    this.write(items);
  },
  setQty(module, slug, qty) {
    const items = this.read();
    const hit = items.find((i) => i.module === module && i.slug === slug);
    if (!hit) return;
    hit.qty = Math.max(1, Math.min(qty, 10));
    this.write(items);
  },
  remove(module, slug) { this.write(this.read().filter((i) => !(i.module === module && i.slug === slug))); },
  clear() { this.write([]); }
};

/* ---------- toast ---------- */
let toastTimer;
export function toast(html) {
  $('.toast')?.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.innerHTML = html;
  document.body.append(el);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.remove(), 4000);
}

/* ---------- pieces ---------- */
export const productUrl = (p) => `/product?m=${encodeURIComponent(p.module)}&s=${encodeURIComponent(p.slug)}`;

export function priceBlock(p) {
  return `<div class="price"><span class="price__now">${money(p.price)}</span>${p.discount > 0 ? `<span class="price__mrp" aria-label="Original price">${money(p.mrp)}</span><span class="price__off">${p.discount}% off</span>` : ''}</div>`;
}

export function ratingLine(p) {
  if (!p.rating_count) return '';
  return `<div class="pcard__rating">${I.star}<span>${p.rating.toFixed(1)}</span><span>(${p.rating_count.toLocaleString('en-IN')})</span></div>`;
}

export function productCard(p) {
  const out = !p.in_stock;
  return `<article class="pcard">
    <a class="pcard__img" href="${productUrl(p)}" tabindex="-1" aria-hidden="true">
      <img src="${esc(p.image)}" alt="" loading="lazy" width="400" height="300">
      ${out ? '<span class="badge badge--out">Out of stock</span>' : p.discount >= 25 ? `<span class="badge">${p.discount}% off</span>` : ''}
    </a>
    <div class="pcard__body">
      <span class="pcard__brand">${esc(p.brand)}</span>
      <a class="pcard__name" href="${productUrl(p)}">${esc(p.name)}</a>
      ${ratingLine(p)}
      ${priceBlock(p)}
    </div>
    <div class="pcard__foot">
      <button class="btn btn--sm btn--block" type="button" data-add data-m="${esc(p.module)}" data-s="${esc(p.slug)}" data-name="${esc(p.name)}" ${out ? 'disabled' : ''}>${out ? 'Out of stock' : 'Add to cart'}</button>
    </div>
  </article>`;
}

// One listener for every "Add to cart" button on the page.
export function wireAddButtons(root = document) {
  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]');
    if (!b || b.disabled) return;
    cart.add(b.dataset.m, b.dataset.s, 1);
    toast(`<span>Added ${esc(b.dataset.name)}</span><a href="/cart">View cart</a>`);
  });
}

export function observeReveal() {
  const els = $$('.reveal');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach((e) => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  }, { threshold: 0.2 });
  els.forEach((e) => io.observe(e));
}

/* ---------- header and footer ---------- */
export function mountChrome(active = '') {
  const link = (href, label, key) => `<a href="${href}"${active === key ? ' aria-current="page"' : ''}>${label}</a>`;
  const searchForm = (cls) => `<form class="search ${cls}" role="search" action="/shop" method="get"><label class="sr" for="q-${cls}">Search products</label>${I.search}<input id="q-${cls}" type="search" name="q" placeholder="Search products" autocomplete="off"></form>`;
  $('#site-header').outerHTML = `<a class="skip" href="#main">Skip to content</a>
  <header class="site-header"><div class="wrap site-header__bar">
    <a class="logo" href="/" aria-label="Homespace Essentials, home">${LOGO}<span>Homespace Essentials</span></a>
    <nav class="nav" id="nav" aria-label="Main">
      ${searchForm('search--mobile')}
      ${DEPT_ORDER.map((k) => link(`/shop?cat=${k}`, DEPT_LABEL[k], k)).join('')}
      ${link('/order', 'Track an order', 'track')}
    </nav>
    <div class="site-header__tools">
      ${searchForm('search--desktop')}
      <a class="cart-link" href="/cart" aria-label="Cart">${I.cart}<span class="cart-label">Cart</span><span class="cart-count" data-n="0">0</span></a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav" aria-label="Menu">${I.menu}</button>
    </div>
  </div></header>`;

  const f = $('#site-footer');
  if (f) f.outerHTML = `<footer class="site-footer"><div class="wrap">
    <div class="site-footer__grid">
      <div class="site-footer__brand"><a class="logo" href="/">${LOGO}<span>Homespace Essentials</span></a><p>Electronics, furniture, vessels and cooking products for the home, delivered to your door.</p></div>
      <div><h4>Shop</h4><ul>${DEPT_ORDER.map((k) => `<li><a href="/shop?cat=${k}">${DEPT_LABEL[k]}</a></li>`).join('')}<li><a href="/shop">All products</a></li></ul></div>
      <div><h4>Orders</h4><ul><li><a href="/cart">Your cart</a></li><li><a href="/order">Track an order</a></li></ul></div>
      <div><h4>Payment</h4><ul><li>Cash on delivery</li><li>Delivery across India</li></ul></div>
    </div>
    <div class="site-footer__base"><span>© 2026 Homespace Essentials</span><span>Prices include GST</span></div>
  </div></footer>`;

  const badge = $('.cart-count');
  const link2 = $('.cart-link');
  const paint = () => {
    const n = cart.count();
    badge.textContent = n;
    badge.dataset.n = n;
    link2.setAttribute('aria-label', `Cart, ${n} ${n === 1 ? 'item' : 'items'}`);
  };
  paint();
  window.addEventListener('cart:change', paint);
  window.addEventListener('storage', (e) => { if (e.key === KEY) paint(); });

  const toggle = $('.nav-toggle');
  const nav = $('#nav');
  toggle.addEventListener('click', () => {
    const open = nav.dataset.open !== 'true';
    nav.dataset.open = open;
    toggle.setAttribute('aria-expanded', open);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.dataset.open === 'true') { nav.dataset.open = 'false'; toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); } });
  wireAddButtons();
}

export const failMessage = (target, text = 'Something went wrong. Please try again.') => { target.innerHTML = `<div class="empty"><p>${esc(text)}</p><button class="btn" type="button" onclick="location.reload()">Reload</button></div>`; };
